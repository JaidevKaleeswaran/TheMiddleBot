import React from 'react';
import { Link } from 'react-router-dom';
import WidgetBox from '../ui/WidgetBox';
import { mockDeadlines } from '../../services/mockData';
import { Calendar, Phone, Briefcase } from 'lucide-react';

const icons = {
    'Sell By': Calendar,
    'Callback': Phone,
    'Meeting': Briefcase
};

const DeadlinesBox = () => {
    return (
        <WidgetBox title="Upcoming Deadlines" titleHref="/dashboard/deadlines">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 custom-scrollbar hide-scroll-ui">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700/50 -z-10 translate-y-[-14px]"></div>

                {mockDeadlines.map((deadline, idx) => {
                    const IconComponent = icons[deadline.type] || Calendar;
                    const urgencyColor = deadline.urgency === 'danger' ? 'bg-danger text-white shadow-danger/50'
                        : deadline.urgency === 'warning' ? 'bg-warning text-white shadow-warning/50'
                            : 'bg-brand-500 text-white shadow-brand-500/50';

                    return (
                        <Link
                            to={`/dashboard/clients/${deadline.clientId}`}
                            key={idx}
                            className="flex flex-col items-center flex-1 min-w-[120px] group cursor-pointer"
                        >
                            {/* Top Label */}
                            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-brand-300 transition-colors">
                                {deadline.date}
                            </div>

                            {/* Node */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${urgencyColor} mb-3 relative`}>
                                <IconComponent size={16} />
                                <div className={`absolute -inset-1 rounded-full border-2 border-transparent group-hover:border-current opacity-30 transition-all scale-75 group-hover:scale-100`}></div>
                            </div>

                            {/* Bottom Content */}
                            <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-lg text-center w-full shadow-md group-hover:border-slate-600 transition-colors">
                                <p className="text-[10px] font-bold text-slate-300 mb-0.5">{deadline.type}</p>
                                <p className="text-[11px] text-slate-400 font-medium leading-tight truncate px-1" title={deadline.text}>
                                    {deadline.text}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </WidgetBox>
    );
};

export default DeadlinesBox;
