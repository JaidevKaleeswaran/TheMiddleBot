import React from 'react';
import FinancialProfileWidget from '../components/dashboard/FinancialProfileWidget';

export default function Financials() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Financial Profile</h1>
        <p className="text-slate-400">Manage your buying power, income details, and important financial documents.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <FinancialProfileWidget />
        
        {/* Additional Detail Section for full page view */}
        <div className="bg-surface-card rounded-2xl border border-white/5 p-8">
          <h3 className="text-lg font-bold text-white mb-4">Why this matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="text-sm font-bold text-brand-400 mb-2">Offer Strength</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Realtors use your financial profile to prioritize your offers in competitive markets. A verified profile increases your chances of acceptance by 40%.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="text-sm font-bold text-brand-400 mb-2">Seamless Closing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Having your documents ready and verified upfront reduces the time-to-close by an average of 12 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
