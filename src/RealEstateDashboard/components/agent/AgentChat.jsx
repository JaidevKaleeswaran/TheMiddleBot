import React, { useState } from 'react';
import { Bot, X, MessageSquare, Send } from 'lucide-react';

const AgentChat = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-brand-500 hover:bg-brand-400 text-white rounded-full shadow-lg shadow-brand-500/50 transition-all duration-300 animate-fade-in z-50 flex items-center justify-center pulse-ring"
                >
                    <Bot size={28} />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-surface-card border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-up">
                    {/* Header */}
                    <div className="p-4 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <div className="bg-brand-500/20 p-2 rounded-full">
                                <Bot size={20} className="text-brand-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">TheMiddleBot Agent</h3>
                                <p className="text-xs text-slate-400">Online 🟢</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area (Mock) */}
                    <div className="p-4 h-80 overflow-y-auto flex flex-col gap-4 bg-surface/50">
                        <div className="flex justify-start">
                            <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm shadow-sm ring-1 ring-slate-700/50">
                                Hi! I'm your AI assistant. How can I help you manage your clients, properties, or deals today?
                            </div>
                        </div>

                        {/* Quick action chips */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full ring-1 ring-slate-600 transition-colors">
                                Rank my clients
                            </button>
                            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full ring-1 ring-slate-600 transition-colors">
                                Summarize bids
                            </button>
                            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full ring-1 ring-slate-600 transition-colors">
                                Draft email
                            </button>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Ask MiddleBot..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                                disabled
                            />
                            <button className="absolute right-2 p-1.5 bg-brand-500 hover:bg-brand-400 text-white rounded-full transition-colors disabled:opacity-50" disabled>
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AgentChat;
