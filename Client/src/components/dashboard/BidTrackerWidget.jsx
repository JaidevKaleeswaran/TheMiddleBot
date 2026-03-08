import React from 'react';
import { Gavel, MapPin, ArrowUpRight, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const bids = [
  {
    id: 1,
    property: '123 Maple Street',
    amount: '$1,265,000',
    status: 'Countered', // Pending, Countered, Accepted, Rejected
    time: '2 hours ago',
    competitiveness: 85,
    realtorFeedback: 'Seller is interested but wants a faster close.',
  },
  {
    id: 2,
    property: '456 Oak Avenue',
    amount: '$975,000',
    status: 'Pending',
    time: 'Yesterday',
    competitiveness: 45,
    realtorFeedback: 'Multiple offers above asking. Consider increasing bid.',
  }
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Accepted': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Countered': 'bg-warning/10 text-warning border-warning/20',
    'Pending': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Rejected': 'bg-danger/10 text-danger border-danger/20',
  };
  
  const Icons = {
    'Accepted': CheckCircle2,
    'Countered': AlertCircle,
    'Pending': Clock,
    'Rejected': XCircle,
  };
  
  const Icon = Icons[status] || Clock;
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${styles[status]}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

export default function BidTrackerWidget() {
  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
            <Gavel size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Active Bids & Offers</h3>
            <p className="text-xs text-slate-400">Track and manage your real estate negotiations.</p>
          </div>
        </div>
        <button className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
          History <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar max-h-[400px]">
        {bids.map((bid) => (
          <div key={bid.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4 hover:border-brand-500/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/5 grayscale group-hover:grayscale-0 transition-all">
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${bid.id}`} alt="Prop" className="w-full h-full opacity-50" />
                </div>
                <div>
                  <h4 className="font-bold text-white leading-tight">{bid.property}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <MapPin size={10} />
                    San Francisco, CA
                  </div>
                </div>
              </div>
              <StatusBadge status={bid.status} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Your Bid</span>
                <span className="text-xl font-bold text-white tracking-tight">{bid.amount}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Status Update</span>
                <span className="text-xs font-medium text-slate-300 block">{bid.time}</span>
              </div>
            </div>

            {/* Competitiveness Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Bid Strength</span>
                <span className={bid.competitiveness > 70 ? 'text-green-400' : 'text-warning'}>
                  {bid.competitiveness}% Competitive
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${bid.competitiveness}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    bid.competitiveness > 70 ? 'bg-gradient-to-r from-brand-500 to-green-500' : 'bg-gradient-to-r from-brand-500 to-warning'
                  }`}
                />
              </div>
            </div>

            {/* Realtor Memo */}
            <div className="p-3 bg-white/5 rounded-xl border-l-2 border-brand-500">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1 block">Agent Note</span>
              <p className="text-xs text-slate-400 italic leading-relaxed">"{bid.realtorFeedback}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
