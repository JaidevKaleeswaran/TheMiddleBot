import React, { useState, useEffect, useRef } from 'react';
import { processAIPipeline } from '../../services/aiPipeline';
import { mockClients, updateClientAIResult } from '../../services/mockData';
import { Phone, Mic, Square, Sparkles, X, Loader2, CheckCircle2, PhoneCall, User, Bot } from 'lucide-react';

const ELEVENLABS_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

const RecordCallModal = ({ isOpen, onClose, clientId = null }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [completionStatus, setCompletionStatus] = useState(null);
    const [telephonyActive, setTelephonyActive] = useState(false);
    const [isCalling, setIsCalling] = useState(false);

    // Live Transcript State
    const [liveTranscript, setLiveTranscript] = useState([]);
    const [liveNotes, setLiveNotes] = useState(null);
    const transcriptEndRef = useRef(null);

    const [selectedClientId, setSelectedClientId] = useState(null);

    // Auto-scroll transcript
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [liveTranscript]);

    // Timer
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

    // SSE connection for live tracking
    useEffect(() => {
        let eventSource;
        if (telephonyActive) {
            eventSource = new EventSource('http://localhost:3005/api/live-transcript');

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'agent_speaking' || data.type === 'user_speaking') {
                    setLiveTranscript(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        role: data.type === 'agent_speaking' ? 'assistant' : 'user',
                        text: data.text,
                        time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }]);
                } else if (data.type === 'note_created') {
                    setLiveNotes(true); // Indicate notes were synced
                } else if (data.type === 'widget_update') {
                    // Instantly push AI metrics to dashboard 
                    updateClientAIResult(selectedClientId, data.data, null);
                } else if (data.type === 'call_ended') {
                    setTelephonyActive(false);
                    setCompletionStatus('success');
                }
            };
        }

        return () => {
            if (eventSource) eventSource.close();
        };
    }, [telephonyActive, selectedClientId]);

    // Reset state
    useEffect(() => {
        if (!isOpen) {
            setIsRecording(false);
            setIsProcessing(false);
            setCompletionStatus(null);
            setRecordingTime(0);
            setTelephonyActive(false);
            setLiveTranscript([]);
            setLiveNotes(null);
        } else if (clientId) {
            setSelectedClientId(clientId);
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

        setIsCalling(true);
        setCompletionStatus(null);
        setLiveTranscript([]);
        setLiveNotes(null);

        try {
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
            alert(`Failed to dialout: ${error.message}\n\nMake sure the Telephony Engine is running (node server.js in Functions/).`);
            setIsCalling(false);
        }
    };

    const endTelephonyCall = () => {
        setTelephonyActive(false);
        setCompletionStatus('success');
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
                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group text-left"
                            >
                                <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full bg-slate-700" />
                                <div>
                                    <div className="text-white font-medium group-hover:text-brand-400 transition-colors">{client.name}</div>
                                    <div className="text-xs text-slate-400">{client.tier} Tier · Score {client.importanceScore}</div>
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

            <div className={`relative z-10 w-full transition-all duration-500 ${telephonyActive || liveTranscript.length > 0 ? 'max-w-4xl' : 'max-w-lg'} bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-slide-up`}>

                {/* Left Side: Controls */}
                <div className="p-8 text-center flex-1 flex flex-col justify-center border-r border-slate-800/50 bg-slate-900/50">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20">
                            <Sparkles size={14} className="text-brand-400" />
                            <span className="text-[10px] font-bold text-brand-300 uppercase tracking-widest">
                                Telephony Engine
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
                        {completionStatus === 'success' ? 'Call Complete' :
                            completionStatus === 'error' ? 'Pipeline Error' :
                                isCalling ? `Dialing...` :
                                    isProcessing ? 'Processing AI Insights...' :
                                        telephonyActive ? `${currentClient.name}` :
                                            isRecording ? 'Manual Capture Active' : `Call ${currentClient.name}`}
                    </h2>
                    <div className="text-xs font-bold text-brand-400 mb-6 uppercase tracking-widest">{currentClient.phone}</div>

                    {(isRecording || telephonyActive) && (
                        <div className="text-5xl font-mono text-white font-black mb-10 tracking-tighter tabular-nums drop-shadow-md">
                            {formatTime(recordingTime)}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-auto">
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

                {/* Right Side: Real-time Transcript */}
                {(telephonyActive || liveTranscript.length > 0) && (
                    <div className="flex-1 flex flex-col bg-slate-950 min-h-[500px] border-l border-slate-800">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Sparkles size={16} className="text-blue-400" />
                                    Live AI Transcript
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                                    Powered by Featherless & OpenNote
                                </p>
                            </div>
                            {liveNotes && (
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Notes Synced
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {liveTranscript.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                    <Loader2 size={32} className="animate-spin text-slate-600" />
                                    <p className="text-sm">Connecting continuous stream...</p>
                                </div>
                            ) : (
                                liveTranscript.map((entry) => (
                                    <div key={entry.id} className={`flex flex-col w-full ${entry.role === 'assistant' ? 'items-start' : 'items-end'}`}>
                                        <div className="flex items-center gap-2 mb-1 opacity-70">
                                            {entry.role === 'assistant' ? (
                                                <><Bot size={14} className="text-brand-400" /><span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">MiddleBot</span></>
                                            ) : (
                                                <><span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{currentClient.name}</span><User size={14} className="text-slate-400" /></>
                                            )}
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${entry.role === 'assistant'
                                            ? 'bg-slate-800/80 text-white rounded-tl-sm border border-slate-700/50'
                                            : 'bg-brand-500 text-white rounded-tr-sm'
                                            }`}>
                                            {entry.text}
                                        </div>
                                        <div className="text-[9px] text-slate-500 mt-1 font-mono">{entry.time}</div>
                                    </div>
                                ))
                            )}
                            <div ref={transcriptEndRef} />
                        </div>

                        <div className="bg-slate-900/80 p-4 border-t border-slate-800 text-[9px] uppercase tracking-[0.2em] font-black text-slate-500 flex gap-4">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Twilio Voice</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Featherless AI</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> OpenNote CRM</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecordCallModal;

