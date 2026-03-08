import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertCircle, CheckCircle2, MoreVertical } from 'lucide-react';
import { mockDeadlines } from '../../services/mockData';

const DeadlinesList = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex-1">Upcoming Deadlines</h1>
                <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Tasks</p>
                    <p className="text-2xl font-bold text-white leading-none">{mockDeadlines.length}</p>
                </div>
            </div>

            <div className="space-y-4">
                {mockDeadlines.map((deadline, idx) => (
                    <div key={idx} className="bg-surface-card border border-slate-700/50 rounded-2xl p-6 hover:border-slate-500 transition-all group relative overflow-hidden">
                        {/* Status bar on the left */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${deadline.urgency === 'danger' ? 'bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                            deadline.urgency === 'warning' ? 'bg-yellow-500/80 shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                                'bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                            }`} />

                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-none flex flex-col items-center justify-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl min-w-[100px]">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{deadline.date === 'Today' ? 'Active' : 'Upcoming'}</span>
                                <span className="text-lg font-bold text-white">{deadline.date}</span>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                        ${deadline.type === 'Sell By' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                            deadline.type === 'Callback' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-brand-500/10 text-brand-400 border border-brand-500/20'}`}>
                                        {deadline.type}
                                    </span>
                                    {deadline.urgency === 'danger' && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                                            <AlertCircle size={14} /> Critical
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">{deadline.text}</h3>
                                <p className="text-sm text-slate-500 font-medium">Automatic system tracking active for this deadline.</p>
                            </div>

                            <div className="flex-none flex items-center gap-3">
                                <Link
                                    to={`/dashboard/clients/${deadline.clientId}`}
                                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl border border-slate-700/50 transition-all"
                                >
                                    Client Profile
                                </Link>
                                <button className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-500/20 transition-all shadow-lg hover:shadow-emerald-500/20">
                                    <CheckCircle2 size={20} />
                                </button>
                                <button className="p-3 text-slate-500 hover:text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Monitoring Footer */}
            <div className="mt-8 p-6 bg-slate-800/10 border border-slate-700/50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center">
                        <Calendar size={24} className="text-brand-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Real-time Deadline Tracking</h3>
                        <p className="text-slate-400 text-sm">MiddleBot is automatically scanning your calls and emails for new commitments.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeadlinesList;
