const express = require('express');
const cors = require('cors');
const http = require('http');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve temporary audio files for Twilio <Play>
const audioDir = path.join(__dirname, 'temp_audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir);
app.use('/audio', express.static(audioDir));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// --- Configuration ---
const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const FEATHERLESS_API_KEY = process.env.VITE_FEATHERLESS_API_KEY;
const OPENNOTE_API_KEY = process.env.VITE_OPENNOTE_API_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const PORT = process.env.PORT || 3005;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Voice ID for ElevenLabs
const ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

// --- In-memory store for active calls & live transcript ---
const activeCalls = {};
const sseClients = new Set();

app.get('/api/live-transcript', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });
    res.write('data: {"type":"connected"}\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
});

function broadcastToAgentDashboard(event) {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of sseClients) {
        client.write(data);
    }
}

// --- ElevenLabs STT ---
async function transcribeWithElevenLabs(audioUrl) {
    try {
        console.log(`[STT] Fetching recording from: ${audioUrl}`);
        const audioRes = await fetch(audioUrl);
        if (!audioRes.ok) throw new Error("Failed to fetch audio from Twilio");
        const audioBlob = await audioRes.blob();

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        formData.append('model_id', 'scribe_v1');

        console.log(`[STT] Sending to ElevenLabs...`);
        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: formData
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        console.log(`[STT] Transcript: ${data.text}`);
        return data.text || "Transcript unavailable";
    } catch (e) {
        console.error("[ElevenLabs STT Error]:", e);
        return "I could not hear what was said.";
    }
}

// --- ElevenLabs TTS ---
async function generateElevenLabsAudio(text) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5', // Fastest model
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
    });

    if (!response.ok) {
        throw new Error(`ElevenLabs TTS failed: ${await response.text()}`);
    }

    const buffer = await response.arrayBuffer();
    const filename = `${uuidv4()}.mp3`;
    const filepath = path.join(audioDir, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));

    // Auto-cleanup after 5 minutes
    setTimeout(() => fs.unlinkSync(filepath), 5 * 60 * 1000);

    return filename;
}

// --- Featherless AI ---
async function generateAIResponse(clientName, clientTier, conversationHistory, userInput) {
    const systemPrompt = `You are TheMiddleBot, an AI real estate assistant calling on behalf of Jaidev Kaleeswaran.
You are on the phone with ${clientName} (Priority: ${clientTier}).

RULES:
- Keep the spoken reply to 1-2 SHORT sentences.
- Sound natural and warm.
- Ask ONE question at a time.
- If they ask something you can't answer, say "Great question — I'll have Jaidev follow up with you on that directly."
- When appropriate, remind them they can press 5 to end the call or say goodbye.

CRITICAL: You MUST respond in pure JSON format containing exactly two keys: "replyText" (what you will say) and "widgetData".
The "widgetData" key must be a JSON object containing "importanceScore" (integer 0-100), "tier" ("Hot", "Warm", or "Cold"), and "actionPlan" (an array of 3 short strings). Do not wrap the JSON in markdown blocks.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(h => ({ role: h.role, content: h.text })),
        { role: 'user', content: userInput }
    ];

    try {
        const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
                messages,
                max_tokens: 300,
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim() || "{}";
        let parsed = { replyText: "Let me make a note of that for Jaidev.", widgetData: null };
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            console.error("[Featherless JSON Parse Error]:", e, content);
        }
        return parsed;
    } catch (error) {
        console.error('[Featherless] Error:', error.message);
        return { replyText: "I appreciate your patience. Jaidev will follow up with you directly.", widgetData: null };
    }
}

// --- OpenNote ---
async function createOpenNote(clientName, transcript) {
    try {
        const noteText = transcript.map(t => `${t.role === 'assistant' ? 'MiddleBot' : clientName}: ${t.text}`).join('\n');
        const response = await fetch('https://api.opennote.me/v1/notes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENNOTE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `Call with ${clientName} — ${new Date().toLocaleDateString()}`,
                content: noteText,
                tags: ['ai-call', clientName.toLowerCase().replace(/\s/g, '-')]
            })
        });
        if (response.ok) {
            console.log(`[OpenNote] Note created for ${clientName}`);
        } else {
            console.log(`[OpenNote] Request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error(`[OpenNote] Failed to save note for ${clientName}:`, error.message);
    }

    broadcastToAgentDashboard({
        type: 'note_created',
        clientName,
        transcript,
        timestamp: new Date().toISOString()
    });
}

// --- POST /api/call : Initiate outbound call ---
app.post('/api/call', async (req, res) => {
    const { phoneNumber, clientName, clientTier } = req.body;

    try {
        const safeName = encodeURIComponent(clientName || 'Client');
        const safeTier = encodeURIComponent(clientTier || 'Unknown');
        const serverHost = process.env.SERVER_HOST;

        const call = await twilioClient.calls.create({
            from: TWILIO_PHONE_NUMBER,
            to: phoneNumber,
            url: `https://${serverHost}/twiml/greeting?clientName=${safeName}&clientTier=${safeTier}`,
            statusCallback: `https://${serverHost}/twiml/status`,
            statusCallbackEvent: ['completed']
        });

        activeCalls[call.sid] = {
            clientName: clientName || 'Client',
            clientTier: clientTier || 'Unknown',
            history: [],
            startTime: Date.now()
        };

        broadcastToAgentDashboard({ type: 'call_started', callSid: call.sid });
        res.status(200).json({ success: true, callId: call.sid });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Inbound Twilio Webhook Handle ---
app.post('/api/incoming-call', async (req, res) => {
    // Twilio sends the caller's phone number as req.body.From
    const callerNumber = req.body.From;
    console.log(`[INBOUND] Ringing from: ${callerNumber}`);

    // This lookup logic simulates querying mockData.js from the frontend.
    // In production, we would query the database to find the client. 
    // We will hardcode a fallback object to demo the AI workflow.
    const mockDatabaseParams = {
        name: 'Guest Client',
        tier: 'New Lead'
    };

    // Example Phone Mapping logic here (Matches seed data inside mockData)
    if (callerNumber === '+15105571410') {
        mockDatabaseParams.name = 'Johini Eirana';
        mockDatabaseParams.tier = 'Critical';
    } else if (callerNumber === '+16284453201') {
        mockDatabaseParams.name = 'Barara Fuders';
        mockDatabaseParams.tier = 'High';
    }

    const safeName = encodeURIComponent(mockDatabaseParams.name);
    const safeTier = encodeURIComponent(mockDatabaseParams.tier);
    const serverHost = process.env.SERVER_HOST;

    const callSid = req.body.CallSid;

    activeCalls[callSid] = {
        clientName: mockDatabaseParams.name,
        clientTier: mockDatabaseParams.tier,
        history: [],
        startTime: Date.now()
    };

    // Let the frontend know a call is arriving
    broadcastToAgentDashboard({ type: 'call_started', callSid: callSid });

    // Instantly Redirect Twilio into the AI Greeting pipeline we already built!
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.redirect(`https://${serverHost}/twiml/greeting?clientName=${safeName}&clientTier=${safeTier}`);

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: Initial greeting ---
app.post('/twiml/greeting', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body.CallSid;

    const initialPrompt = `This is the start of the call. Greet ${clientName} warmly, introduce yourself as MiddleBot calling on behalf of Jaidev Kaleeswaran's real estate team, and ask how they're doing. Then list the keypad options: Press 1 to schedule a viewing, 2 to discuss pricing, 3 to speak with Jaidev, 4 for email listings, 5 to end call, 0 to hear options again. Remember your response must be in JSON.`;

    // Generate response via Featherless
    const aiResult = await generateAIResponse(clientName, clientTier, [], initialPrompt);
    const aiText = aiResult.replyText || "Hello! Press 1 for viewings, or 5 to end.";

    if (activeCalls[callSid]) {
        activeCalls[callSid].history.push({ role: 'assistant', text: aiText });
    }
    broadcastToAgentDashboard({ type: 'agent_speaking', text: aiText, timestamp: new Date().toISOString() });

    // Generate Audio via ElevenLabs
    let audioFile;
    try {
        audioFile = await generateElevenLabsAudio(aiText);
    } catch (e) {
        console.error('TTS Error:', e);
        audioFile = null;
    }

    const twiml = new twilio.twiml.VoiceResponse();
    // Use gather to explicitly accept only a digit press
    const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 1,
        timeout: 10,
        action: `/twiml/respond?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        method: 'POST'
    });

    if (audioFile) {
        gather.play(`https://${process.env.SERVER_HOST}/audio/${audioFile}`);
    } else {
        gather.say({ voice: 'Google.en-US-Neural2-J' }, aiText); // Fallback
    }

    twiml.redirect(`/twiml/noinput?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`);

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: Handle user numerical menu response ---
app.post('/twiml/respond', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body.CallSid;
    const digits = req.body.Digits;

    let userInput = '';
    if (digits) {
        const dtmfMap = {
            '1': `I pressed 1 — I want to schedule a property viewing.`,
            '2': `I pressed 2 — I want to discuss pricing and budget.`,
            '3': `I pressed 3 — I want to speak with Jaidev directly.`,
            '4': `I pressed 4 — I want to receive property listings via email.`,
            '5': `I pressed 5 — I want to end the call.`,
            '0': `I pressed 0 — Please repeat the menu options.`
        };
        userInput = dtmfMap[digits] || `I pressed ${digits}.`;
    } else {
        userInput = "I didn't press anything. Can you go ahead?";
    }

    if (activeCalls[callSid]) {
        activeCalls[callSid].history.push({ role: 'user', text: userInput });
        createOpenNote(clientName, activeCalls[callSid].history);
    }

    broadcastToAgentDashboard({ type: 'user_speaking', text: userInput, timestamp: new Date().toISOString() });

    // Check hangup digit
    if (digits === '5') {
        const farewell = `Thank you so much for your time, ${clientName}! Jaidev will follow up with you personally. Have a wonderful day!`;
        if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: farewell });
        broadcastToAgentDashboard({ type: 'call_ending', text: farewell, timestamp: new Date().toISOString() });

        const twiml = new twilio.twiml.VoiceResponse();
        try {
            const audioFile = await generateElevenLabsAudio(farewell);
            twiml.play(`https://${process.env.SERVER_HOST}/audio/${audioFile}`);
        } catch (e) {
            twiml.say(farewell);
        }
        twiml.hangup();
        res.type('text/xml');
        return res.send(twiml.toString());
    }

    // Generate AI response to digit press
    const history = activeCalls[callSid]?.history || [];
    const aiResult = await generateAIResponse(clientName, clientTier, history, userInput);
    const aiText = aiResult.replyText || "Okay, let's continue.";

    if (aiResult.widgetData) {
        broadcastToAgentDashboard({ type: 'widget_update', data: aiResult.widgetData, clientName });
    }

    if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: aiText });
    broadcastToAgentDashboard({ type: 'agent_speaking', text: aiText, timestamp: new Date().toISOString() });

    const twiml = new twilio.twiml.VoiceResponse();
    try {
        const audioFile = await generateElevenLabsAudio(aiText);
        twiml.play(`https://${process.env.SERVER_HOST}/audio/${audioFile}`);
    } catch (e) {
        twiml.say({ voice: 'Google.en-US-Neural2-J' }, aiText);
    }

    // Drop into voice conversational loop using Record
    twiml.record({
        action: `/twiml/handle-recording?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        playBeep: false,
        maxLength: 30,
        trim: 'do-not-trim'
    });

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: Handle audio recording of user speech ---
app.post('/twiml/handle-recording', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body.CallSid;
    const recordingUrl = req.body.RecordingUrl;
    
    // 1. Transcribe audio
    let transcript = "No audio recorded.";
    if (recordingUrl) {
        transcript = await transcribeWithElevenLabs(recordingUrl + ".wav");
    }
    
    // 2. Add to history & summarize via OpenNote
    if (activeCalls[callSid]) {
        activeCalls[callSid].history.push({ role: 'user', text: transcript });
        createOpenNote(clientName, activeCalls[callSid].history);
    }
    broadcastToAgentDashboard({ type: 'user_speaking', text: transcript, timestamp: new Date().toISOString() });
    
    // 3. User requested hang up
    if (transcript.toLowerCase().includes('goodbye') || transcript.toLowerCase().includes('hang up')) {
        const twiml = new twilio.twiml.VoiceResponse();
        const farewell = `Thank you so much for your time, ${clientName}! Jaidev will follow up with you personally. Have a wonderful day!`;
        if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: farewell });
        broadcastToAgentDashboard({ type: 'call_ending', text: farewell, timestamp: new Date().toISOString() });
        
        try {
            const audioFile = await generateElevenLabsAudio(farewell);
            twiml.play(`https://${process.env.SERVER_HOST}/audio/${audioFile}`);
        } catch (e) {
            twiml.say(farewell);
        }
        twiml.hangup();
        return res.type('text/xml').send(twiml.toString());
    }
    
    // 4. Generate AI response (incorporates Featherless logic)
    const history = activeCalls[callSid]?.history || [];
    const aiResult = await generateAIResponse(clientName, clientTier, history, transcript);
    const aiText = aiResult.replyText || "I'm sorry, I didn't quite catch that.";

    if (aiResult.widgetData) {
        broadcastToAgentDashboard({ type: 'widget_update', data: aiResult.widgetData, clientName });
    }

    if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: aiText });
    broadcastToAgentDashboard({ type: 'agent_speaking', text: aiText, timestamp: new Date().toISOString() });

    // 5. Play audio and continue Recording Loop
    const twiml = new twilio.twiml.VoiceResponse();
    try {
        const audioFile = await generateElevenLabsAudio(aiText);
        twiml.play(`https://${process.env.SERVER_HOST}/audio/${audioFile}`);
    } catch (e) {
        twiml.say({ voice: 'Google.en-US-Neural2-J' }, aiText);
    }

    twiml.record({
        action: `/twiml/handle-recording?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        playBeep: false,
        maxLength: 30,
        trim: 'do-not-trim'
    });

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: No input handler ---
app.post('/twiml/noinput', async (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 1,
        timeout: 10,
        action: `/twiml/respond?clientName=${req.query.clientName}&clientTier=${req.query.clientTier}`,
        method: 'POST'
    });

    gather.say({ voice: 'Google.en-US-Neural2-J' }, `Are you still there? You can press 1 for viewings, 2 for pricing, 3 for Jaidev, 4 for email, 5 to hang up.`);

    twiml.say({ voice: 'Google.en-US-Neural2-J' }, `It seems like now might not be the best time. Have a great day!`);
    twiml.hangup();

    res.type('text/xml');
    res.send(twiml.toString());
});

app.post('/twiml/status', (req, res) => {
    const callSid = req.body.CallSid;
    if (req.body.CallStatus === 'completed' && activeCalls[callSid]) {
        broadcastToAgentDashboard({ type: 'call_ended', callSid });
        delete activeCalls[callSid];
    }
    res.sendStatus(200);
});

http.createServer(app).listen(PORT, () => console.log(`🚀 Telephony OK on Port ${PORT}`));
