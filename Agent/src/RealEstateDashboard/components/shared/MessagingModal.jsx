import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Phone } from 'lucide-react';
import { mockClients, mockMessages } from '../../services/mockData';

const MessagingModal = ({ isOpen, onClose, clientId }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const client = mockClients.find(c => c.id === clientId);
    const messages = mockMessages[clientId] || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [isOpen, messages.length]);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        if (!mockMessages[clientId]) {
            mockMessages[clientId] = [];
        }
        mockMessages[clientId].push({
            sender: 'agent',
            text: newMessage.trim(),
            timestamp: timeStr,
        });

        setNewMessage('');
        setTimeout(scrollToBottom, 50);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col" style={{ maxHeight: '85vh' }}>

                {/* Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center gap-4">
                    <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{client.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Phone size={12} />
                            <span>{client.phone}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" style={{ minHeight: '300px' }}>
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 py-12">
                            <p className="font-medium">No messages yet</p>
                            <p className="text-sm mt-1">Start the conversation below.</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === 'agent'
                                    ? 'bg-brand-500/20 text-brand-100 border border-brand-500/20 rounded-br-md'
                                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-md'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p className={`text-[10px] mt-1.5 font-medium ${msg.sender === 'agent' ? 'text-brand-400/60' : 'text-slate-500'
                                    }`}>
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-800 bg-slate-800/30">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                rows={1}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-500/50 resize-none transition-colors placeholder:text-slate-500"
                                style={{ maxHeight: '120px' }}
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="p-3 bg-brand-500 hover:bg-brand-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all shadow-lg shadow-brand-500/20 disabled:shadow-none shrink-0"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingModal;
