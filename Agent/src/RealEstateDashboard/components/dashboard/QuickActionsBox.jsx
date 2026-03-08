import React from 'react';
import WidgetBox from '../ui/WidgetBox';
import { Phone, UserPlus, Home, Mail, FileText } from 'lucide-react';

const actions = [
    { icon: Phone, label: 'Record Call' },
    { icon: UserPlus, label: 'Add Client' },
    { icon: Home, label: 'New Listing' },
    { icon: Mail, label: 'Email Bidders' },
    { icon: FileText, label: 'Add Note' }
];

const QuickActionsBox = () => {
    return (
        <WidgetBox title="Quick Actions" className="bg-slate-800/20 backdrop-blur-xl border-dashed border-slate-600/50">
            <div className="flex h-full items-center justify-around gap-2 pb-2">
                {actions.map((action, idx) => (
                    <button
                        key={idx}
                        className="flex flex-col items-center gap-2 group flex-1 p-2 rounded-xl hover:bg-slate-700/50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 shadow-sm transition-all group-hover:scale-110 group-hover:-translate-y-1">
                            <action.icon size={18} />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 text-center whitespace-nowrap group-hover:text-slate-200 transition-colors">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </WidgetBox>
    );
};

export default QuickActionsBox;
