// native fetch is available

async function runTest() {
    console.log("=== Testing Twilio Webhook Flow ===");
    
    // 1. Test /twiml/greeting
    console.log("\n[1] Simulating Twilio Call Start (/twiml/greeting)");
    const greetingRes = await fetch("http://localhost:3005/twiml/greeting?clientName=Alex&clientTier=Hot", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            CallSid: 'TEST_CALL_SID_123'
        })
    });
    console.log("Status:", greetingRes.status);
    console.log("Response TwiML:\n", await greetingRes.text());

    // 2. Test /twiml/respond (Menu Selection)
    console.log("\n[2] Simulating User Keypad Press 1 (/twiml/respond)");
    const respondRes = await fetch("http://localhost:3005/twiml/respond?clientName=Alex&clientTier=Hot", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            CallSid: 'TEST_CALL_SID_123',
            Digits: '1'
        })
    });
    console.log("Status:", respondRes.status);
    console.log("Response TwiML:\n", await respondRes.text());

    // 3. Test /twiml/handle-recording (Mocking STT)
    console.log("\n[3] Simulating User Audio Recording (/twiml/handle-recording)");
    console.log("Note: Because Twilio's RecordingUrl isn't real, ElevenLabs STT will fail to fetch, but we can see the backend's error handling and Featherless AI response.");
    const recordRes = await fetch("http://localhost:3005/twiml/handle-recording?clientName=Alex&clientTier=Hot", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            CallSid: 'TEST_CALL_SID_123',
            RecordingUrl: 'http://fake.url/recording'
        })
    });
    console.log("Status:", recordRes.status);
    console.log("Response TwiML:\n", await recordRes.text());
}

runTest().catch(console.error);
