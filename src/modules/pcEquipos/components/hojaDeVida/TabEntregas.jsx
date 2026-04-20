import React from 'react';
import { 
    TruckIcon, 
    UserIcon, 
    CalendarDaysIcon, 
    ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const formatDate = (dateString) => {
    if (!dateString) return '—';
    if (dateString === 'N/A') return 'N/A';
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    try {
        const [year, month, day] = dateString.split('-');
        return `${parseInt(day)} de ${months[parseInt(month) - 1]}, ${year}`;
    } catch (e) {
        return dateString;
    }
};

export default function TabEntregas({ entregas }) {
    if (!entregas || entregas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <TruckIcon className="h-16 w-16 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin historial de entregas</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <TruckIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Trazabilidad de Asignaciones</h3>
                </div>
                <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {entregas.length} REGISTROS
                </span>
            </div>
            
            <div className="space-y-5">
                {entregas.map((e, idx) => (
                    <div key={e.id || idx} className={`group relative rounded-[2rem] p-6 border transition-all duration-300 hover:shadow-xl ${e.devolucion ? 'border-slate-100 bg-slate-50/50' : 'border-indigo-100 bg-white shadow-sm'
                        }`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg ${e.devolucion ? 'bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white shadow-indigo-200'
                                    }`}>
                                    <UserIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900 leading-tight">
                                        {e.funcionario?.nombre || 'Personal No Identificado'}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-slate-400">
                                        <CalendarDaysIcon className="h-3.5 w-3.5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{formatDate(e.fecha_entrega)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${e.devolucion
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-emerald-500 text-white'
                                    }`}>
                                    {e.devolucion ? 'Acta de Devolución' : 'Asignación Activa'}
                                </span>
                                {e.estado && (
                                    <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                                        Estado: {e.estado}
                                    </span>
                                )}
                            </div>
                        </div>
                        {e.devolucion && (
                            <div className="mt-6 pt-6 border-t border-slate-200/50">
                                <div className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-slate-200/50">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Motivo / Observaciones del Retorno</p>
                                        <p className="text-sm font-medium text-slate-600 italic">
                                            "{e.devolucion.observaciones || 'Sin observaciones registradas'}"
                                        </p>
                                        <p className="mt-2 text-[9px] font-bold text-slate-400">FECHA DE RETORNO: {formatDate(e.devolucion.fecha_devolucion)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {e.perifericos && e.perifericos.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Infraestructura / Periféricos Vinculados</p>
                                <div className="flex flex-wrap gap-2">
                                    {e.perifericos.map((p, i) => (
                                        <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                                                {p.nombre || p.tipo || `Activo ${i + 1}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
