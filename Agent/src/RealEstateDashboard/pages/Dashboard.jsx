import React, { useState } from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import ClientRankingBox from '../components/dashboard/ClientRankingBox';
import ActivePropertiesBox from '../components/dashboard/ActivePropertiesBox';
import BidsOffersBox from '../components/dashboard/BidsOffersBox';
import NotesFlashcardsBox from '../components/dashboard/NotesFlashcardsBox';
import DeadlinesBox from '../components/dashboard/DeadlinesBox';
import QuickActionsBox from '../components/dashboard/QuickActionsBox';
import DealProbabilityBox from '../components/dashboard/DealProbabilityBox';
import ClientCommBox from '../components/dashboard/ClientCommBox';
import { Database, CheckCircle2, Loader2 } from 'lucide-react';

import { kpiData } from '../services/mockData';
import { seedFirebase } from '../services/seedFirebase';

const Dashboard = () => {
    const [seedStatus, setSeedStatus] = useState(null); // null | 'loading' | 'done' | 'error'

    const handleSeedFirebase = async () => {
        setSeedStatus('loading');
        const result = await seedFirebase();
        setSeedStatus(result.success ? 'done' : 'error');
        setTimeout(() => setSeedStatus(null), 4000);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in relative z-10 pb-32">
            {/* Seed Firebase Banner */}
            <div className="flex items-center justify-between bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-2">
                <span className="text-xs text-slate-400 font-medium">Admin Tools</span>
                <button
                    onClick={handleSeedFirebase}
                    disabled={seedStatus === 'loading'}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${seedStatus === 'done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        seedStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            seedStatus === 'loading' ? 'bg-slate-700 text-slate-300 border border-slate-600' :
                                'bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20'
                        }`}
                >
                    {seedStatus === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Seeding...</> :
                        seedStatus === 'done' ? <><CheckCircle2 size={14} /> Data Synced to Firebase!</> :
                            seedStatus === 'error' ? 'Seed Failed — Retry' :
                                <><Database size={14} /> Sync All Data to Firebase</>}
                </button>
            </div>

            {/* KPI Row (Top) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Active Clients"
                    value={kpiData.activeClients.value}
                    trend={kpiData.activeClients.trend}
                    isPositive={false}
                    gradientTheme="pink-peach"
                    path="/dashboard/clients"
                />
                <KpiCard
                    title="Total Listings"
                    value={kpiData.totalListings.value}
                    trend={kpiData.totalListings.trend}
                    isPositive={true}
                    gradientTheme="blue-teal"
                    path="/dashboard/properties"
                />
                <KpiCard
                    title="Highest Open Bid"
                    value={kpiData.highestBid.value}
                    trend={kpiData.highestBid.trend}
                    isPositive={true}
                    gradientTheme="green-mint"
                    path="/dashboard/bids"
                />
                <KpiCard
                    title="Avg Importance Score"
                    value={kpiData.avgScore.value}
                    trend={kpiData.avgScore.trend}
                    isPositive={true}
                    gradientTheme="violet-indigo"
                    path="/dashboard/clients"
                />
            </div>

            {/* Middle Row: Client Ranking & Active Properties */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                <div className="h-[400px]">
                    <ClientRankingBox />
                </div>
                <div className="h-[400px]">
                    <ActivePropertiesBox />
                </div>
            </div>

            {/* Lower Row: Bids & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                <div className="h-[350px]">
                    <BidsOffersBox />
                </div>
                <div className="h-[350px]">
                    <NotesFlashcardsBox />
                </div>
            </div>

            {/* Bottom Row: Deal Probabilities & Deadlines & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative mb-12">
                <div className="lg:col-span-6 min-h-[400px]">
                    <DealProbabilityBox />
                </div>
                <div className="lg:col-span-6 flex flex-col gap-6 h-full">
                    <div className="min-h-[250px] flex-1">
                        <DeadlinesBox />
                    </div>
                    <div className="min-h-[120px]">
                        <QuickActionsBox />
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Comm Tab */}
            <ClientCommBox />
        </div>
    );
};

export default Dashboard;
