import React from 'react';
import { 
    ComputerDesktopIcon, 
    CalendarDaysIcon 
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

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-4 border-b border-slate-50 last:border-0 group/row px-2 hover:bg-white/50 transition-colors">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/row:text-indigo-500 transition-colors">{label}</span>
        <span className="text-sm font-bold text-slate-700 text-right">{value || '—'}</span>
    </div>
);

export default function TabGeneral({ equipo }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <ComputerDesktopIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Identificación del Activo</h3>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <InfoRow label="Nombre del Equipo" value={equipo.nombre_equipo} />
                    <InfoRow label="Marca / Fabricante" value={equipo.marca} />
                    <InfoRow label="Modelo / Referencia" value={equipo.modelo} />
                    <InfoRow label="Número de Serial" value={equipo.serial} />
                    <InfoRow label="Código Inventario (AF)" value={equipo.numero_inventario} />
                    <InfoRow label="Categoría de Equipo" value={equipo.tipo} />
                    <InfoRow label="Dirección IP Fija" value={equipo.ip_fija} />
                    <InfoRow label="Tipo de Propiedad" value={equipo.propiedad} />
                </div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Detalles Administrativos</h3>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <InfoRow label="Sede de Operación" value={equipo.sede?.nombre} />
                    <InfoRow label="Área / Departamento" value={equipo.area?.nombre} />
                    <InfoRow label="Responsable Asignado" value={equipo.responsable?.nombre_completo} />
                    <InfoRow label="Fecha de Ingreso" value={formatDate(equipo.fecha_ingreso)} />
                    <InfoRow label="Fecha de Entrega" value={formatDate(equipo.fecha_entrega)} />
                    <InfoRow label="Periodo de Garantía" value={equipo.garantia_meses ? `${equipo.garantia_meses} meses` : null} />
                    <InfoRow label="Modo de Adquisición" value={equipo.forma_adquisicion} />
                    <InfoRow label="Sincronizado por" value={equipo.creador?.nombre_completo || equipo.creador?.usuario} />
                </div>
            </div>
            {(equipo.descripcion_general || equipo.observaciones || equipo.repuestos_principales || equipo.recomendaciones || equipo.equipos_adicionales) && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {equipo.descripcion_general && (
                        <div className="bg-indigo-50/30 border border-indigo-100 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3">Descripción General</h4>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{equipo.descripcion_general}</p>
                        </div>
                    )}
                    {equipo.observaciones && (
                        <div className="bg-amber-50/30 border border-amber-100 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-3">Observaciones Técnicas</h4>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{equipo.observaciones}</p>
                        </div>
                    )}
                    {equipo.repuestos_principales && (
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Repuestos Principales</h4>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{equipo.repuestos_principales}</p>
                        </div>
                    )}
                    {equipo.recomendaciones && (
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Recomendaciones de Uso</h4>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{equipo.recomendaciones}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
