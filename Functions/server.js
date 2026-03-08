const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;

// Initiate Outbound Phone Call via ElevenLabs Telephony API
app.post('/api/call', async (req, res) => {
    const { phoneNumber, agentId, clientName, clientTier } = req.body;

    if (!phoneNumber || !agentId) {
        return res.status(400).json({ error: "Phone number and Agent ID are required" });
    }

    try {
        const response = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers/calls', {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: phoneNumber,
                agent_id: agentId,
                // Pass the client context dynamically to the agent making the call
                dynamic_variables: {
                    client_name: clientName || "Client",
                    client_tier: clientTier || "Unknown"
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API failed: ${errorText}`);
        }

        const data = await response.json();
        res.status(200).json({ success: true, callId: data.call_id });
    } catch (error) {
        console.error("Outbound call failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Telephony Engine running on http://localhost:${PORT}`);
});
