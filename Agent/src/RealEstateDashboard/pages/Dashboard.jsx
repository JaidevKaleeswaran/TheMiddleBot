import React, { useEffect, useRef } from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import ClientRankingBox from '../components/dashboard/ClientRankingBox';
import ActivePropertiesBox from '../components/dashboard/ActivePropertiesBox';
import BidsOffersBox from '../components/dashboard/BidsOffersBox';
import NotesFlashcardsBox from '../components/dashboard/NotesFlashcardsBox';
import DeadlinesBox from '../components/dashboard/DeadlinesBox';
import QuickActionsBox from '../components/dashboard/QuickActionsBox';
import DealProbabilityBox from '../components/dashboard/DealProbabilityBox';

import { kpiData } from '../services/mockData';
import { seedFirebase } from '../services/seedFirebase';

const Dashboard = () => {
    const hasSeeded = useRef(false);

    // Automatically sync data to Firebase on first load
    useEffect(() => {
        if (!hasSeeded.current) {
            hasSeeded.current = true;
            seedFirebase()
                .then(result => {
                    if (result.success) {
                        console.log('✅ Firebase auto-synced on dashboard load');
                    } else {
                        console.warn('⚠️ Firebase auto-sync failed:', result.error);
                    }
                })
                .catch(err => console.warn('⚠️ Firebase auto-sync error:', err));
        }
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in relative z-10 pb-12">
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
                <div className="min-h-[400px]">
                    <ClientRankingBox />
                </div>
                <div className="min-h-[400px]">
                    <ActivePropertiesBox />
                </div>
            </div>

            {/* Lower Row: Bids & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                <div className="min-h-[350px]">
                    <BidsOffersBox />
                </div>
                <div className="min-h-[350px]">
                    <NotesFlashcardsBox />
                </div>
            </div>

            {/* Bottom Row: Deal Probabilities & Deadlines & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative mb-12">
                <div className="lg:col-span-6 min-h-[400px]">
                    <DealProbabilityBox />
                </div>
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="min-h-[250px]">
                        <DeadlinesBox />
                    </div>
                    <div className="min-h-[120px]">
                        <QuickActionsBox />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
