import React from 'react';

const DashboardCard = ({ title, value, icon, color = 'blue', description }) => {
    // Premium color mapping based on NexaCore Guidelines
    const colorStyles = {
        blue: { bg: 'bg-blue-500', text: 'text-blue-600', lightBg: 'bg-blue-50', shadow: 'shadow-blue-200/50', border: 'border-blue-50' },
        green: { bg: 'bg-emerald-500', text: 'text-emerald-600', lightBg: 'bg-emerald-50', shadow: 'shadow-emerald-200/50', border: 'border-emerald-50' },
        red: { bg: 'bg-rose-500', text: 'text-rose-600', lightBg: 'bg-rose-50', shadow: 'shadow-rose-200/50', border: 'border-rose-50' },
        yellow: { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50', shadow: 'shadow-amber-200/50', border: 'border-amber-50' },
        purple: { bg: 'bg-violet-500', text: 'text-violet-600', lightBg: 'bg-violet-50', shadow: 'shadow-violet-200/50', border: 'border-violet-50' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-600', lightBg: 'bg-orange-50', shadow: 'shadow-orange-200/50', border: 'border-orange-50' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', lightBg: 'bg-indigo-50', shadow: 'shadow-indigo-200/50', border: 'border-indigo-50' },
        cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', lightBg: 'bg-cyan-50', shadow: 'shadow-cyan-200/50', border: 'border-cyan-50' },
        teal: { bg: 'bg-teal-500', text: 'text-teal-600', lightBg: 'bg-teal-50', shadow: 'shadow-teal-200/50', border: 'border-teal-50' },
    };

    const style = colorStyles[color] || colorStyles.blue;

    return (
        <div className={`group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl ${style.shadow} border ${style.border} transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
            {/* Decorative background blob */}
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${style.bg} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{title}</h3>
                    <p className="text-4xl font-black tracking-tight text-slate-800 drop-shadow-sm">{value}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.lightBg} ${style.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
            </div>
            {description && (
                <div className="relative z-10 mt-4 border-t border-slate-50 pt-4">
                    <p className="text-xs font-semibold text-slate-500 tracking-wide flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.bg} mr-2 opacity-70`}></span>
                        {description}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DashboardCard;
