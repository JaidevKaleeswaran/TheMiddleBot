import React, { useState } from 'react';
import { Menu, Search, Bell, MonitorPlay, Calendar, AlertCircle, X } from 'lucide-react';
import { mockDeadlines } from '../../services/mockData';

const TopBar = ({ onMenuClick }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
                    Dashboard
                </h1>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden sm:block">
                <div className="relative group">
                    <AgentSearchInput />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Chart View Toggle (from reference) */}
                <button className="hidden lg:flex items-center gap-2 text-sm text-slate-400 font-medium bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-colors border border-slate-700/50">
                    <MonitorPlay size={16} className="text-brand-400" />
                    Overview
                </button>

                {/* Notifications Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 transition-colors rounded-full border shadow-sm ${showNotifications ? 'bg-slate-800 text-white border-brand-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border-slate-700/50 hover:text-white'}`}
                    >
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-slate-900 animate-pulse"></span>
                    </button>

                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-up">
                                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Bell size={16} className="text-brand-400" /> Notifications
                                    </h3>
                                    <span className="text-xs bg-brand-500 text-white font-bold px-2 py-0.5 rounded-full">
                                        {mockDeadlines.length} New
                                    </span>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar bg-slate-900/50">
                                    {mockDeadlines.map((deadline) => (
                                        <div key={deadline.id} className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${deadline.urgency === 'danger' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        deadline.urgency === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                    {deadline.type}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                                                    <Calendar size={10} /> {deadline.date}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{deadline.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center border-t border-slate-700 bg-slate-800/80 hover:bg-slate-700 cursor-pointer transition-colors">
                                    <span className="text-xs font-bold text-brand-400">View All Tasks</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User Dropdown area */}
                <div className="flex items-center gap-3 cursor-pointer pl-2 border-l border-slate-700/50">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-white">David Grey. H</p>
                    </div>
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=475569"
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover bg-slate-800 shadow-sm ring-1 ring-white/10"
                    />
                </div>
            </div>
        </header>
    );
};

// Internal sub-component for search input
const AgentSearchInput = () => (
    <>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500 group-focus-within:text-brand-400 transition-colors" />
        </div>
        <input
            type="text"
            placeholder="Search clients, properties, notes..."
            className="block w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-full leading-5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all font-medium sm:text-sm shadow-inner"
        />
    </>
);

export default TopBar;
