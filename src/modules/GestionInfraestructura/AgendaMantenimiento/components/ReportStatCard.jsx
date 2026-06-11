import React from 'react';

const ReportStatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
    const colorVariants = {
        blue: 'bg-blue-50 text-blue-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        violet: 'bg-violet-50 text-violet-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colorVariants[color]} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-black px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                    {title}
                </p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                    {value}
                </h3>
            </div>
        </div>
    );
};

export default ReportStatCard;
