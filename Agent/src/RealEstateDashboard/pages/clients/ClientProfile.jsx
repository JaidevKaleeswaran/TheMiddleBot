import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Calendar, MapPin, DollarSign, TrendingUp, AlertCircle, Sparkles, Mic } from 'lucide-react';
import { mockClients, mockProperties } from '../../services/mockData';
import WidgetBox from '../../components/ui/WidgetBox';
import KpiCard from '../../components/dashboard/KpiCard';

const ClientProfile = () => {
    const { clientId } = useParams();
    const [isCalling, setIsCalling] = useState(false);
    const [callTime, setCallTime] = useState(0);

    useEffect(() => {
        let interval;
        if (isCalling) {
            interval = setInterval(() => setCallTime(prev => prev + 1), 1000);
        } else {
            clearInterval(interval);
            setCallTime(0);
        }
        return () => clearInterval(interval);
    }, [isCalling]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Parse to int if your mock data IDs are integers
    const client = mockClients.find(c => c.id === parseInt(clientId)) || mockClients.find(c => c.id === clientId);

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
                <Link to="/dashboard" className="text-brand-400 hover:text-brand-300 flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        );
    }

    // Mock target property based on whatever property ID is linked or just a random one for demo
    const targetProperty = mockProperties[0];

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in pb-10">
            {/* Call Overlay */}
            {isCalling && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-fade-in" />
                    <div className="relative z-10 flex flex-col items-center animate-slide-up">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl mb-6 relative">
                            <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Calling {client.name}...</h2>
                        <div className="text-xl font-mono text-emerald-400 font-bold mb-12">{formatTime(callTime)}</div>

                        <div className="flex gap-8">
                            <button className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition-colors">
                                <Mic size={24} />
                            </button>
                            <button
                                onClick={() => setIsCalling(false)}
                                className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-500/40 hover:bg-red-600 transition-all scale-110"
                            >
                                <Phone size={24} className="rotate-[135deg]" fill="currentColor" />
                            </button>
                            <button className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition-colors">
                                <Mail size={24} />
                            </button>
                        </div>

                        <div className="mt-16 flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                            <Sparkles size={16} className="text-brand-400" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">ElevenLabs Real-time Transcription</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Navigation */}
            <div className="flex items-center gap-4 mb-2">
                <Link to="/dashboard" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex-1">{client.name}'s Profile</h1>

                <button
                    onClick={() => setIsCalling(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                    <Phone size={18} fill="currentColor" /> Call Client
                </button>

                {/* Status Badge */}
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 shadow-lg
                    ${client.importanceScore >= 80 ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        client.importanceScore >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                            'bg-green-500/10 text-green-400 border-green-500/30'}`}>
                    <Sparkles size={16} />
                    Tier {client.tier} (Score: {client.importanceScore})
                </div>
            </div>

            {/* Top Row: Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-1">
                    <WidgetBox className="h-full flex items-center justify-center p-6 bg-gradient-to-b from-slate-800/40 to-slate-900/60">
                        <div className="flex flex-col items-center text-center">
                            <img src={client.avatar} alt={client.name} className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-xl mb-4" />
                            <h2 className="text-xl font-bold text-white mb-1">{client.name}</h2>
                            <p className="text-sm text-slate-400 font-medium">Active Buyer</p>

                            <div className="flex gap-3 mt-4">
                                <button className="p-2.5 bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 rounded-full transition-colors"><Phone size={18} /></button>
                                <button className="p-2.5 bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 rounded-full transition-colors"><Mail size={18} /></button>
                            </div>
                        </div>
                    </WidgetBox>
                </div>

                <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KpiCard
                        title="Chance of Buying"
                        value={`${client.importanceScore + 5}%`}
                        trend="+12% this week"
                        isPositive={true}
                        gradientTheme="pink-peach"
                    />
                    <KpiCard
                        title="Declared Budget"
                        value="$1.2M"
                        trend="Flexible up to $1.35M"
                        isPositive={true}
                        gradientTheme="blue-teal"
                    />
                    <KpiCard
                        title="Timeline"
                        value="30 Days"
                        trend="Lease ending soon"
                        isPositive={false}
                        gradientTheme="violet-indigo"
                    />
                </div>
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Target Property */}
                <div className="lg:col-span-1">
                    <WidgetBox title="Target Property" className="h-[400px]">
                        <div className="flex flex-col gap-4 h-full">
                            <div className="w-full h-40 rounded-xl overflow-hidden relative group">
                                <img src={targetProperty.image} alt={targetProperty.address} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-lg drop-shadow-md truncate">
                                    {targetProperty.price}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <h4 className="text-white font-semibold mb-2">{targetProperty.address}</h4>
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 mb-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500">Beds</span>
                                        <span className="text-lg">{targetProperty.beds}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-700"></div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500">Baths</span>
                                        <span className="text-lg">{targetProperty.baths}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-700"></div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500">SqFt</span>
                                        <span className="text-lg">{targetProperty.sqft}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-slate-800/30 p-2 rounded-lg border border-slate-700/30">
                                        <span className="text-sm font-medium text-slate-400">Current Top Bid</span>
                                        <span className="text-sm font-bold text-emerald-400">$840,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </WidgetBox>
                </div>

                {/* AI Notes & Schedule */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <WidgetBox title="AI Insights & Action Plan" className="flex-1 min-h-[250px]" actionButton={<button className="text-xs bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full font-medium border border-brand-500/30">Auto-Generated</button>}>
                        <div className="space-y-4 pr-2 custom-scrollbar overflow-y-auto">
                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={16} className="text-indigo-400" />
                                    <h4 className="font-bold text-indigo-300">Featherless AI Strategy</h4>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                    {client.name} is extremely motivated due to a looming lease expiration. They are pre-approved up to $1.35M but are targeting properties around $1.2M. Recommend showing them 456 Oak Ave immediately before the open house this weekend.
                                </p>
                                <ul className="text-sm text-slate-400 list-disc pl-5 space-y-1">
                                    <li>Schedule showing for 456 Oak Ave ASAP</li>
                                    <li>Prepare CMA for the neighborhood</li>
                                    <li>Send follow-up SMS about mortgage rate drops</li>
                                </ul>
                            </div>

                            <div className="p-3 border border-slate-700/50 rounded-lg bg-slate-800/20">
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                    <Calendar size={14} /> <span>Yesterday, 2:30 PM (Opennote Summary)</span>
                                </div>
                                <p className="text-sm text-slate-300">
                                    Call summary: Expressed concern over HOA fees at the previous property. Wants to ensure any new viewings have HOA under $400/mo.
                                </p>
                            </div>
                        </div>
                    </WidgetBox>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
