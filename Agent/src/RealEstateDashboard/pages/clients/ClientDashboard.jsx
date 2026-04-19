import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    TrendingUp,
    Clock,
    MessageSquare,
    ShieldCheck,
    Calendar,
    ArrowRight,
    MapPin,
    DollarSign,
    PartyPopper
} from 'lucide-react';
import WidgetBox from '../../components/ui/WidgetBox';
import KpiCard from '../../components/dashboard/KpiCard';
import MessagingModal from '../../components/shared/MessagingModal';
import { mockProperties, mockBids, mockDeadlines } from '../../services/mockData';

const ClientDashboard = () => {
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [showContract, setShowContract] = useState(false);

    // For the demo, we assume the logged in client is Johini (ID: 1)
    const myBid = mockBids.find(b => b.clientId === 1);
    const myProperty = mockProperties.find(p => p.address === myBid?.property);
    const myDeadlines = mockDeadlines.filter(d => d.clientId === 1);

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-fade-in pb-20">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-brand-500/10 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/20">
                            Client Portal
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Search</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Hello, Johini. <span className="text-slate-500 font-medium">Ready to find your home?</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Assigned Agent</p>
                        <p className="text-sm font-bold text-white">David Grey H.</p>
                    </div>
                    <button onClick={() => setIsMessageOpen(true)} className="ml-4 p-2.5 bg-brand-500 hover:bg-brand-400 text-white rounded-xl transition-all shadow-lg hover:shadow-brand-500/20 active:scale-95">
                        <MessageSquare size={18} />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="Active Offers"
                    value="1"
                    trend="Currently Highest"
                    isPositive={true}
                    gradientTheme="blue-teal"
                />
                <KpiCard
                    title="Properties Viewed"
                    value="12"
                    trend="+2 this week"
                    isPositive={true}
                    gradientTheme="violet-indigo"
                />
                <KpiCard
                    title="Closing Progress"
                    value="65%"
                    trend="On track"
                    isPositive={true}
                    gradientTheme="green-mint"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Your Top Choice */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <WidgetBox title="Your Top Choice" actionButton={
                        <Link to="/dashboard/properties" className="text-xs text-brand-400 font-bold flex items-center gap-1 hover:text-brand-300 transition-colors">
                            Compare Others <ArrowRight size={14} />
                        </Link>
                    }>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/2 h-56 rounded-2xl overflow-hidden relative group">
                                <img src={myProperty?.image} alt={myProperty?.address} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-2xl font-bold text-white">${(myProperty?.price / 1000)}K</p>
                                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                                        <MapPin size={12} /> {myProperty?.address}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Offer Status: <span className="text-emerald-400">Winning</span></h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                                            <span className="text-slate-400">Your Bid</span>
                                            <span className="text-white font-bold">${myBid?.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                                            <span className="text-slate-400">Escrow Period</span>
                                            <span className="text-white font-bold">30 Days</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Contingencies</span>
                                            <span className="text-white font-bold">2 Remaining</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowContract(true)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 flex items-center justify-center gap-2 active:scale-95 hover:shadow-xl">
                                    <FileText size={18} /> View Contract Details
                                </button>
                            </div>
                        </div>
                    </WidgetBox>

                    {/* Next Steps / Timeline */}
                    <WidgetBox title="Next Steps & Milestones">
                        <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                            {myDeadlines.map((d, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-brand-500 z-10 group-hover:scale-125 transition-transform" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">{d.date}</span>
                                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400">{d.type}</span>
                                        </div>
                                        <h4 className="text-white font-bold">{d.text}</h4>
                                        <p className="text-xs text-slate-500 mt-1">Agent David will guide you through this process.</p>
                                    </div>
                                </div>
                            ))}
                            <div className="relative group opacity-50">
                                <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 z-10" />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Upcoming</span>
                                    </div>
                                    <h4 className="text-slate-400 font-bold">Final Walkthrough</h4>
                                </div>
                            </div>
                        </div>
                    </WidgetBox>
                </div>

                {/* Right Column: Insights & Concierge */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <WidgetBox title="Agent Insights (MiddleBot AI)" className="bg-indigo-500/5 border-indigo-500/20">
                        <div className="flex items-start gap-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4">
                            <div className="bg-indigo-500 p-2 rounded-xl text-white">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-300 mb-1">Market Velocity Insight</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Inventory in this neighborhood is down 15% this month. Your current bid is strong, but expect a final decision by Friday.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-800/20 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Neighborhood Rating</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="w-2 h-2 rounded-full bg-brand-500"></span>)}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/20 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Schools Score</span>
                                <span className="text-sm font-bold text-white">9.2/10</span>
                            </div>
                        </div>
                    </WidgetBox>

                    <div className="flex-1 bg-gradient-to-br from-brand-600 to-indigo-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-brand-500/20">
                        <div className="relative z-10 flex flex-col h-full">
                            <PartyPopper size={48} className="text-white/30 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
                            <p className="text-white/80 text-sm leading-relaxed mb-8">
                                You are leading the bids on your dream home. We'll notify you the moment the seller signs.
                            </p>
                            <button onClick={() => alert("Awesome! Agent David has been notified and will reach out to confirm celebration details.")} className="mt-auto w-full py-4 bg-white text-brand-600 rounded-2xl font-bold shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                                <Calendar size={18} /> Schedule Celebration
                            </button>
                        </div>
                        {/* Abstract shapes */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                    </div>
                </div>
            </div>

            <MessagingModal isOpen={isMessageOpen} onClose={() => setIsMessageOpen(false)} clientId={1} />
            
            {/* Contract Modal Overlay */}
            {showContract && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setShowContract(false)} />
                    <div className="relative z-10 w-full max-w-3xl bg-white rounded-sm shadow-2xl overflow-hidden animate-slide-up flex flex-col h-[85vh]">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">Secure Document Viewer</h2>
                            <button onClick={() => setShowContract(false)} className="text-slate-500 hover:text-slate-800 font-bold px-3 py-1 border border-slate-300 rounded hover:bg-slate-200 transition-colors">Close</button>
                        </div>
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[#faf9f6] text-slate-800 space-y-6 flex flex-col">
                            <div className="border-b-4 border-slate-900 pb-4 mb-4 text-center">
                                <h1 className="text-2xl md:text-4xl font-serif uppercase tracking-widest text-slate-900">Residential Purchase Agreement</h1>
                                <p className="text-slate-500 font-medium mt-2">CONFIDENTIAL • BINDING DOCUMENT</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8 text-sm md:text-base font-serif">
                                <div>
                                    <p className="text-slate-500 mb-1 font-sans text-xs uppercase tracking-wider">Date Prepared</p>
                                    <p className="font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 mb-1 font-sans text-xs uppercase tracking-wider">Property Address</p>
                                    <p className="font-medium">{myProperty?.address}</p>
                                </div>
                            </div>
                            <div className="space-y-4 font-serif text-sm md:text-base leading-relaxed mt-6">
                                <p><strong>1. PARTIES:</strong> This Agreement is made between <span className="font-bold border-b border-slate-400">Johini Eirana</span> ("Buyer") and <span className="font-bold border-b border-slate-400">Estate Holdings LLC</span> ("Seller").</p>
                                <p><strong>2. PURCHASE PRICE:</strong> The total purchase price to be paid by Buyer is <span className="font-bold">${myBid?.amount.toLocaleString()}</span>.</p>
                                <p><strong>3. CLOSING:</strong> The closing of the sale shall take place within 30 days of the mutual acceptance of this contract.</p>
                                <p><strong>4. CONTINGENCIES:</strong> This offer is contingent upon a satisfactory inspection and approval of financing by the Buyer's lending institution.</p>
                            </div>
                            
                            <div className="mt-auto pt-16 grid grid-cols-2 gap-8 font-serif">
                                <div>
                                    <div className="w-full border-b border-slate-800 mb-2"><span className="font-cursive text-2xl text-blue-800 italic pr-4">Johini Eirana</span></div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Buyer Signature</p>
                                </div>
                                <div>
                                    <div className="w-full border-b border-slate-800 mb-2 h-8"></div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Seller Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple icon placeholder if needed
const FileText = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>;

export default ClientDashboard;
