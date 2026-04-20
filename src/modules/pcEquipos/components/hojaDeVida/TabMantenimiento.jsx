import React from 'react';
import { 
    WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

const colorMap = {
    red: { bg: 'bg-red-50/50', border: 'border-red-100', text: 'text-red-700', icon: 'text-red-500', fill: 'bg-red-500' },
    amber: { bg: 'bg-amber-50/50', border: 'border-amber-100', text: 'text-amber-700', icon: 'text-amber-500', fill: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-500', fill: 'bg-emerald-500' },
    slate: { bg: 'bg-slate-50/50', border: 'border-slate-100', text: 'text-slate-600', icon: 'text-slate-400', fill: 'bg-slate-400' },
};

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

export default function TabMantenimiento({ mantenimientos, config }) {
    const getColor = () => {
        if (config.dias_restantes === null) return 'slate';
        if (config.dias_restantes <= 0) return 'red';
        if (config.dias_restantes <= 30) return 'amber';
        return 'emerald';
    };
    const c = colorMap[getColor()];

    const progress = config.dias_restantes !== null
        ? Math.max(0, Math.min(100, (config.dias_restantes / config.dias_cumplimiento) * 100))
        : 0;

    return (
        <div className="space-y-12">
            {/* Maintenance KPI Card */}
            <div className={`relative overflow-hidden rounded-[2.5rem] p-10 border-2 transition-all duration-500 ${c.border} ${c.bg}`}>
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm ${c.fill} text-white`}>
                            Estado de Mantenimiento
                        </span>
                        <h3 className={`text-4xl font-black tracking-tight ${c.text} mb-3`}>
                            {config.dias_restantes !== null
                                ? config.dias_restantes <= 0
                                    ? 'ACCION REQUERIDA'
                                    : `${config.dias_restantes} Días Restantes`
                                : 'SIN PROGRAMACIÓN'}
                        </h3>
                        <p className="text-slate-500 font-bold text-sm max-w-md">
                            {config.dias_restantes !== null
                                ? `Este equipo requiere mantenimiento preventivo cada ${config.dias_cumplimiento} días. Próxima intervención programada: ${formatDate(config.fecha_proximo_mantenimiento) || 'Pendiente'}.`
                                : 'No se ha establecido un ciclo de mantenimiento para este activo.'}
                        </p>
                    </div>

                    <div className="w-full md:w-64 space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progreso del Ciclo</p>
                            <p className={`text-sm font-black ${c.text}`}>{Math.round(progress)}%</p>
                        </div>
                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out shadow-lg ${c.fill}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 tracking-wider">
                            <span>ULTIMO: {formatDate(config.fecha_ultimo_mantenimiento)}</span>
                            <span>FREQ: {config.dias_cumplimiento || 0}d</span>
                        </div>
                    </div>
                </div>
                {/* Decoration */}
                <WrenchScrewdriverIcon className={`absolute -right-10 -bottom-10 h-48 w-48 opacity-5 transform rotate-12 ${c.text}`} />
            </div>

            {/* History Table */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <WrenchScrewdriverIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Registro Maestro de Intervenciones</h3>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha / Ciclo</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipo de Acción</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Descripción Técnica</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inversión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {mantenimientos?.map((m, idx) => (
                                    <tr key={m.id || idx} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-700">{formatDate(m.fecha)}</p>
                                            <p className="text-[9px] font-bold text-slate-400 tracking-wider">REGISTRO #{idx + 1}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                m.tipo_mantenimiento === 'preventivo' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {m.tipo_mantenimiento}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-medium text-slate-600 max-w-md leading-relaxed">
                                                {m.descripcion || '—'}
                                            </p>
                                            {m.nombre_repuesto && (
                                                <p className="mt-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                                    REPUESTO: {m.nombre_repuesto} {m.cantidad_repuesto ? `(×${m.cantidad_repuesto})` : ''}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                            {m.responsable_mantenimiento || m.empresa_responsable?.nombre || 'Interno'}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-base font-black text-slate-900">
                                                {m.costo_repuesto ? `$${Number(m.costo_repuesto).toLocaleString()}` : '—'}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">COP TOTAL</p>
                                        </td>
                                    </tr>
                                ))}
                                {(!mantenimientos || mantenimientos.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <WrenchScrewdriverIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin historial de mantenimiento</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
