import React from 'react';

const DonutChart = ({ data }) => {
    const { menos_24h, entre_1_y_3_dias, mas_3_dias, total_aprobados, porcentaje_menos_24h, porcentaje_1_3_dias, porcentaje_mas_3_dias } = data || {};
    
    if (!total_aprobados) {
        return (
            <div className="flex flex-col items-center justify-center h-56 text-slate-400 text-center">
                <svg className="w-10 h-10 mb-2 opacity-40 text-slate-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sin datos de aprobaciones</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">Los tiempos se calcularán cuando existan pedidos aprobados.</p>
            </div>
        );
    }

    const r = 38;
    const circ = 2 * Math.PI * r; // ~238.76
    
    const p1 = (porcentaje_menos_24h || 0) / 100;
    const p2 = (porcentaje_1_3_dias || 0) / 100;
    const p3 = (porcentaje_mas_3_dias || 0) / 100;

    const stroke1 = p1 * circ;
    const stroke2 = p2 * circ;
    const stroke3 = p3 * circ;

    const offset1 = 0;
    const offset2 = -stroke1;
    const offset3 = -(stroke1 + stroke2);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                    {p1 > 0 && (
                        <circle
                            cx="50" cy="50" r={r} fill="transparent"
                            stroke="#10b981" strokeWidth="10"
                            strokeDasharray={`${stroke1} ${circ}`}
                            strokeDashoffset={offset1}
                            strokeLinecap="round"
                            className="transition-all duration-500 hover:stroke-[12px] cursor-pointer"
                        />
                    )}
                    {p2 > 0 && (
                        <circle
                            cx="50" cy="50" r={r} fill="transparent"
                            stroke="#f59e0b" strokeWidth="10"
                            strokeDasharray={`${stroke2} ${circ}`}
                            strokeDashoffset={offset2}
                            strokeLinecap="round"
                            className="transition-all duration-500 hover:stroke-[12px] cursor-pointer"
                        />
                    )}
                    {p3 > 0 && (
                        <circle
                            cx="50" cy="50" r={r} fill="transparent"
                            stroke="#6366f1" strokeWidth="10"
                            strokeDasharray={`${stroke3} ${circ}`}
                            strokeDashoffset={offset3}
                            strokeLinecap="round"
                            className="transition-all duration-500 hover:stroke-[12px] cursor-pointer"
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-800 tracking-tight">{total_aprobados}</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Aprobados</span>
                </div>
            </div>

            <div className="space-y-2 flex-1 w-full max-w-[220px]">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-100"></span>
                        <span className="text-xs font-bold text-slate-600">&lt; 24 Horas</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">{porcentaje_menos_24h}% ({menos_24h})</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-100"></span>
                        <span className="text-xs font-bold text-slate-600">1 - 3 Días</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg">{porcentaje_1_3_dias}% ({entre_1_y_3_dias})</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-100"></span>
                        <span className="text-xs font-bold text-slate-600">&gt; 3 Días</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg">{porcentaje_mas_3_dias}% ({mas_3_dias})</span>
                </div>
            </div>
        </div>
    );
};

export default function ComprasAverageTimes({ timeStats }) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Average Times Card */}
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Desempeño Operativo</span>
                <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Tiempos Promedio de Gestión</h3>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all duration-300 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:rotate-6 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aprobación de Compras</p>
                                <p className="text-sm text-slate-500 font-medium">De creación a aprobación de compras</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-slate-800 font-mono bg-white px-3 py-1 rounded-xl shadow-sm ring-1 ring-slate-100">{timeStats?.tiempo_promedio_compras || 'N/A'}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all duration-300 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:rotate-6 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aprobación de Responsable</p>
                                <p className="text-sm text-slate-500 font-medium">De compras a visto bueno final</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-slate-800 font-mono bg-white px-3 py-1 rounded-xl shadow-sm ring-1 ring-slate-100">{timeStats?.tiempo_promedio_gerencia || 'N/A'}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all duration-300 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:rotate-6 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo Promedio Total</p>
                                <p className="text-sm text-slate-500 font-medium">Ciclo completo de vida del pedido</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-slate-800 font-mono bg-white px-3 py-1 rounded-xl shadow-sm ring-1 ring-slate-100">{timeStats?.tiempo_promedio_total || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Distribution Chart Card */}
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80 flex flex-col justify-between">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Eficiencia en Tiempos</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Distribución de Ciclo de Entrega</h3>
                </div>
                <DonutChart data={timeStats?.distribucion_tiempos} />
            </div>
        </div>
    );
}
