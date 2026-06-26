import React from 'react';

export default function ComprasRequestTypes({ tipos }) {
    return (
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Desglose de Pedidos</span>
            <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Distribución por Tipo de Solicitud</h3>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tipos?.map((tipo, idx) => {
                    const colors = [
                        { text: 'text-indigo-600', bg: 'bg-indigo-600', lightBg: 'bg-indigo-50 text-indigo-700' },
                        { text: 'text-amber-600', bg: 'bg-amber-500', lightBg: 'bg-amber-50 text-amber-700' },
                        { text: 'text-purple-600', bg: 'bg-purple-600', lightBg: 'bg-purple-50 text-purple-700' },
                        { text: 'text-teal-600', bg: 'bg-teal-600', lightBg: 'bg-teal-50 text-teal-700' },
                    ];
                    const colorSet = colors[idx % colors.length];

                    return (
                        <div key={tipo.id || tipo.nombre} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-black text-slate-800 tracking-tight">{tipo.nombre}</span>
                                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg ${colorSet.lightBg}`}>
                                        {tipo.porcentaje}%
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Participación en el total de solicitudes</p>
                            </div>
                            
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-bold text-slate-500">Cantidad</span>
                                    <span className={`text-sm font-black ${colorSet.text}`}>{tipo.cantidad}</span>
                                </div>
                                <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`${colorSet.bg} h-2 rounded-full transition-all duration-500`} 
                                        style={{ width: `${tipo.porcentaje}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
