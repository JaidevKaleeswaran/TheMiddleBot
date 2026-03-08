import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search, Filter, Clock, Users, X, Plus } from 'lucide-react';
import { mockProperties, mockBids } from '../../services/mockData';

const PropertiesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [typeFilters, setTypeFilters] = useState([]);
    const [showNewListing, setShowNewListing] = useState(false);
    const [showManage, setShowManage] = useState(null);
    const [newListing, setNewListing] = useState({ id: null, address: '', price: '', type: 'House', beds: '', baths: '', sqft: '' });

    const toggleTypeFilter = (type) => {
        setTypeFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const filteredProperties = mockProperties.filter(prop => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = prop.address.toLowerCase().includes(q) || prop.type.toLowerCase().includes(q);
        const matchesType = typeFilters.length === 0 || typeFilters.includes(prop.type);
        return matchesSearch && matchesType;
    });

    const handleNewListing = (e) => {
        e.preventDefault();
        const typeColors = { House: 'bg-blue-500', Condo: 'bg-brand-500', Apt: 'bg-teal-500' };

        if (newListing.id) {
            // Edit existing
            const index = mockProperties.findIndex(p => p.id === newListing.id);
            if (index !== -1) {
                mockProperties[index] = {
                    ...mockProperties[index],
                    address: newListing.address,
                    price: parseInt(newListing.price) || 0,
                    type: newListing.type,
                    typeColor: typeColors[newListing.type] || 'bg-slate-500',
                    beds: parseInt(newListing.beds) || 0,
                    baths: parseInt(newListing.baths) || 0,
                    sqft: parseInt(newListing.sqft) || 0,
                };
            }
        } else {
            // Create new
            const newProp = {
                id: Date.now(),
                address: newListing.address,
                price: parseInt(newListing.price) || 0,
                type: newListing.type,
                typeColor: typeColors[newListing.type] || 'bg-slate-500',
                sellBy: '7d',
                bidCount: 0,
                maxBid: 0,
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                beds: parseInt(newListing.beds) || 0,
                baths: parseInt(newListing.baths) || 0,
                sqft: parseInt(newListing.sqft) || 0,
            };
            mockProperties.push(newProp);
        }
        setShowNewListing(false);
        setNewListing({ id: null, address: '', price: '', type: 'House', beds: '', baths: '', sqft: '' });
    };

    const handleEditProperty = () => {
        setNewListing({
            id: managedProp.id,
            address: managedProp.address,
            price: managedProp.price,
            type: managedProp.type,
            beds: managedProp.beds,
            baths: managedProp.baths,
            sqft: managedProp.sqft
        });
        setShowManage(null);
        setShowNewListing(true);
    };

    const handleMarkSold = () => {
        const index = mockProperties.findIndex(p => p.id === managedProp.id);
        if (index !== -1) {
            mockProperties.splice(index, 1);
            // In a real app, this would move to a "sold" DB collection
        }
        setShowManage(null);
    };

    const handleRemove = () => {
        const index = mockProperties.findIndex(p => p.id === managedProp.id);
        if (index !== -1) {
            mockProperties.splice(index, 1);
        }
        setShowManage(null);
    };

    const managedProp = showManage ? mockProperties.find(p => p.id === showManage) : null;
    const managedBids = managedProp ? mockBids.filter(b => b.property === managedProp.address) : [];

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-300 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex-1">Listings & Properties</h1>
                <button
                    onClick={() => setShowNewListing(true)}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5"
                >
                    <Home size={18} /> New Listing
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                <div className="relative col-span-1 md:col-span-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search properties by address or type..."
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                </div>
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className={`flex items-center justify-center gap-2 border rounded-xl py-2.5 transition-colors ${showFilter ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50'}`}
                >
                    <Filter size={18} /> Filter
                </button>

                {showFilter && (
                    <div className="col-span-full bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-wrap gap-3 items-center animate-fade-in">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type:</span>
                        {['House', 'Condo', 'Apt'].map(type => (
                            <button
                                key={type}
                                onClick={() => toggleTypeFilter(type)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${typeFilters.includes(type) ? 'bg-brand-500/20 text-brand-400 border-brand-500/30' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'}`}
                            >
                                {type}
                            </button>
                        ))}
                        {typeFilters.length > 0 && (
                            <button onClick={() => setTypeFilters([])} className="text-xs text-slate-500 hover:text-white ml-2">Clear All</button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(prop => (
                    <div key={prop.id} className="bg-surface-card rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500/50 transition-all group cursor-pointer shadow-lg">
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

                            <button
                                onClick={() => setShowManage(prop.id)}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600"
                            >
                                Manage Property
                            </button>
                        </div>
                    </div>
                ))}
                {filteredProperties.length === 0 && (
                    <div className="col-span-full text-center py-16 text-slate-500">
                        <p className="text-lg font-bold">No properties match your search.</p>
                    </div>
                )}
            </div>

            {/* New Listing Modal */}
            {showNewListing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowNewListing(false)} />
                    <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Plus className="text-brand-400" size={20} />
                                <h3 className="font-semibold text-white">{newListing.id ? 'Edit Listing' : 'Add New Listing'}</h3>
                            </div>
                            <button className="text-slate-400 hover:text-white" onClick={() => {
                                setShowNewListing(false);
                                setNewListing({ id: null, address: '', price: '', type: 'House', beds: '', baths: '', sqft: '' });
                            }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleNewListing} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Address</label>
                                <input type="text" required value={newListing.address} onChange={e => setNewListing({ ...newListing, address: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none" placeholder="123 Main St" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Price ($)</label>
                                    <input type="number" required value={newListing.price} onChange={e => setNewListing({ ...newListing, price: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none" placeholder="500000" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                                    <select value={newListing.type} onChange={e => setNewListing({ ...newListing, type: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none">
                                        <option>House</option>
                                        <option>Condo</option>
                                        <option>Apt</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Beds</label>
                                    <input type="number" value={newListing.beds} onChange={e => setNewListing({ ...newListing, beds: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none" placeholder="3" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Baths</label>
                                    <input type="number" value={newListing.baths} onChange={e => setNewListing({ ...newListing, baths: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none" placeholder="2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">SqFt</label>
                                    <input type="number" value={newListing.sqft} onChange={e => setNewListing({ ...newListing, sqft: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none" placeholder="1800" />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => {
                                    setShowNewListing(false);
                                    setNewListing({ id: null, address: '', price: '', type: 'House', beds: '', baths: '', sqft: '' });
                                }} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold rounded-lg shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5">{newListing.id ? 'Save Changes' : 'Create Listing'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Property Modal */}
            {managedProp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowManage(null)} />
                    <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="h-48 w-full relative overflow-hidden">
                            <img src={managedProp.image} alt={managedProp.address} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                            <button className="absolute top-4 right-4 p-2 bg-slate-900/60 backdrop-blur-md rounded-lg text-white hover:bg-slate-900 transition-colors" onClick={() => setShowManage(null)}>
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-4">
                                <p className="text-2xl font-bold text-white">${(managedProp.price / 1000)}K</p>
                                <p className="text-sm text-slate-300">{managedProp.address}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Beds</p>
                                    <p className="text-lg font-bold text-white">{managedProp.beds}</p>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Baths</p>
                                    <p className="text-lg font-bold text-white">{managedProp.baths}</p>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">SqFt</p>
                                    <p className="text-lg font-bold text-white">{managedProp.sqft}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Time Remaining</span>
                                <span className="text-sm font-bold text-red-400 flex items-center gap-1"><Clock size={14} /> {managedProp.sellBy}</span>
                            </div>

                            {managedBids.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Active Bids ({managedBids.length})</h4>
                                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                        {managedBids.map(bid => (
                                            <div key={bid.id} className={`flex items-center justify-between p-2 rounded-lg ${bid.isHighest ? 'bg-brand-500/5 border border-brand-500/20' : 'bg-slate-800/30 border border-slate-800'}`}>
                                                <span className="text-sm font-medium text-white">{bid.bidderName}</span>
                                                <span className="text-sm font-bold text-white">${(bid.amount / 1000).toFixed(0)}K</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                <button onClick={handleEditProperty} className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all text-sm">
                                    Edit
                                </button>
                                <button onClick={handleMarkSold} className="py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white font-bold rounded-xl border border-emerald-500/20 transition-all text-sm">
                                    Mark Sold
                                </button>
                                <button onClick={handleRemove} className="py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-xl border border-red-500/20 transition-all text-sm">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesList;
