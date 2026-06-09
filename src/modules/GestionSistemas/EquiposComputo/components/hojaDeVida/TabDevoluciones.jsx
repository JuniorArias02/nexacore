import React from 'react';
import { 
    ArrowPathIcon, 
    UserIcon, 
    CalendarDaysIcon, 
    ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const formatDate = (dateString) => {
    if (!dateString) return '—';
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

export default function TabDevoluciones({ entregas }) {
    const devoluciones = entregas?.filter(e => e.devolucion) || [];

    if (devoluciones.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <ArrowPathIcon className="h-16 w-16 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin registros de devolución</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl">
                        <ArrowPathIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Historial de Retornos</h3>
                </div>
                <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {devoluciones.length} DEVOLUCIONES
                </span>
            </div>
            
            <div className="space-y-5">
                {devoluciones.map((e, idx) => (
                    <div key={e.id || idx} className="group relative rounded-[2rem] p-6 border border-amber-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-amber-600 text-white shadow-lg shadow-amber-200">
                                    <UserIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900 leading-tight">
                                        {e.funcionario?.nombre || 'Personal No Identificado'}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-slate-400">
                                        <CalendarDaysIcon className="h-3.5 w-3.5" />
                                        <span className="text-xs font-bold font-mono tracking-tight">CIERRE DE ASIGNACIÓN: {formatDate(e.devolucion.fecha_devolucion)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white shadow-sm">
                                    Devuelto al Almacén
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                        <ExclamationTriangleIcon className="h-3 w-3" />
                                        Motivo del Retorno
                                    </p>
                                    <p className="text-sm font-medium text-slate-600 italic">
                                        "{e.devolucion.observaciones || 'Sin observaciones'}"
                                    </p>
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Originalmente entregado el</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {formatDate(e.fecha_entrega)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {e.perifericos && e.perifericos.length > 0 && (
                            <div className="mt-4 pt-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Periféricos Retornados</p>
                                <div className="flex flex-wrap gap-2">
                                    {e.perifericos.map((p, i) => (
                                        <span key={i} className="text-[10px] font-bold text-amber-700 px-2 py-1 bg-amber-50 rounded-lg">
                                            {p.nombre || p.tipo}
                                        </span>
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
