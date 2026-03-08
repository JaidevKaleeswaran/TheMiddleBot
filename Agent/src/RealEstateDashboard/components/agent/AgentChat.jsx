import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-react';
import { mockClients, mockBids, mockDeadlines } from '../../services/mockData';

const FEATHERLESS_API_KEY = import.meta.env.VITE_FEATHERLESS_API_KEY;
const FEATHERLESS_URL = 'https://api.featherless.ai/v1/chat/completions';
const MODEL = 'meta-llama/Meta-Llama-3-8B-Instruct';
const TIMEOUT_MS = 15000;

// Compact system prompt — sorted and structured so AI returns correct order
const buildSystemPrompt = () => {
    // Sort clients by importanceScore descending so ranking is correct
    const ranked = [...mockClients].sort((a, b) => b.importanceScore - a.importanceScore);
    const clients = ranked.map((c, i) => `#${i + 1} ${c.name}(Score:${c.importanceScore},Tier:${c.tier})`).join('; ');

    // Sort bids by amount descending
    const sortedBids = [...mockBids].sort((a, b) => b.amount - a.amount);
    const bids = sortedBids.map(b => `${b.bidderName}→${b.property}=$${(b.amount / 1000).toFixed(0)}K${b.isHighest ? '(TOP)' : ''}`).join('; ');

    const deadlines = mockDeadlines.map(d => `${d.date}:${d.text}`).join('; ');

    return `You are TheMiddleBot, a real estate AI for agent David Grey. Answer in 2-3 sentences. Use the ranked data below.

CLIENT RANKING (by priority): ${clients}

BIDS (by amount): ${bids}

DEADLINES: ${deadlines}

When ranking clients, always use the numbered order above. When discussing bids, reference the amounts correctly.`;
};

const AgentChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm TheMiddleBot, your AI assistant. I can see all your clients, properties, and bids. Ask me anything — rank clients, summarize deals, draft emails, or strategize." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const quickActions = [
        'Rank my clients',
        'Summarize bids',
        'Draft email',
    ];

    const sendMessage = async (text) => {
        if (!text.trim() || isLoading) return;

        const userMessage = { role: 'user', content: text.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Only send last 4 messages to keep context small and fast
            const recentMessages = updatedMessages.slice(-4);
            const apiMessages = [
                { role: 'system', content: buildSystemPrompt() },
                ...recentMessages.map(m => ({ role: m.role, content: m.content }))
            ];

            // Add timeout so it doesn't hang forever
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(FEATHERLESS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: apiMessages,
                    max_tokens: 200,
                    temperature: 0.7,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const assistantReply = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

            setMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
        } catch (error) {
            console.error('Featherless API error:', error);
            const errorMsg = error.name === 'AbortError'
                ? 'Response took too long. Try a simpler question or try again.'
                : `Connection error: ${error.message}`;
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMsg
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

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
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-surface-card border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-up" style={{ maxHeight: '550px' }}>
                    {/* Header */}
                    <div className="p-4 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <div className="bg-brand-500/20 p-2 rounded-full">
                                <Bot size={20} className="text-brand-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">TheMiddleBot Agent</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Featherless AI</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-surface/50 custom-scrollbar" style={{ minHeight: '280px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mr-2 mt-1">
                                        <Sparkles size={12} className="text-brand-400" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-brand-500 text-white rounded-br-md'
                                    : 'bg-slate-800 text-slate-200 rounded-tl-none ring-1 ring-slate-700/50'
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mr-2 mt-1">
                                    <Sparkles size={12} className="text-brand-400" />
                                </div>
                                <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl rounded-tl-none ring-1 ring-slate-700/50 flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        )}

                        {/* Quick action chips (only show when there's just the greeting) */}
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(action)}
                                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full ring-1 ring-slate-600 transition-colors hover:text-white"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask MiddleBot..."
                                disabled={isLoading}
                                className="w-full bg-slate-900 border border-slate-700 rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
                            />
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-1.5 bg-brand-500 hover:bg-brand-400 text-white rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-brand-500"
                            >
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
