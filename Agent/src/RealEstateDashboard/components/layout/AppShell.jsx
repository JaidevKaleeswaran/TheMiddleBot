import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AgentChat from '../agent/AgentChat';

const AppShell = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-surface text-slate-100 antialiased font-sans">
            {/* Sidebar (Desktop + Mobile overlay) */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
                <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Scrollable Dashboard Area */}
                <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-slate-900/50">
                    <Outlet />
                </main>
            </div>

            {/* Floating Global Agent Chat */}
            <AgentChat />
        </div>
    );
};

export default AppShell;
