import React from 'react';
import WidgetBox from '../ui/WidgetBox';
import { mockProperties } from '../../services/mockData';
import { Clock } from 'lucide-react';

const ActivePropertiesBox = () => {
    return (
        <WidgetBox title="Active Properties">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
                {mockProperties.map(prop => (
                    <div key={prop.id} className="bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/50 hover:bg-slate-800/80 transition-colors group cursor-pointer relative">
                        <div className="h-24 w-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors z-10"></div>
                            <img src={prop.image} alt={prop.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold text-white z-20 ${prop.typeColor} shadow-md`}>
                                {prop.type}
                            </div>
                        </div>

                        <div className="p-3">
                            <h4 className="text-sm font-semibold text-slate-200 truncate">{prop.address}</h4>
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Top Bid</p>
                                    <p className="text-sm font-bold text-brand-400">${(prop.maxBid / 1000)}K</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-danger bg-danger/10 px-2 py-1 rounded whitespace-nowrap border border-danger/20">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold tracking-tight">{prop.sellBy}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetBox>
    );
};

export default ActivePropertiesBox;
