import React, { useState } from 'react';

export default function ComprasBreakdowns({ stats }) {
    const [expandSedes, setExpandSedes] = useState(false);
    const [expandProcesos, setExpandProcesos] = useState(false);

    const ITEM_LIMIT = 5;

    const displayedSedes = expandSedes 
        ? stats?.desglose_por_sede 
        : stats?.desglose_por_sede?.slice(0, ITEM_LIMIT);

    const displayedProcesos = expandProcesos 
        ? stats?.desglose_por_proceso 
        : stats?.desglose_por_proceso?.slice(0, ITEM_LIMIT);

    const totalSedes = stats?.desglose_por_sede?.reduce((acc, curr) => acc + curr.cantidad, 0) || 0;
    const totalProcesos = stats?.desglose_por_proceso?.reduce((acc, curr) => acc + curr.cantidad, 0) || 0;

    return (
        <div className="grid gap-6 lg:grid-cols-2 items-start">
            {/* Breakdown by Sede */}
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80 flex flex-col">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Distribución Geográfica</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Pedidos por Sede</h3>
                </div>
                
                {stats?.desglose_por_sede?.length > 0 ? (
                    <div className="flex flex-col flex-1 justify-between">
                        <div className="space-y-5 pb-2 relative">
                            {displayedSedes.map((sede, idx) => {
                                const percentage = totalSedes > 0 ? (sede.cantidad / totalSedes) * 100 : 0;
                                return (
                                    <div key={sede.id || idx} className="group flex flex-col animate-fade-in-up">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-bold text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1 mr-4" title={sede.nombre}>{sede.nombre}</span>
                                            <span className="text-sm font-black text-slate-800 bg-indigo-50/50 border border-indigo-100 px-2 py-0.5 rounded-lg shrink-0">{sede.cantidad}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-600 relative overflow-hidden" 
                                                style={{ width: `${percentage}%` }}
                                            >
                                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {!expandSedes && stats.desglose_por_sede.length > ITEM_LIMIT && (
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                            )}
                        </div>
                        {stats.desglose_por_sede.length > ITEM_LIMIT && (
                            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-center">
                                <button 
                                    onClick={() => setExpandSedes(!expandSedes)}
                                    className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 transition-all text-xs font-black text-slate-500 tracking-widest uppercase"
                                >
                                    {expandSedes ? (
                                        <>Colapsar <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></>
                                    ) : (
                                        <>Ver Todo ({stats.desglose_por_sede.length}) <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400 font-medium flex-1 flex items-center justify-center">No hay datos disponibles</div>
                )}
            </div>

            {/* Breakdown by Proceso */}
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80 flex flex-col">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">Distribución Operativa</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Pedidos por Proceso</h3>
                </div>

                {stats?.desglose_por_proceso?.length > 0 ? (
                    <div className="flex flex-col flex-1 justify-between">
                        <div className="space-y-5 pb-2 relative">
                            {displayedProcesos.map((proceso, idx) => {
                                const percentage = totalProcesos > 0 ? (proceso.cantidad / totalProcesos) * 100 : 0;
                                return (
                                    <div key={proceso.id || idx} className="group flex flex-col animate-fade-in-up">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-bold text-slate-700 tracking-tight group-hover:text-teal-600 transition-colors line-clamp-1 mr-4" title={proceso.nombre}>{proceso.nombre}</span>
                                            <span className="text-sm font-black text-slate-800 bg-teal-50/50 border border-teal-100 px-2 py-0.5 rounded-lg shrink-0">{proceso.cantidad}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className="bg-teal-500 h-2.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-teal-600 relative overflow-hidden" 
                                                style={{ width: `${percentage}%` }}
                                            >
                                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {!expandProcesos && stats.desglose_por_proceso.length > ITEM_LIMIT && (
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                            )}
                        </div>
                        {stats.desglose_por_proceso.length > ITEM_LIMIT && (
                            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-center">
                                <button 
                                    onClick={() => setExpandProcesos(!expandProcesos)}
                                    className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 hover:text-teal-600 transition-all text-xs font-black text-slate-500 tracking-widest uppercase"
                                >
                                    {expandProcesos ? (
                                        <>Colapsar <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></>
                                    ) : (
                                        <>Ver Todo ({stats.desglose_por_proceso.length}) <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400 font-medium flex-1 flex items-center justify-center">No hay datos disponibles</div>
                )}
            </div>
        </div>
    );
}
