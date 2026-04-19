const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const FormData = require('form-data');
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
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const PORT = process.env.PORT || 3005;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

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

// --- FREE Smart Routing (No AI APIs Needed) ---
async function generateAIResponse(clientName, clientTier, conversationHistory, userInput) {
    const text = userInput.toLowerCase();
    
    let replyText = "I see. Let me have Jaidev follow up with you on that.";
    let widgetData = null;

    if (text.includes("pressed 1") || text.includes("viewing") || text.includes("see")) {
        const bodies = [
            "Wonderful! I can definitely help schedule a property viewing. What days of the week usually work best for you?",
            "Great choice! Let's get a viewing on the calendar. Which days do you have some free time?",
            "Perfect. I'd love to set up a tour for you. Any preference on day or time?"
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
    } else if (text.includes("pressed 2") || text.includes("price") || text.includes("budget") || text.includes("cost")) {
        const bodies = [
            "Absolutely. What's your general budget so we look at the right properties?",
            "Got it. To make sure we're looking at the right properties, could you give me a ballpark figure for your budget?",
            "Okay! How much are you looking to spend?"
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
    } else if (text.includes("pressed 3") || text.includes("jaidev") || text.includes("speak")) {
        const bodies = [
            "Sure thing! I'll make sure Jaidev reaches out to you directly. Is there a specific time that works best for a call?",
            "Understood. I will tell Jaidev to call you. When are you usually free?",
            "Certainly. Jaidev would be happy to speak with you. What time works best?"
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
    } else if (text.includes("pressed 4") || text.includes("email") || text.includes("listings")) {
        const bodies = [
            "Great idea! We can set up those email alerts. What type of property are you most interested in?",
            "You got it. I'll get those listings to your inbox. What kind of properties catch your eye?",
            "Listing alerts are a great way to stay updated. Are you looking for homes, condos, or something else?"
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
    } else if (text.includes("pressed 0") || text.includes("repeat") || text.includes("options")) {
        return { replyText: "You can press 1 to schedule a viewing, 2 for pricing, 3 to speak with Jaidev, 4 for email listings, or 5 to hang up. Or simply tell me what you need!", widgetData: null };
    } else if (text.includes("monday") || text.includes("tuesday") || text.includes("wednesday") || text.includes("thursday") || text.includes("friday") || text.includes("weekend") || text.includes("day") || text.includes("tomorrow")) {
        const bodies = [
            "Perfect, I've noted that down. Is there anything else I can assist with today?",
            "Awesome, that's on the schedule. Anything else on your mind?",
            "Consider it locked in! What else can we help you with?"
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
        widgetData = { importanceScore: 85, tier: "Warm", actionPlan: ["Follow up on viewing", "Send calendar invite", "Confirm property"] };
    } else if (text.includes("million") || text.includes("thousand") || text.includes("k") || /\d/.test(text)) {
        const bodies = [
            "Got it, that gives us a great starting point! Jaidev will send you options in that range soon.",
            "Perfect, that's very helpful to know. We'll start putting together some options for you.",
            "Understood! We'll make sure the properties match that range."
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
        widgetData = { importanceScore: 90, tier: "Hot", actionPlan: ["Send listings in budget", "Call to discuss financing", "Set up portal"] };
    } else if (text.includes("home") || text.includes("condo") || text.includes("house") || text.includes("apartment")) {
        const bodies = [
            "I've updated your preferences. Anything else?",
            "Excellent choice. Was there anything else you wanted to add?",
            "I'll add that to your file. Anything else?"
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
        widgetData = { importanceScore: 70, tier: "Warm", actionPlan: ["Send matching listings", "Follow up call"] };
    } else {
        const bodies = [
            "Thanks for letting me know. I'll pass that along to Jaidev so he can assist you further.",
            "Understood. I will make sure Jaidev gets this information.",
            "I appreciate it. Jaidev will review this shortly."
        ];
        replyText = bodies[Math.floor(Math.random() * bodies.length)];
    }

    return { replyText, widgetData };
}

// --- OpenNote ---
async function createOpenNote(clientName, transcript) {
    console.log(`[OpenNote Disabled] Mock Note created for ${clientName}`);
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
            machineDetection: 'DetectMessageEnd',
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
    const callerNumber = req.body.From;
    console.log(`[INBOUND] Ringing from: ${callerNumber}`);

    const mockDatabaseParams = { name: 'Guest Client', tier: 'New Lead' };
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

    broadcastToAgentDashboard({ type: 'call_started', callSid: callSid });

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.redirect(`https://${serverHost}/twiml/greeting?clientName=${safeName}&clientTier=${safeTier}`);

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: Initial greeting ---
app.post('/twiml/greeting', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body?.CallSid || "unknown";

    const aiText = `Hello ${clientName}! This is MiddleBot calling on behalf of Jaidev's real estate team. How are you today? Press 1 to schedule a viewing, 2 to discuss pricing, 3 to speak with Jaidev, 4 for email listings, or 5 to end call.`;

    if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: aiText });
    broadcastToAgentDashboard({ type: 'agent_speaking', text: aiText, timestamp: new Date().toISOString() });

    const twiml = new twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 1,
        timeout: 10,
        action: `/twiml/respond?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        method: 'POST'
    });

    gather.say({ voice: 'Google.en-US-Neural2-F' }, aiText);
    
    twiml.redirect(`/twiml/noinput?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`);
    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: Handle user numerical menu response ---
app.post('/twiml/respond', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body?.CallSid || "unknown";
    const digits = req.body?.Digits;

    let userInput = digits ? ({
        '1': `I pressed 1 — I want to schedule a property viewing.`,
        '2': `I pressed 2 — I want to discuss pricing and budget.`,
        '3': `I pressed 3 — I want to speak with Jaidev directly.`,
        '4': `I pressed 4 — I want to receive property listings via email.`,
        '5': `I pressed 5 — I want to end the call.`,
        '0': `I pressed 0 — Please repeat the menu options.`
    }[digits] || `I pressed ${digits}.`) : "I didn't press anything. Can you go ahead?";

    if (activeCalls[callSid]) {
        activeCalls[callSid].history.push({ role: 'user', text: userInput });
        createOpenNote(clientName, activeCalls[callSid].history);
    }
    broadcastToAgentDashboard({ type: 'user_speaking', text: userInput, timestamp: new Date().toISOString() });

    if (digits === '5') {
        const farewell = `Thank you so much for your time, ${clientName}! Jaidev will follow up with you personally. Have a wonderful day!`;
        if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: farewell });
        broadcastToAgentDashboard({ type: 'call_ending', text: farewell, timestamp: new Date().toISOString() });
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say({ voice: 'Google.en-US-Neural2-F' }, farewell);
        twiml.hangup();
        return res.type('text/xml').send(twiml.toString());
    }

    const history = activeCalls[callSid]?.history || [];
    const aiResult = await generateAIResponse(clientName, clientTier, history, userInput);
    const aiText = aiResult.replyText || "Okay, let's continue.";

    if (aiResult.widgetData) {
        broadcastToAgentDashboard({ type: 'widget_update', data: aiResult.widgetData, clientName });
    }

    if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: aiText });
    broadcastToAgentDashboard({ type: 'agent_speaking', text: aiText, timestamp: new Date().toISOString() });

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'Google.en-US-Neural2-F' }, aiText);

    twiml.gather({
        input: 'speech',
        action: `/twiml/handle-recording?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        timeout: 5,
        speechTimeout: 'auto'
    });
    twiml.redirect(`/twiml/noinput?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`);

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: Handle audio recording of user speech ---
app.post('/twiml/handle-recording', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const callSid = req.body?.CallSid || "unknown";
    
    // Twilio sends SpeechResult when using Gather input="speech"
    let transcript = req.body?.SpeechResult || req.body?.Digits || "I'm not sure what you said.";

    if (activeCalls[callSid]) {
        activeCalls[callSid].history.push({ role: 'user', text: transcript });
        createOpenNote(clientName, activeCalls[callSid].history);
    }
    broadcastToAgentDashboard({ type: 'user_speaking', text: transcript, timestamp: new Date().toISOString() });

    if (transcript.toLowerCase().includes('goodbye') || transcript.toLowerCase().includes('hang up')) {
        const twiml = new twilio.twiml.VoiceResponse();
        const farewell = `Thank you so much for your time, ${clientName}! Jaidev will follow up with you personally. Have a wonderful day!`;
        if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: farewell });
        broadcastToAgentDashboard({ type: 'call_ending', text: farewell, timestamp: new Date().toISOString() });
        twiml.say({ voice: 'Google.en-US-Neural2-F' }, farewell);
        twiml.hangup();
        return res.type('text/xml').send(twiml.toString());
    }

    const history = activeCalls[callSid]?.history || [];
    const aiResult = await generateAIResponse(clientName, clientTier, history, transcript);
    const aiText = aiResult.replyText || "I'm sorry, I didn't quite catch that.";

    if (aiResult.widgetData) {
        broadcastToAgentDashboard({ type: 'widget_update', data: aiResult.widgetData, clientName });
    }

    if (activeCalls[callSid]) activeCalls[callSid].history.push({ role: 'assistant', text: aiText });
    broadcastToAgentDashboard({ type: 'agent_speaking', text: aiText, timestamp: new Date().toISOString() });

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'Google.en-US-Neural2-F' }, aiText);

    twiml.gather({
        input: 'speech',
        action: `/twiml/handle-recording?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        timeout: 5,
        speechTimeout: 'auto'
    });
    twiml.redirect(`/twiml/noinput?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`);

    res.type('text/xml');
    res.send(twiml.toString());
});

// --- TwiML: No input handler ---
app.post('/twiml/noinput', async (req, res) => {
    const clientName = decodeURIComponent(req.query.clientName || 'there');
    const clientTier = decodeURIComponent(req.query.clientTier || 'Unknown');
    const twiml = new twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 1,
        timeout: 10,
        action: `/twiml/respond?clientName=${encodeURIComponent(clientName)}&clientTier=${encodeURIComponent(clientTier)}`,
        method: 'POST'
    });
    gather.say({ voice: 'Google.en-US-Neural2-F' }, `Are you still there? You can press 1 for viewings, 2 for pricing, 3 for Jaidev, 4 for email, 5 to hang up.`);
    twiml.say({ voice: 'Google.en-US-Neural2-F' }, `It seems like now might not be the best time. Have a great day!`);
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
