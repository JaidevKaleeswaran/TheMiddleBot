import React, { useState } from 'react';
import { Gavel, MapPin, ArrowUpRight, Clock, CheckCircle2, XCircle, AlertCircle, Trash2, Edit3, History as HistoryIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const calcCompetitiveness = (bidAmount, askingPrice) => {
  if (!askingPrice || askingPrice <= 0) return 50;
  const ratio = (bidAmount / askingPrice) * 100;
  return Math.min(99, Math.max(5, Math.round(ratio)));
};

const initialBids = [
  {
    id: 1,
    property: '123 Maple Street',
    askingPrice: 1300000,
    amount: 1265000,
    status: 'Countered',
    time: '2 hours ago',
    realtorFeedback: 'Seller is interested but wants a faster close.',
  },
  {
    id: 2,
    property: '456 Oak Avenue',
    askingPrice: 1100000,
    amount: 975000,
    status: 'Pending',
    time: 'Yesterday',
    realtorFeedback: 'Multiple offers above asking. Consider increasing bid.',
  }
].map(b => ({ ...b, competitiveness: calcCompetitiveness(b.amount, b.askingPrice) }));

const StatusBadge = ({ status }) => {
  const styles = {
    'Accepted': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Countered': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Pending': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Cancelled': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  
  const Icons = {
    'Accepted': CheckCircle2,
    'Countered': AlertCircle,
    'Pending': Clock,
    'Rejected': XCircle,
    'Cancelled': Trash2,
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
  const [activeBids, setActiveBids] = useState(initialBids);
  const [history, setHistory] = useState([
    { id: 101, action: 'Bid Submitted', property: '123 Maple Street', amount: '$1,265,000', date: 'Oct 24, 2:15 PM' },
    { id: 102, action: 'Counter Received', property: '123 Maple Street', amount: '$1,300,000', date: 'Oct 24, 4:30 PM' },
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const handleUpdateBid = (id) => {
    setActiveBids(prev => prev.map(bid => {
      if (bid.id === id) {
        const newAmount = parseInt(editAmount.replace(/[^0-9]/g, ''));
        // Ratio-based competitiveness: bid / askingPrice
        const newComp = calcCompetitiveness(newAmount, bid.askingPrice);
        
        // Add to history
        setHistory(h => [{
          id: Date.now(),
          action: 'Bid Updated',
          property: bid.property,
          amount: `$${newAmount.toLocaleString()}`,
          date: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        }, ...h]);

        return { ...bid, amount: newAmount, competitiveness: newComp, time: 'Just now' };
      }
      return bid;
    }));
    setEditingId(null);
  };

  const handleCancelBid = (id) => {
    const bidToCancel = activeBids.find(b => b.id === id);
    if (bidToCancel) {
      setHistory(h => [{
        id: Date.now(),
        action: 'Bid Cancelled',
        property: bidToCancel.property,
        amount: `$${bidToCancel.amount.toLocaleString()}`,
        date: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      }, ...h]);
      setActiveBids(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 flex flex-col h-[500px] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {showHistory ? (
            <button 
              onClick={() => setShowHistory(false)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 mr-2"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
              <Gavel size={20} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white">
              {showHistory ? 'Offer History' : 'Active Bids & Offers'}
            </h3>
            <p className="text-xs text-slate-400">
              {showHistory ? 'Past negotiations and retracted offers.' : 'Track and manage your real estate negotiations.'}
            </p>
          </div>
        </div>
        {!showHistory && (
          <button 
            onClick={() => setShowHistory(true)}
            className="text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-2 px-3 py-1.5 bg-brand-500/5 rounded-lg border border-brand-500/10"
          >
            <HistoryIcon size={14} />
            History
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              {history.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">{item.action}</span>
                    <h5 className="text-sm font-bold text-white">{item.property}</h5>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">{item.amount}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-6"
            >
              {activeBids.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                  <Gavel size={48} className="text-slate-700 mb-4" />
                  <p className="text-slate-400">No active bids. Start searching for homes!</p>
                </div>
              ) : activeBids.map((bid) => (
                <div key={bid.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4 hover:border-brand-500/20 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/5 flex items-center justify-center">
                        <MapPin size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white leading-tight">{bid.property}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          San Francisco, CA · Asking ${bid.askingPrice?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={bid.status} />
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingId(bid.id);
                            setEditAmount(bid.amount.toString());
                          }}
                          className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-brand-400"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => handleCancelBid(bid.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-md text-slate-400 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Your Bid</span>
                      {editingId === bid.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            autoFocus
                            type="text"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="bg-slate-800 border border-brand-500/50 rounded px-2 py-1 text-sm text-white w-32 focus:outline-none"
                          />
                          <button onClick={() => handleUpdateBid(bid.id)} className="bg-brand-500 p-1 rounded text-white"><CheckCircle2 size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="bg-slate-700 p-1 rounded text-white"><XCircle size={16} /></button>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-white tracking-tight">${bid.amount.toLocaleString()}</span>
                      )}
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
                      <span className={bid.competitiveness > 70 ? 'text-green-400' : 'text-amber-400'}>
                        {bid.competitiveness}% Competitive
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={false}
                        animate={{ width: `${bid.competitiveness}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          bid.competitiveness > 70 ? 'bg-gradient-to-r from-brand-500 to-green-500' : 'bg-gradient-to-r from-brand-500 to-amber-500'
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
