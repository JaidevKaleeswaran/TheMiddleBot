import React from 'react';
import { Phone, MessageCircle, Video, User, Bot } from 'lucide-react';

const ContactOption = ({ icon: Icon, label, sublabel, colorClass }) => (
  <button className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/30 hover:bg-white/[0.07] transition-all text-left w-full group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{label}</h4>
      <p className="text-[11px] text-slate-400">{sublabel}</p>
    </div>
  </button>
);

export default function DirectCallingWidget() {
  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-brand-500/5 to-transparent flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Phone size={18} className="text-brand-400" />
          Direct Contact
        </h3>
        <div className="w-2 h-2 rounded-full bg-green-500" title="Online" />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <ContactOption 
          icon={User} 
          label="Call Primary Realtor" 
          sublabel="Jaidev Kaleeswaran (Agent)" 
          colorClass="bg-brand-500/20 text-brand-400" 
        />
        <ContactOption 
          icon={Bot} 
          label="Ask TheMiddleBot" 
          sublabel="Instant AI Real Estate Support" 
          colorClass="bg-purple-500/20 text-purple-400" 
        />
        
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 transition-all">
            <MessageCircle size={16} />
            <span className="text-sm font-medium">Text</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 transition-all">
            <Video size={16} />
            <span className="text-sm font-medium">Zoom</span>
          </button>
        </div>
      </div>
    </div>
  );
}
