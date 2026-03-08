import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WidgetBox from '../ui/WidgetBox';
import { mockDealProbabilities } from '../../services/mockData';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Info } from 'lucide-react';

const DealProbabilityBox = () => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (index) => {
        if (expandedRow === index) {
            setExpandedRow(null);
        } else {
            setExpandedRow(index);
        }
    };

    const getUrgencyClasses = (prob) => {
        if (prob >= 75) return 'bg-success text-green-400 bg-green-500/10 fill-color-success';
        if (prob >= 40) return 'bg-warning text-yellow-400 bg-yellow-500/10 fill-color-warning';
        return 'bg-danger text-red-400 bg-red-500/10 fill-color-danger';
    };

    return (
        <WidgetBox title="Deal Probability Score" actionButton={
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-300 uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded">
                Powered by Featherless
            </span>
        }>
            <div className="flex text-xs font-semibold text-slate-400 mb-2 border-b border-slate-700/80 pb-2 px-2">
                <div className="flex-[1.5]">Property</div>
                <div className="flex-1">Client</div>
                <div className="flex-1 text-center">Probability</div>
                <div className="w-8 ml-2"></div>
            </div>

            <div className="overflow-y-auto pr-1 custom-scrollbar space-y-2 pb-6">
                {mockDealProbabilities.map((deal, idx) => {
                    const isExpanded = expandedRow === idx;
                    const { bgClass, textClass, fillClass } = getUrgencyClasses(deal.probability);

                    return (
                        <div key={idx} className="bg-slate-800/20 border border-slate-700/50 rounded-xl overflow-hidden transition-all hover:border-slate-600/50 group">
                            <div
                                className="flex items-center text-sm py-2 px-3 cursor-pointer"
                                onClick={() => toggleRow(idx)}
                            >
                                <div className="flex-[1.5] font-semibold text-slate-200 truncate pr-2">{deal.property}</div>
                                <div className="flex-1 text-slate-400 truncate pr-2">
                                    <Link
                                        to={`/dashboard/clients/${deal.clientId}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-brand-400 transition-colors cursor-pointer"
                                    >
                                        {deal.client}
                                    </Link>
                                </div>

                                <div className="flex-1 flex items-center justify-center gap-2">
                                    <span className="font-bold text-white w-8 text-right">{deal.probability}%</span>
                                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden flex-shrink-0 relative">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000`}
                                            style={{ width: `${deal.probability}%`, backgroundColor: deal.probability >= 75 ? '#10B981' : deal.probability >= 40 ? '#F59E0B' : '#EF4444' }}
                                        ></div>
                                    </div>
                                    {deal.trend === 'up' ? (
                                        <TrendingUp size={14} className="text-success" />
                                    ) : (
                                        <TrendingDown size={14} className="text-danger" />
                                    )}
                                </div>

                                <div className="w-8 ml-2 flex justify-end text-slate-500 group-hover:text-white transition-colors">
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                            </div>

                            {/* Expanded Area */}
                            {isExpanded && (
                                <div className="px-3 pb-3 pt-1 animate-fade-in border-t border-slate-700/50 bg-slate-800/30">
                                    <div className="flex items-start gap-2 text-xs text-slate-400">
                                        <div className="mt-0.5 text-brand-400 shrink-0"><Info size={14} /></div>
                                        <div>
                                            <span className="font-semibold text-brand-200">Key Factors: </span>
                                            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-300">
                                                {deal.factors.map((f, i) => <li key={i}>{f}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </WidgetBox>
    );
};

export default DealProbabilityBox;
