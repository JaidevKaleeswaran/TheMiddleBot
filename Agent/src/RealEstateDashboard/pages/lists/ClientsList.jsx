import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Search, Filter, MoreVertical, Phone, Mail } from 'lucide-react';
import { mockClients } from '../../services/mockData';

const ClientsList = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex-1">Active Clients</h1>
                <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5">
                    <UserPlus size={18} /> Add Client
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="relative col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search clients by name, email or phone..."
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl py-2.5 hover:bg-slate-700/50 transition-colors">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            <div className="bg-surface-card rounded-2xl border border-slate-700/50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/40 border-b border-slate-700/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">AI Score</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {mockClients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <Link to={`/dashboard/clients/${client.id}`} className="flex items-center gap-3">
                                        <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full border border-slate-700" />
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{client.name}</div>
                                            <div className="text-xs text-slate-500">{client.phone}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border 
                                        ${client.importanceScore >= 80 ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            client.importanceScore >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                        {client.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${client.importanceScore >= 80 ? 'bg-red-500' : client.importanceScore >= 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${client.importanceScore}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-300">{client.importanceScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    Today, 2:45 PM
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-slate-400">
                                        <button className="p-2 hover:bg-slate-700/50 rounded-lg hover:text-white transition-colors"><Phone size={16} /></button>
                                        <button className="p-2 hover:bg-slate-700/50 rounded-lg hover:text-white transition-colors"><Mail size={16} /></button>
                                        <button className="p-2 hover:bg-slate-700/50 rounded-lg hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientsList;
