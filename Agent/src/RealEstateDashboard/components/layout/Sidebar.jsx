import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, LayoutDashboard, Users, Home, FileText, Settings, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', active: true },
        { name: 'Clients', icon: Users, path: '#', active: false },
        { name: 'Properties', icon: Home, path: '#', active: false },
        { name: 'Notes', icon: FileText, path: '#', active: false },
        { name: 'Settings', icon: Settings, path: '#', active: false },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col 
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:relative md:flex'}
        `}
            >
                {/* Header (Logo) */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-500/20 p-1.5 rounded-lg flex items-center justify-center">
                            <Bot className="text-brand-400" size={24} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">TheMiddle<span className="text-brand-400">Bot</span></span>
                    </div>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group
                ${item.active
                                    ? 'bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:pl-4'
                                }`}
                            title={!item.active ? "Coming soon" : ""}
                        >
                            <item.icon size={20} className={item.active ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'} />
                            {item.name}
                            {!item.active && (
                                <span className="ml-auto text-[10px] uppercase font-bold tracking-wider text-slate-600 group-hover:text-slate-500 transition-colors">
                                    Soon
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800/50 m-2 mt-auto rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center gap-3">
                    <div className="relative">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=475569"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover bg-slate-800"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">David Grey. H</p>
                        <p className="text-xs text-slate-400 truncate">Project Manager</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
