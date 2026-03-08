import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search, Filter, Clock, Users } from 'lucide-react';
import { mockProperties } from '../../services/mockData';

const PropertiesList = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex-1">Listings & Properties</h1>
                <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5">
                    <Home size={18} /> New Listing
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative col-span-1 md:col-span-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search properties by address or type..."
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl py-2.5 hover:bg-slate-700/50 transition-colors">
                    <Filter size={18} /> Filter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProperties.map(prop => (
                    <div key={prop.id} className="bg-surface-card rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500/50 transition-all group group cursor-pointer shadow-lg">
                        <div className="h-48 w-full relative overflow-hidden">
                            <img src={prop.image} alt={prop.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white z-20 ${prop.typeColor} shadow-lg`}>
                                {prop.type}
                            </div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="text-2xl font-bold">${(prop.price / 1000)}K</p>
                            </div>
                        </div>

                        <div className="p-5">
                            <h4 className="text-lg font-bold text-white mb-4 truncate">{prop.address}</h4>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Bids</p>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-brand-400" />
                                        <span className="text-lg font-bold text-white">{prop.bidCount}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Time Left</p>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-red-400" />
                                        <span className="text-lg font-bold text-white">{prop.sellBy}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600">
                                Manage Property
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertiesList;
