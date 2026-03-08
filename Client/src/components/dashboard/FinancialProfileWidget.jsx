import React, { useState } from 'react';
import { Shield, Upload, DollarSign, FileText, TrendingUp, Info, Pencil, Check, X } from 'lucide-react';

const StatRow = ({ label, value, icon: Icon, isEditing }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group/row transition-all hover:bg-white/[0.08]">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium text-slate-300">{label}</span>
    </div>
    {isEditing ? (
      <input 
        type="text" 
        defaultValue={value} 
        className="bg-slate-800 border border-brand-500/30 rounded px-2 py-0.5 text-sm text-white w-32 focus:outline-none focus:border-brand-500"
      />
    ) : (
      <span className="text-sm font-bold text-white">{value}</span>
    )}
  </div>
);

const UploadBox = ({ label, sublabel }) => (
  <div className="group border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:border-brand-500/50 hover:bg-brand-500/5 cursor-pointer">
    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-400 mb-2 transition-colors">
      <Upload size={18} />
    </div>
    <span className="text-sm font-semibold text-slate-200">{label}</span>
    <span className="text-xs text-slate-500 mt-1">{sublabel}</span>
  </div>
);

export default function FinancialProfileWidget() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-brand-500/5 to-transparent">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield size={20} className="text-brand-400" />
            Financial Profile
          </h3>
          <div className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded border border-green-500/20">
            Verified
          </div>
        </div>
        <p className="text-sm text-slate-400">Your statistics used by realtors to prioritize your offers.</p>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        {/* Core Stats Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={14} />
              Buying Power Stats
            </h4>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-brand-400 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
            >
              {isEditing ? (
                <>
                  <Check size={14} className="text-green-500" />
                  Save
                </>
              ) : (
                <>
                  <Pencil size={14} />
                  Edit
                </>
              )}
            </button>
          </div>
          <StatRow icon={DollarSign} label="Annual Income" value="$185,000" isEditing={isEditing} />
          <StatRow icon={DollarSign} label="Down Payment" value="$250,000 (20%)" isEditing={isEditing} />
          <StatRow icon={FileText} label="Pre-Approval" value="$1,500,000" isEditing={isEditing} />
          <StatRow icon={Info} label="Loan Type" value="30-yr Fixed Conventional" isEditing={isEditing} />
        </div>

        {/* Realtor Priority Insights */}
        <div className="bg-brand-500/5 rounded-2xl p-4 border border-brand-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            <h4 className="text-xs font-bold text-brand-300 uppercase tracking-widest">Realtor Importance Insight</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your high down payment and verified income put you in the <strong className="text-brand-300">Top 15%</strong> of active buyers. Sellers are likely to skip counters and accept your offers.
          </p>
        </div>

        {/* Document Uploads */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Documents Tracking</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UploadBox label="Bank Statements" sublabel="Last 3 Months" />
            <UploadBox label="Credit Report" sublabel="Recent Statement" />
          </div>
        </div>

        <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-sm font-semibold transition-all border border-white/5">
          Download Verification Report
        </button>
      </div>
    </div>
  );
}
