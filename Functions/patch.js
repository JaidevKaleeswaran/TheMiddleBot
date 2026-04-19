const fs = require('fs');

const serverFile = '/Users/jaidevkaleeswaran/TheMiddleBot/Functions/server.js';
let content = fs.readFileSync(serverFile, 'utf8');

// 1. Replace generateAIResponse
content = content.replace(/async function generateAIResponse[\s\S]*?\}\n\n\/\/ --- OpenNote ---/, `// --- Free Smart Routing ---
async function generateAIResponse(clientName, clientTier, conversationHistory, userInput) {
    const text = userInput.toLowerCase();
    let replyText = "I see. Let me have Jaidev follow up with you on that.";
    let widgetData = null;

    if (text.includes("i pressed 1") || text.includes("viewing") || text.includes("see")) {
        replyText = "Wonderful! I can definitely help schedule a property viewing. What days of the week usually work best for you?";
    } else if (text.includes("i pressed 2") || text.includes("price") || text.includes("budget") || text.includes("cost")) {
        replyText = "Absolutely. To make sure we're looking at the right properties, what's your general budget?";
    } else if (text.includes("i pressed 3") || text.includes("jaidev") || text.includes("speak")) {
        replyText = "I'll make sure Jaidev reaches out to you directly. Is there a specific time that works best for a call?";
    } else if (text.includes("i pressed 4") || text.includes("email") || text.includes("listings")) {
        replyText = "Great, I'll set up those email alerts. What type of property are you most interested in?";
    } else if (text.includes("i pressed 0") || text.includes("repeat") || text.includes("options")) {
        replyText = "You can press 1 to schedule a viewing, 2 for pricing, 3 to speak with Jaidev, 4 for email listings, or 5 to hang up. Or simply tell me what you need!";
    } else if (text.includes("monday") || text.includes("tuesday") || text.includes("wednesday") || text.includes("thursday") || text.includes("friday") || text.includes("weekend") || text.includes("day") || text.includes("tomorrow")) {
        replyText = "Perfect, I've noted that down. Is there anything else I can assist with today?";
        widgetData = { importanceScore: 85, tier: "Warm", actionPlan: ["Follow up on viewing", "Send calendar invite", "Confirm property"] };
    } else if (text.includes("million") || text.includes("thousand") || text.includes("k") || /\\d/.test(text)) {
        replyText = "Got it, that gives us a great starting point! Jaidev will send you some options in that range soon.";
        widgetData = { importanceScore: 90, tier: "Hot", actionPlan: ["Send listings in budget", "Call to discuss financing", "Set up portal"] };
    } else if (text.includes("home") || text.includes("condo") || text.includes("house") || text.includes("apartment")) {
        replyText = "Got it. I've updated your preferences. Anything else?";
        widgetData = { importanceScore: 70, tier: "Warm", actionPlan: ["Send matching listings", "Follow up call"] };
    } else {
        replyText = "Thanks for letting me know. I'll pass that along to Jaidev so he can assist you further.";
    }

    return { replyText, widgetData };
}

// --- OpenNote ---`);

// 2. Disable OpenNote API
content = content.replace(/const response = await fetch\\('https:\\/\\/api\\.opennote\\.me\\/v1\\/notes'[\s\S]*?}\\);/g, "/* OpenNote Disabled in Free Tier */\n        const response = { ok: true };");

// 3. Remove ElevenLabs TTS blocks in /twiml/greeting
content = content.replace(/let audioFile;\n    try {[\s\S]*?    \} else \{\n        gather\.say\(\{ voice: 'Google\.en-US-Neural2-J' \}, aiText\);\n    \}/, "gather.say({ voice: 'Google.en-US-Neural2-F' }, aiText);");

// 4. Remove ElevenLabs in twiml/respond for Farewell
content = content.replace(/try \{\n            const audioFile = await generateElevenLabsAudio\(farewell\);\n            twiml\.play\(`https:\/\/\$\{process\.env\.SERVER_HOST\}\/audio\/\$\{audioFile\}`\);\n        \} catch \(e\) \{\n            twiml\.say\(farewell\);\n        \}/g, "twiml.say({ voice: 'Google.en-US-Neural2-F' }, farewell);");

// 5. Remove ElevenLabs in twiml/respond & convert twiml.record to gather speech
content = content.replace(/try \{\n        const audioFile = await generateElevenLabsAudio\(aiText\);\n        twiml\.play\(`https:\/\/\$\{process\.env\.SERVER_HOST\}\/audio\/\$\{audioFile\}`\);\n    \} catch \(e\) \{\n        twiml\.say\(\{ voice: 'Google\.en-US-Neural2-J' \}, aiText\);\n    \}\n\n    twiml\.record\(\{/g, `twiml.say({ voice: 'Google.en-US-Neural2-F' }, aiText);\n\n    twiml.gather({ input: 'speech', timeout: 3, speechTimeout: 'auto',`);
content = content.replace(/playBeep: false,\n        maxLength: 30,\n        trim: 'do-not-trim'/g, ""); // Remove old record arguments

// 6. Handle Twilio SpeechResult instead of ElevenLabs STT
content = content.replace(/const recordingUrl = req\.body\?\.RecordingUrl;\n\n    let transcript = recordingUrl \? await transcribeWithElevenLabs\(recordingUrl \+ "\.wav"\) : "No audio recorded\.";/, `let transcript = req.body?.SpeechResult || req.body?.Digits || "I didn't catch that.";`);

fs.writeFileSync(serverFile, content, 'utf8');
console.log('Patched server.js for 100% Free Tier functionality.');
