import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Heart, CreditCard, Search as SearchIcon, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Financials from './pages/Financials';
import Search from './pages/Search';
import './index.css';

const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link 
      to={path} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-brand-500/10 text-brand-400' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-brand-400' : ''} />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

const Header = () => (
  <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-semibold text-white">Client Portal</h2>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <img 
          src="https://api.dicebear.com/7.x/notionists/svg?seed=Jane&backgroundColor=8B5CF6" 
          alt="Client Avatar" 
          className="w-8 h-8 rounded-full border border-white/10"
        />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface"></div>
      </div>
      <span className="text-sm font-medium text-slate-200">Jane Smith</span>
    </div>
  </header>
);

const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface flex text-slate-100 font-sans selection:bg-brand-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-surface-card/30 flex flex-col shrink-0 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="font-bold text-white leading-none">M</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">TheMiddleBot</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-400 ml-1">CLIENT</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <SidebarItem icon={Home} label="Dashboard" path="/" />
          <SidebarItem icon={SearchIcon} label="Find Homes" path="/search" />
          <SidebarItem icon={Heart} label="Property Wishlist" path="/wishlist" />
          <SidebarItem icon={CreditCard} label="Financial Profile" path="/financials" />
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <SidebarItem icon={Settings} label="Settings" path="/settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/settings" element={<div className="text-slate-400 p-8 text-center bg-surface-card rounded-2xl border border-white/5">Settings coming soon...</div>} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
