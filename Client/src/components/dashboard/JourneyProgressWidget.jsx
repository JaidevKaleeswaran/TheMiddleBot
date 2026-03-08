import React from 'react';
import { Home, Search, FileText, Key, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, name: 'Pre-Approval', icon: FileText, status: 'completed' },
  { id: 2, name: 'House Hunting', icon: Search, status: 'current' },
  { id: 3, name: 'Offer Pending', icon: Home, status: 'upcoming' },
  { id: 4, name: 'Under Contract', icon: Key, status: 'upcoming' },
  { id: 5, name: 'Closed', icon: CheckCircle2, status: 'upcoming' },
];

export default function JourneyProgressWidget() {
  const currentStepIndex = steps.findIndex(s => s.status === 'current');
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="bg-surface-card rounded-2xl p-6 lg:p-8 border border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Your Journey</h2>
          <p className="text-slate-400">You are currently <strong className="text-brand-400 font-semibold">House Hunting</strong>. Keep touring!</p>
        </div>
        <div className="px-4 py-2 bg-brand-500/10 rounded-lg border border-brand-500/20 text-brand-400 text-sm font-medium flex items-center gap-2">
          <span>Next Action:</span>
          <span className="text-white">Review 123 Maple St Disclosures</span>
        </div>
      </div>

      <div className="relative z-10">
        {/* Progress Bar Track */}
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-800 -translate-y-1/2 rounded-full hidden md:block" />
        
        {/* Progress Bar Fill */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-brand-500 to-purple-500 -translate-y-1/2 rounded-full hidden md:block" 
        />

        <div className="flex flex-col md:flex-row justify-between relative gap-6 md:gap-0">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 group">
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative bg-surface-card
                    ${isCompleted ? 'border-brand-500 text-brand-400' : ''}
                    ${isCurrent ? 'border-brand-400 bg-brand-500/10 text-brand-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : ''}
                    ${!isCompleted && !isCurrent ? 'border-slate-700 text-slate-500' : ''}
                  `}
                >
                  <Icon size={20} className={isCurrent ? 'animate-pulse' : ''} />
                  
                  {isCurrent && (
                    <motion.div
                      className="absolute -inset-2 border-2 border-brand-500/30 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <div className="text-left md:text-center mt-0 md:mt-2">
                  <p className={`text-sm font-semibold ${isCompleted ? 'text-slate-200' : isCurrent ? 'text-white' : 'text-slate-500'}`}>
                    {step.name}
                  </p>
                  <span className={`text-xs ${isCompleted ? 'text-brand-400' : isCurrent ? 'text-brand-300' : 'text-slate-600'}`}>
                    {isCompleted ? 'Done' : isCurrent ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
