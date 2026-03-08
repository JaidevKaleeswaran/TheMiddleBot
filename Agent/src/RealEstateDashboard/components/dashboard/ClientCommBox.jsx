import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, MicOff, Pause, Play, CheckCircle, Clock } from 'lucide-react';

const ClientCommBox = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => setDuration((d) => d + 1), 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const toggleCall = () => {
        if (isRecording) {
            setIsRecording(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
            setDuration(0);
        } else {
            setIsRecording(true);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-surface-card rounded-t-2xl border-t border-l border-r border-slate-700/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] p-4 fixed bottom-0 left-0 right-0 md:left-64 flex flex-col sm:flex-row items-center justify-between gap-4 z-40 transition-transform">
            {/* Left side: Client Selector + Status */}
            <div className="flex items-center gap-4 flex-1">
                <select className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none pr-8">
                    <option>Select Client...</option>
                    <option>Johini Eirana - 236 Hountniy Rd</option>
                    <option>Barara Fuders - 795 Testloy Rd</option>
                </select>

                {isRecording && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-danger/10 border border-danger/20 rounded-full animate-fade-in shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                        <div className="w-2 h-2 rounded-full bg-danger animate-pulse"></div>
                        <span className="text-[10px] uppercase font-bold text-danger tracking-wider">Recording via ElevenLabs</span>
                        <span className="text-[10px] font-mono font-bold text-red-300 ml-1">{formatTime(duration)}</span>
                    </div>
                )}
            </div>

            {/* Middle side: Live Transcript (simulated if recording) */}
            <div className="flex-1 w-full sm:w-auto h-8 flex items-center hidden lg:flex px-4 border-l border-r border-slate-800/50 overflow-hidden">
                {isRecording ? (
                    <p className="text-xs text-brand-300 font-medium italic animate-pulse whitespace-nowrap overflow-hidden text-ellipsis">
                        "So about the property on Hountniy Rd, what's the flexibility on the sell-by date..."
                    </p>
                ) : (
                    <p className="text-xs text-slate-500 font-medium italic">
                        Start a call to begin ElevenLabs transcription...
                    </p>
                )}
            </div>

            {/* Right side: Controls & Toast */}
            <div className="flex items-center gap-3">
                {showToast && (
                    <div className="flex items-center gap-1 text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20 animate-fade-in shadow-lg">
                        <CheckCircle size={14} />
                        <span className="text-xs font-bold">Notes saved to OpenNote</span>
                    </div>
                )}

                <div className="flex gap-2">
                    {isRecording && (
                        <>
                            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors border border-slate-700">
                                <MicOff size={16} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors border border-slate-700">
                                <Pause size={16} />
                            </button>
                        </>
                    )}

                    <button
                        onClick={toggleCall}
                        className={`w-10 h-10 md:w-auto md:px-4 rounded-full flex items-center justify-center gap-2 border shadow-lg transition-all ${isRecording
                                ? 'bg-danger hover:bg-red-600 border-danger/50 text-white animate-pulse shadow-danger/50'
                                : 'bg-green-600 hover:bg-green-500 border-green-500/50 text-white shadow-green-500/20'
                            }`}
                    >
                        {isRecording ? <PhoneOff size={16} /> : <Phone size={16} />}
                        <span className="hidden md:inline text-sm font-bold">
                            {isRecording ? 'End Call' : 'Start Call'}
                        </span>
                    </button>
                </div>

                {/* Call History Dropdown trigger (simulated) */}
                <button className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white pl-2 border-l border-slate-700/50 transition-colors">
                    <Clock size={14} /> <span className="underline decoration-slate-600 underline-offset-2">History</span>
                </button>
            </div>
        </div>
    );
};

export default ClientCommBox;
