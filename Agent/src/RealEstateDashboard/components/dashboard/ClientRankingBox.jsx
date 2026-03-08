import React from 'react';
import WidgetBox from '../ui/WidgetBox';
import { mockClients } from '../../services/mockData';

const ClientRankingBox = () => {
    return (
        <WidgetBox title="Client Importance Ranking">
            <div className="flex text-xs font-medium text-slate-400 mb-3 px-2">
                <div className="w-8">#</div>
                <div className="flex-1">Client</div>
                <div className="flex-1 text-center">Score</div>
                <div className="w-20 text-right">Tier</div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {mockClients.sort((a, b) => b.importanceScore - a.importanceScore).map((client, index) => {
                    let tierColor = 'bg-green-500';
                    let textColor = 'text-green-400';
                    let bgColor = 'bg-green-500/10';

                    if (client.importanceScore >= 80) {
                        tierColor = 'bg-danger';
                        textColor = 'text-red-400';
                        bgColor = 'bg-red-500/10';
                    } else if (client.importanceScore >= 60) {
                        tierColor = 'bg-warning';
                        textColor = 'text-yellow-400';
                        bgColor = 'bg-yellow-500/10';
                    }

                    return (
                        <div key={client.id} className="flex items-center gap-2 group p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                            <div className="w-6 text-slate-500 font-medium text-sm">{index + 1}</div>

                            <div className="flex-1 min-w-0 flex items-center gap-3">
                                <img src={client.avatar} alt={client.name} className="w-8 h-8 rounded-full bg-slate-800 ring-1 ring-slate-700" />
                                <div>
                                    <div className="text-sm font-semibold text-slate-200 truncate">{client.name}</div>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden ring-1 ring-slate-700/50">
                                    <div
                                        className={`h-full ${tierColor} rounded-full transition-all duration-1000 ease-in-out`}
                                        style={{ width: `${client.importanceScore}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="w-20 text-right">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${bgColor} ${textColor} border border-current shadow-sm`}>
                                    {client.tier}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </WidgetBox>
    );
};

export default ClientRankingBox;
