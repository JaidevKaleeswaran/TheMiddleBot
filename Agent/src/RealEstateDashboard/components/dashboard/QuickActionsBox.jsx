import React, { useState, useEffect } from 'react';
import WidgetBox from '../ui/WidgetBox';
import { processAIPipeline } from '../../services/aiPipeline';
import { Phone, UserPlus, Home, Mail, FileText, Mic, Square, Sparkles, X, Loader2, CheckCircle2 } from 'lucide-react';

const actions = [
    { id: 'record', icon: Phone, label: 'Record Call' },
    { id: 'client', icon: UserPlus, label: 'Add Client' },
    { id: 'listing', icon: Home, label: 'New Listing' },
    { id: 'email', icon: Mail, label: 'Email Bidders' },
    { id: 'note', icon: FileText, label: 'Add Note' }
];

const QuickActionsBox = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [completionStatus, setCompletionStatus] = useState(null); // 'success' or 'error'

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAction = (id) => {
        setActiveModal(id);
        setCompletionStatus(null);
    };

    const startRecording = () => {
        setIsRecording(true);
        setCompletionStatus(null);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        setCompletionStatus(null);

        try {
            // Mock audio blob for simulation
            const mockBlob = new Blob([], { type: 'audio/wav' });

            // For demo, just use the first mock client ID
            // In a real scenario, this would come from a picker or the active call session
            const result = await processAIPipeline(1, mockBlob);

            if (result.success) {
                setCompletionStatus('success');
                setIsProcessing(false);
                // Auto-close after a success delay
                setTimeout(() => {
                    if (activeModal === 'record') setActiveModal(null);
                }, 4000);
            }
        } catch (error) {
            console.error("Pipeline failed:", error);
            setCompletionStatus('error');
            setIsProcessing(false);
        }
    };

    return (
        <>
            <WidgetBox title="Quick Actions" className="bg-slate-800/20 backdrop-blur-xl border-dashed border-slate-600/50">
                <div className="flex h-full items-center justify-around gap-2 pb-2">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => handleAction(action.id)}
                            className="flex flex-col items-center gap-2 group flex-1 p-2 rounded-xl hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 shadow-sm transition-all group-hover:scale-110 group-hover:-translate-y-1">
                                <action.icon size={18} />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 text-center whitespace-nowrap group-hover:text-slate-200 transition-colors">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            </WidgetBox>

            {/* Record Call Modal */}
            {activeModal === 'record' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isRecording && !isProcessing && setActiveModal(null)} />
                    <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-6 text-center">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20">
                                    <Sparkles size={14} className="text-brand-400" />
                                    <span className="text-[10px] font-bold text-brand-300 uppercase tracking-widest">AI Engine Active</span>
                                </div>
                                {!isRecording && !isProcessing && (
                                    <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="relative mb-8">
                                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-500 
                                    ${completionStatus === 'success' ? 'bg-emerald-500/20 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.2)]' :
                                        isProcessing ? 'bg-brand-500/10' :
                                            isRecording ? 'bg-red-500/20 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.3)]' :
                                                'bg-brand-500/20'}`}>

                                    {completionStatus === 'success' ? (
                                        <CheckCircle2 size={40} className="text-emerald-400" />
                                    ) : isProcessing ? (
                                        <Loader2 size={40} className="text-brand-400 animate-spin" />
                                    ) : isRecording ? (
                                        <div className="w-8 h-8 bg-red-500 rounded-sm animate-pulse" />
                                    ) : (
                                        <Mic size={40} className="text-brand-400" />
                                    )}
                                </div>
                                {isRecording && !isProcessing && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-red-500/30 animate-ping" />
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">
                                {completionStatus === 'success' ? 'Intelligence Captured' :
                                    isProcessing ? 'Multiplexing AI...' :
                                        isRecording ? 'Recording Live' : 'Ready to Start'}
                            </h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">
                                {completionStatus === 'success' ? 'ElevenLabs transcript stored. Opennote summary generated. Featherless AI score updated.' :
                                    isProcessing ? 'Processing through ElevenLabs, Opennote, and Featherless AI engine...' :
                                        isRecording ? 'Transcription active. Speak naturally, MiddleBot is listening.' :
                                            'Tap the button to start the AI-assisted call recording pipeline.'}
                            </p>

                            {isRecording && (
                                <div className="text-4xl font-mono text-white font-bold mb-8">
                                    {formatTime(recordingTime)}
                                </div>
                            )}

                            <div className="flex gap-4">
                                {completionStatus === 'success' ? (
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20"
                                    >
                                        Return to Dashboard
                                    </button>
                                ) : isProcessing ? (
                                    <div className="w-full py-4 bg-slate-800/80 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-3 border border-slate-700">
                                        Processing...
                                    </div>
                                ) : isRecording ? (
                                    <button
                                        onClick={stopRecording}
                                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Square size={20} fill="currentColor" /> Stop & Analyze
                                    </button>
                                ) : (
                                    <button
                                        onClick={startRecording}
                                        className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl font-bold shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Phone size={20} fill="currentColor" /> Start AI Recording
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 border-t border-slate-700 flex justify-between items-center">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[8px] font-bold text-white">EL</div>
                                <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[8px] font-bold text-white">ON</div>
                                <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[8px] font-bold text-white">FS</div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Multiplex AI Pipeline</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickActionsBox;
