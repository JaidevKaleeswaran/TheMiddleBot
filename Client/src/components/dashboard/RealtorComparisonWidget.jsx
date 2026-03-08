import React from 'react';
import { Users, Star, TrendingUp, Award } from 'lucide-react';

const RealtorCard = ({ name, rating, closings, specialty, image }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-500/20 transition-all">
    <div className="flex items-center gap-3 mb-3">
      <img src={image} alt={name} className="w-10 h-10 rounded-full border border-white/10" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white truncate">{name}</h4>
        <div className="flex items-center gap-1 text-[10px] text-warning">
          <Star size={10} fill="currentColor" /> {rating} Rating
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-bold text-brand-400">{closings}</span>
        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-tighter">Closings</span>
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5 mt-2">
      <span className="px-2 py-0.5 bg-brand-500/10 text-brand-300 text-[9px] font-bold rounded-md border border-brand-500/10">
        {specialty}
      </span>
    </div>
  </div>
);

export default function RealtorComparisonWidget() {
  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-brand-500/5 to-transparent">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award size={18} className="text-brand-400" />
          Recommended Realtors
        </h3>
        <p className="text-xs text-slate-400 mt-1">Top performers in your target area.</p>
      </div>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar max-h-[400px]">
        <RealtorCard 
          name="Sarah Jenkins" 
          rating="4.9" 
          closings="124" 
          specialty="Luxury Condos" 
          image="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=F59E0B"
        />
        <RealtorCard 
          name="Mike Ross" 
          rating="4.8" 
          closings="98" 
          specialty="First-time Buyers" 
          image="https://api.dicebear.com/7.x/notionists/svg?seed=Mike&backgroundColor=10B981"
        />
        <RealtorCard 
          name="Linda Chen" 
          rating="5.0" 
          closings="156" 
          specialty="Bay Area Tech" 
          image="https://api.dicebear.com/7.x/notionists/svg?seed=Linda&backgroundColor=8B5CF6"
        />
        
        <button className="w-full py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 rounded-xl text-xs font-bold transition-all border border-brand-500/20 mt-2">
          View All Area Experts
        </button>
      </div>
    </div>
  );
}
