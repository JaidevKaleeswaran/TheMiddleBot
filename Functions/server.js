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

// --- ElevenLabs TTS ---
// Generates audio and returns the filename
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
    const systemPrompt = `You are TheMiddleBot, an AI real estate assistant calling on behalf of Jaidev Kaleeswaran, a top-tier Bay Area real estate agent.
You are on the phone with ${clientName} (Priority: ${clientTier}).

RULES:
- Keep responses to 1-2 SHORT sentences. You are on a phone call.
- Sound natural, warm, and professional.
- Use casual filler like "Gotcha", "Perfect", "Sounds good".
- Ask ONE question at a time.
- If they ask something you can't answer, say "Great question — I'll have Jaidev follow up with you on that directly."

CALL FLOW:
1. Ask if they're still actively looking to buy/sell in the Bay Area
2. Ask about their timeline (30, 60, or 90 days)
3. Ask about preferred neighborhoods
4. Ask about budget range
5. Ask if there's anything specific for Jaidev to follow up on
6. Thank them and end

IMPORTANT: 
- ALWAYS remind them they can press: 1 for viewings, 2 for pricing, 3 for Jaidev, 4 for email listings, 5 to end call, or 0 for options again.`;

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
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || "Let me make a note of that for Jaidev.";
    } catch (error) {
        console.error('[Featherless] Error:', error.message);
        return "I appreciate your patience. Jaidev will follow up with you directly.";
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
        if (response.ok) console.log(`[OpenNote] Note created for ${clientName}`);
    } catch (error) {
        console.log(`[OpenNote] Failed to save note for ${clientName}`);
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
            statusCallbackEvent: ['completed'],
            record: true
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

// --- TwiML: Initial greeting ---
app.post('/twiml/greeting', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body.CallSid;

    const initialPrompt = `This is the start of the call. Greet ${clientName} warmly, introduce yourself as MiddleBot calling on behalf of Jaidev Kaleeswaran's real estate team, and ask how they're doing. Then list the keypad options: Press 1 to schedule a viewing, 2 to discuss pricing, 3 to speak with Jaidev, 4 for email listings, 5 to end call, 0 to hear options again.`;

    // Generate text via Featherless
    const aiText = await generateAIResponse(clientName, clientTier, [], initialPrompt);

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
    const gather = twiml.gather({
        input: 'dtmf speech',
        timeout: 10,
        speechTimeout: 'auto',
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

// --- TwiML: Handle user response ---
app.post('/twiml/respond', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body.CallSid;
    const speechResult = req.body.SpeechResult;
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
    } else if (speechResult) {
        userInput = speechResult;
    } else {
        userInput = "I didn't say anything, please continue.";
    }

    if (activeCalls[callSid]) {
        activeCalls[callSid].history.push({ role: 'user', text: userInput });
        createOpenNote(clientName, activeCalls[callSid].history);
    }

    broadcastToAgentDashboard({ type: 'user_speaking', text: userInput, timestamp: new Date().toISOString() });

    // Handle hangup if DTMF 5 or "goodbye"
    if (digits === '5' || (speechResult && speechResult.toLowerCase().includes('goodbye'))) {
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

    // Generate AI response
    const history = activeCalls[callSid]?.history || [];
    const aiText = await generateAIResponse(clientName, clientTier, history, userInput);

    if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: aiText });
    broadcastToAgentDashboard({ type: 'agent_speaking', text: aiText, timestamp: new Date().toISOString() });

    const twiml = new twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        input: 'dtmf speech',
        timeout: 10,
        action: `/twiml/respond?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        method: 'POST'
    });

    try {
        const audioFile = await generateElevenLabsAudio(aiText);
        gather.play(`https://${process.env.SERVER_HOST}/audio/${audioFile}`);
    } catch (e) {
        gather.say({ voice: 'Google.en-US-Neural2-J' }, aiText); // Fallback
    }

    twiml.redirect(`/twiml/noinput?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`);

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: No input handler ---
app.post('/twiml/noinput', async (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        input: 'dtmf speech',
        timeout: 15,
        action: `/twiml/respond?clientName=${req.query.clientName}&clientTier=${req.query.clientTier}`,
        method: 'POST'
    });

    // Use fast fallback TTS for re-prompts to save ElevenLabs credits
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
