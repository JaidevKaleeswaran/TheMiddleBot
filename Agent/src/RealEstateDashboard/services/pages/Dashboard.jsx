import React from 'react';
import KpiCard from '../../components/dashboard/KpiCard';
import ClientRankingBox from '../../components/dashboard/ClientRankingBox';
import ActivePropertiesBox from '../../components/dashboard/ActivePropertiesBox';
import BidsOffersBox from '../../components/dashboard/BidsOffersBox';
import NotesFlashcardsBox from '../../components/dashboard/NotesFlashcardsBox';
import DeadlinesBox from '../../components/dashboard/DeadlinesBox';
import QuickActionsBox from '../../components/dashboard/QuickActionsBox';
import DealProbabilityBox from '../../components/dashboard/DealProbabilityBox';
import ClientCommBox from '../../components/dashboard/ClientCommBox';

import { kpiData } from '../services/mockData';

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in relative z-10 pb-32">
            {/* KPI Row (Top) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Active Clients"
                    value={kpiData.activeClients.value}
                    trend={kpiData.activeClients.trend}
                    isPositive={false}
                    gradientTheme="pink-peach"
                />
                <KpiCard
                    title="Total Listings"
                    value={kpiData.totalListings.value}
                    trend={kpiData.totalListings.trend}
                    isPositive={true}
                    gradientTheme="blue-teal"
                />
                <KpiCard
                    title="Highest Open Bid"
                    value={kpiData.highestBid.value}
                    trend={kpiData.highestBid.trend}
                    isPositive={true}
                    gradientTheme="green-mint"
                />
                <KpiCard
                    title="Avg Importance Score"
                    value={kpiData.avgScore.value}
                    trend={kpiData.avgScore.trend}
                    isPositive={true}
                    gradientTheme="violet-indigo"
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                <div className="lg:col-span-6 h-[250px] lg:h-auto min-h-[250px]">
                    <DealProbabilityBox />
                </div>
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="h-[140px]">
                        <DeadlinesBox />
                    </div>
                    <div className="flex-1">
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
