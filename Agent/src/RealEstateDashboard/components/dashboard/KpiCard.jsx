import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KpiCard = ({ title, value, trend, isPositive, gradientTheme, path }) => {
    // Map theme strings to actual tailwind gradient classes
    const themeClasses = {
        'pink-peach': 'bg-gradient-to-br from-rose-400 to-orange-300',
        'blue-teal': 'bg-gradient-to-br from-blue-400 to-cyan-300',
        'green-mint': 'bg-gradient-to-br from-emerald-400 to-green-300',
        'violet-indigo': 'bg-gradient-to-br from-violet-500 to-indigo-500',
    };

    const gradientClass = themeClasses[gradientTheme] || 'bg-slate-800';

    const CardContent = (
        <div className={`${gradientClass} rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-full group transition-transform hover:-translate-y-1 w-full`}>
            {/* Background decoration */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                    <p className="text-white/90 font-medium text-sm drop-shadow-sm mb-1">{title}</p>
                    <h2 className="text-3xl font-bold text-white drop-shadow-md tracking-tight">{value}</h2>
                </div>

                <div className="mt-4 flex items-center gap-1 bg-black/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    {isPositive ? (
                        <ArrowUpRight size={14} className="text-white drop-shadow-sm" />
                    ) : (
                        <ArrowDownRight size={14} className="text-white drop-shadow-sm" />
                    )}
                    <span className="text-xs font-semibold text-white drop-shadow-sm">{trend}</span>
                </div>
            </div>
        </div>
    );

    if (path) {
        return (
            <Link to={path} className="block h-full">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
};

export default KpiCard;
