import { useNavigate } from 'react-router-dom';
import PropertyWishlistWidget from '../components/dashboard/PropertyWishlistWidget';

export default function Wishlist() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Property Wishlist</h1>
          <p className="text-slate-400">Manage your favorite properties and coordinate tours with your agent.</p>
        </div>
        <button 
          onClick={() => navigate('/search')}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95 whitespace-nowrap"
        >
          Find More Properties
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <PropertyWishlistWidget />
        
        {/* Additional Stats for full page view */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-card rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-white">12</span>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Saved Properties</span>
          </div>
          <div className="bg-surface-card rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-white">4</span>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Agent Suggestions</span>
          </div>
          <div className="bg-surface-card rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-white">2</span>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Tours Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
