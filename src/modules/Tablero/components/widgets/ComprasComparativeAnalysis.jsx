import React, { useState } from 'react';

const renderTable = (pedidos, type) => {
    if (!pedidos || pedidos.length === 0) {
        return (
            <div className="text-center py-10 text-slate-400 font-medium">
                No hay suficientes pedidos aprobados para este listado.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                    <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pedido</th>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Solicitante</th>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sede</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tiempo total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {pedidos.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-800 text-sm">#{p.consecutivo}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3.5 text-sm font-semibold text-slate-600">{p.elaborado_por}</td>
                            <td className="px-4 py-3.5 text-sm text-slate-500 font-medium">{p.sede}</td>
                            <td className="px-4 py-3.5 text-right">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-none ${
                                    type === 'fastest' 
                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10' 
                                        : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10'
                                }`}>
                                    {type === 'fastest' ? '⚡ ' : '🕒 '}
                                    {p.duracion}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function ComprasComparativeAnalysis({ timeStats }) {
    const [activeTab, setActiveTab] = useState('fastest');

    return (
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Análisis Comparativo</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">Extremos de Gestión Operativa</h3>
                </div>

                <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/50">
                    <button
                        onClick={() => setActiveTab('fastest')}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                            activeTab === 'fastest'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        ⚡ Mayor Eficiencia
                    </button>
                    <button
                        onClick={() => setActiveTab('slowest')}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                            activeTab === 'slowest'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        🕒 Mayor Demora
                    </button>
                </div>
            </div>

            {activeTab === 'fastest' ? (
                <div>
                    <p className="text-sm text-slate-500 mb-4 font-medium">Pedidos aprobados y tramitados en el menor tiempo histórico.</p>
                    {renderTable(timeStats?.pedidos_mas_rapidos, 'fastest')}
                </div>
            ) : (
                <div>
                    <p className="text-sm text-slate-500 mb-4 font-medium">Pedidos aprobados que han presentado mayores tiempos de trámite acumulado.</p>
                    {renderTable(timeStats?.pedidos_mas_lentos, 'slowest')}
                </div>
            )}
        </div>
    );
}
