import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Mail, DollarSign, Filter, Search } from 'lucide-react';
import { mockBids } from '../../services/mockData';

const BidsList = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex-1">Bids & Offers</h1>
            </div>

            <div className="bg-surface-card rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 bg-slate-800/20 border-b border-slate-800/80 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by bidder or property..."
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-colors text-sm"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-4 py-2 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                            <TrendingUp size={16} /> Filter High Bids
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/40 border-b border-slate-700/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Bidder</th>
                                <th className="px-6 py-4">Property</th>
                                <th className="px-6 py-4">Bid Amount</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {mockBids.map((bid) => (
                                <tr key={bid.id} className={`hover:bg-slate-800/30 transition-colors group ${bid.isHighest ? 'bg-brand-500/5' : ''}`}>
                                    <td className="px-6 py-4">
                                        {bid.isHighest ? (
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                                <TrendingUp size={14} /> Highest
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                Underbid
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to={`/dashboard/clients/${bid.clientId}`} className="text-sm font-bold text-white hover:text-brand-400 transition-colors">
                                            {bid.bidderName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {bid.property}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-white">
                                        ${bid.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {bid.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors" title="Contact Bidder">
                                                <Mail size={16} />
                                            </button>
                                            <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition-colors">
                                                Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BidsList;
