import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WidgetBox from '../ui/WidgetBox';
import { mockBids, mockChartData } from '../../services/mockData';
import { Mail, TrendingUp, AlertCircle, RefreshCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BidsOffersBox = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('');

    const handleEmailBidders = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    return (
        <>
            <WidgetBox title="Bids & Offers" titleHref="/dashboard/bids">
                <div className="flex flex-col md:flex-row gap-4 h-full">
                    {/* Left panel - Table */}
                    <div className="flex-1 border-r border-slate-700/50 pr-4">
                        <div className="flex text-xs font-semibold text-slate-400 mb-2 border-b border-slate-700 pb-2">
                            <div className="flex-[1.5]">Bidder</div>
                            <div className="flex-[1.5]">Property</div>
                            <div className="flex-1 text-right">Amount</div>
                            <div className="w-8 ml-2"></div>
                        </div>

                        <div className="overflow-y-auto max-h-48 pr-1 custom-scrollbar space-y-1">
                            {mockBids.map(bid => (
                                <Link
                                    to={`/dashboard/clients/${bid.clientId}`}
                                    key={bid.id}
                                    className={`flex items-center text-sm py-2 px-1 rounded hover:bg-slate-800/80 transition-colors border-l-2 cursor-pointer
                    ${bid.isHighest ? 'border-brand-400 bg-brand-500/5' : 'border-transparent'}`}
                                >
                                    <div className="flex-[1.5] flex items-center gap-1 min-w-0">
                                        <div className={`w-1.5 h-1.5 rounded-full ${bid.isHighest ? 'bg-brand-400 animate-pulse' : 'bg-slate-600'}`}></div>
                                        <span className="font-medium text-slate-200 truncate">{bid.bidderName}</span>
                                    </div>
                                    <div className="flex-[1.5] text-slate-400 text-xs truncate">{bid.property}</div>
                                    <div className="flex-1 text-right font-bold text-white">${(bid.amount / 1000).toFixed(0)}K</div>

                                    <div className="w-8 ml-2 flex justify-end">
                                        {bid.isHighest && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleEmailBidders(bid.property);
                                                }}
                                                className="text-brand-400 hover:text-brand-300 transition-colors p-1"
                                                title="Email bidders regarding new high bid"
                                            >
                                                <Mail size={16} />
                                            </button>
                                        )}
                                        {bid.willOfferMore && !bid.isHighest && (
                                            <div className="text-success p-1" title="May offer more">
                                                <RefreshCcw size={14} />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right panel - Chart */}
                    <div className="flex-1 h-48 md:h-auto min-h-[150px] relative">
                        <h4 className="text-xs font-semibold text-slate-400 mb-2 absolute top-0 left-0 z-10 bg-surface-card pr-2">Bid Activity (7d)</h4>
                        <div className="absolute inset-0 pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </WidgetBox>

            {/* Email Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setShowModal(false)}></div>
                    <div className="relative z-50 bg-surface-card border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Mail className="text-brand-400" size={20} />
                                <h3 className="font-semibold text-white">Notify Bidders</h3>
                            </div>
                            <button className="text-slate-400 hover:text-white" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-warning/10 border border-warning/20 text-warning text-sm p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <p>You are about to notify <strong>all other bidders</strong> on {selectedProperty} about the new high bid.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none" defaultValue={`New Highest Bid Update — ${selectedProperty}`} />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Message Template</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-brand-500 focus:outline-none resize-none"
                                    defaultValue={`A new highest bid has been placed on ${selectedProperty}. The current deadline to counter is tomorrow at 5:00 PM. Please let me know if you would like to revise your offer.`}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800 bg-slate-800/20 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold rounded-lg shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5"
                            >
                                Send to All Bidders
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BidsOffersBox;
