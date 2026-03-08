import React from 'react';
import { Link } from 'react-router-dom';

const WidgetBox = ({ title, children, className = '', actionButton = null, titleHref = null }) => {
    return (
        <div className={`bg-surface-card rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            {(title || actionButton) && (
                <div className="px-5 py-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-800/20 backdrop-blur-sm">
                    {title && (
                        titleHref ? (
                            <Link to={titleHref} className="group/title flex items-center gap-2">
                                <h3 className="font-semibold text-white tracking-wide group-hover/title:text-brand-400 transition-colors uppercase text-[10px] tracking-[0.2em] font-bold text-slate-400">{title}</h3>
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                            </Link>
                        ) : (
                            <h3 className="font-semibold text-white tracking-wide uppercase text-[10px] tracking-[0.2em] font-bold text-slate-400">{title}</h3>
                        )
                    )}
                    {actionButton && <div>{actionButton}</div>}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col relative">
                {children}
            </div>
        </div>
    );
};

export default WidgetBox;
