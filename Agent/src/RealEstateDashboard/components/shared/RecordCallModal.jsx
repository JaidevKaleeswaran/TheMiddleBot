import React, { useState, useEffect } from 'react';
import { processAIPipeline } from '../../services/aiPipeline';
import { mockClients } from '../../services/mockData';
import { Phone, Mic, Square, Sparkles, X, Loader2, CheckCircle2, PhoneCall, User } from 'lucide-react';

const ELEVENLABS_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

const RecordCallModal = ({ isOpen, onClose, clientId = null }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [completionStatus, setCompletionStatus] = useState(null);
    const [telephonyActive, setTelephonyActive] = useState(false);
    const [isCalling, setIsCalling] = useState(false);

    // Allow user to select a client if opened globally
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        let interval;
        if (isRecording || telephonyActive) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording, telephonyActive]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setIsRecording(false);
            setIsProcessing(false);
            setCompletionStatus(null);
            setRecordingTime(0);
            setTelephonyActive(false);
            // DO NOT reset selectedClientId here so it persists during selection
        } else if (clientId) {
            setSelectedClientId(clientId); // Set initial client if provided
        }
    }, [isOpen, clientId]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentClient = mockClients.find(c => c.id === selectedClientId);

    const startOutboundPhoneCall = async () => {
        if (!currentClient || !currentClient.phone) {
            alert("This client does not have a valid phone number on file.");
            return;
        }

        if (!ELEVENLABS_AGENT_ID) {
            alert("Missing ELEVENLABS_AGENT_ID in your configuration.");
            return;
        }

        setIsCalling(true);
        setCompletionStatus(null);

        try {
            // Initiate the phone call via the local backend router
            const res = await fetch('http://localhost:3005/api/call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: currentClient.phone,
                    agentId: ELEVENLABS_AGENT_ID,
                    clientName: currentClient.name,
                    clientTier: currentClient.tier
                })
            });

            const data = await res.json();

            if (data.success) {
                console.log("Call successfully initiated! Call ID:", data.callId);
                setTelephonyActive(true);
                setIsCalling(false);
            } else {
                throw new Error(data.error);
            }

        } catch (error) {
            console.error("Failed to start phone call:", error);
            alert(`Failed to dialout: ${error.message}\n\nMake sure the Telephony Engine is running on port 3005.`);
            setIsCalling(false);
        }
    };

    const endTelephonyCall = () => {
        setTelephonyActive(false);
        handlePipelineProcessing();
    };

    const handlePipelineProcessing = async () => {
        setIsProcessing(true);
        setCompletionStatus(null);
        try {
            const mockBlob = new Blob([], { type: 'audio/wav' });
            const result = await processAIPipeline(selectedClientId, mockBlob);

            if (result.success) {
                setCompletionStatus('success');
                setIsProcessing(false);
                setTimeout(() => {
                    onClose();
                }, 4000);
            }
        } catch (error) {
            console.error("Pipeline failed:", error);
            setCompletionStatus('error');
            setIsProcessing(false);
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setCompletionStatus(null);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        handlePipelineProcessing();
    };

    if (!isOpen) return null;

    // View for selecting a client if one wasn't passed in
    if (!currentClient) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
                <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 animate-slide-up">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User size={20} className="text-brand-400" /> Select Client
                        </h2>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {mockClients.map(client => (
                            <button
                                key={client.id}
                                onClick={() => setSelectedClientId(client.id)}
                                className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center gap-3 border border-transparent hover:border-slate-700"
                            >
                                <img src={client.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-800" />
                                <div>
                                    <div className="text-white font-bold text-sm">{client.name}</div>
                                    <div className="text-slate-500 text-xs">{client.phone}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isRecording && !isProcessing && !telephonyActive && onClose()} />
            <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="p-6 text-center">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20">
                            <Sparkles size={14} className="text-brand-400" />
                            <span className="text-[10px] font-bold text-brand-300 uppercase tracking-widest">
                                {telephonyActive ? `Live Call: ${currentClient.name}` : 'AI Telephony Engine'}
                            </span>
                        </div>
                        {!isRecording && !isProcessing && !telephonyActive && (
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div className="relative mb-8">
                        <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center transition-all duration-500 
                            ${completionStatus === 'success' ? 'bg-emerald-500/20 scale-110 shadow-[0_0_40px_rgba(16,185,129,0.3)]' :
                                (isProcessing || isCalling) ? 'bg-brand-500/10' :
                                    (isRecording || telephonyActive) ? 'bg-red-500/20 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.4)]' :
                                        'bg-brand-500/20 shadow-[0_0_20px_rgba(var(--brand-500-rgb),0.1)]'}`}>

                            {completionStatus === 'success' ? (
                                <CheckCircle2 size={48} className="text-emerald-400" />
                            ) : (isProcessing || isCalling) ? (
                                <Loader2 size={48} className="text-brand-400 animate-spin" />
                            ) : (isRecording || telephonyActive) ? (
                                <div className="w-10 h-10 bg-red-500 rounded-lg animate-pulse shadow-lg shadow-red-500/50" />
                            ) : (
                                <PhoneCall size={44} className="text-brand-400 drop-shadow-[0_0_8px_rgba(var(--brand-400-rgb),0.5)]" />
                            )}
                        </div>
                        {(isRecording || telephonyActive) && !isProcessing && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-red-500/30 animate-ping" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {completionStatus === 'success' ? 'Telephony Call Complete' :
                            completionStatus === 'error' ? 'Pipeline Error' :
                                isCalling ? `Dialing ${currentClient.name}...` :
                                    isProcessing ? 'Processing AI Insights...' :
                                        telephonyActive ? 'Call Connected' :
                                            isRecording ? 'Manual Capture Active' : `Call ${currentClient.name}`}
                    </h2>

                    <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4 max-w-sm mx-auto">
                        {completionStatus === 'success' ? 'Call analysis complete. Score updated and insights stored in CRM.' :
                            completionStatus === 'error' ? 'Something went wrong. Check your API configuration.' :
                                isCalling ? 'Bridging connection to ElevenLabs outbound SIP servers...' :
                                    isProcessing ? 'Multiplexing through ElevenLabs and Featherless AI engine...' :
                                        (isRecording || telephonyActive) ? 'Live audio stream active. MiddleBot is extracting deal sentiment.' :
                                            'Connect your AI Assistant directly to their real world phone number.'}
                    </p>

                    {(isRecording || telephonyActive) && (
                        <div className="text-5xl font-mono text-white font-black mb-10 tracking-tighter tabular-nums drop-shadow-md">
                            {formatTime(recordingTime)}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {completionStatus === 'success' ? (
                            <button onClick={onClose} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20">Done</button>
                        ) : (isProcessing || isCalling) ? (
                            <div className="w-full py-4 bg-slate-800/80 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-3 border border-slate-700 animate-pulse">
                                {isCalling ? 'Dialing...' : 'Analyzing Audio...'}
                            </div>
                        ) : telephonyActive ? (
                            <button onClick={endTelephonyCall} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <Square size={20} fill="currentColor" /> Disconnect Call
                            </button>
                        ) : isRecording ? (
                            <button onClick={stopRecording} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <Square size={20} fill="currentColor" /> Stop Capturing
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={startOutboundPhoneCall} className="py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl font-bold shadow-xl shadow-brand-500/20 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 group">
                                    <PhoneCall size={20} className="group-hover:animate-bounce" />
                                    <span className="text-[10px] uppercase tracking-widest">Dial Mobile</span>
                                </button>
                                <button onClick={startRecording} className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold border border-slate-700 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 group">
                                    <Mic size={20} className="group-hover:text-white" />
                                    <span className="text-[10px] uppercase tracking-widest">Manual Record</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 border-t border-slate-700 flex justify-between items-center text-[8px] font-black tracking-[0.2em] text-slate-500 uppercase">
                    <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-slate-700 rounded border border-slate-600">ELEVENLABS TEL</span>
                        <span className="px-2 py-0.5 bg-slate-700 rounded border border-slate-600">FEATHERLESS</span>
                    </div>
                    <span>Global Telephony Matrix</span>
                </div>
            </div>
        </div>
    );
};

export default RecordCallModal;
