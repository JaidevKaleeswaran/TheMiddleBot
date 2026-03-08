import React from 'react';

const WidgetBox = ({ title, children, className = '', actionButton = null }) => {
    return (
        <div className={`bg-surface-card rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            {(title || actionButton) && (
                <div className="px-5 py-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-800/20 backdrop-blur-sm">
                    {title && <h3 className="font-semibold text-white tracking-wide">{title}</h3>}
                    {actionButton && <div>{actionButton}</div>}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 p-5 overflow-hidden flex flex-col relative">
                {children}
            </div>
        </div>
    );
};

export default WidgetBox;
