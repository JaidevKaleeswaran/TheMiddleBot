import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WidgetBox from '../ui/WidgetBox';
import RecordCallModal from '../shared/RecordCallModal';
import { Phone, UserPlus, Home, Mail, FileText } from 'lucide-react';

const actions = [
    { id: 'record', icon: Phone, label: 'Record Call' },
    { id: 'client', icon: UserPlus, label: 'Add Client' },
    { id: 'listing', icon: Home, label: 'New Listing' },
    { id: 'email', icon: Mail, label: 'Email Bidders' },
    { id: 'note', icon: FileText, label: 'Add Note' }
];

const QuickActionsBox = () => {
    const [showRecordModal, setShowRecordModal] = useState(false);
    const navigate = useNavigate();

    const handleAction = (id) => {
        if (id === 'record') setShowRecordModal(true);
        if (id === 'client' || id === 'note') navigate('/dashboard/clients');
        if (id === 'listing') navigate('/dashboard/properties');
        if (id === 'email') navigate('/dashboard/bids');
    };

    return (
        <>
            <WidgetBox title="Quick Actions" className="bg-slate-800/20 backdrop-blur-xl border-dashed border-slate-600/50">
                <div className="flex h-full items-center justify-around gap-2 pb-2">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => handleAction(action.id)}
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

            <RecordCallModal
                isOpen={showRecordModal}
                onClose={() => setShowRecordModal(false)}
                clientId={null}
            />
        </>
    );
};

export default QuickActionsBox;
