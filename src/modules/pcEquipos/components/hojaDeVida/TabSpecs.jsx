import React from 'react';
import { 
    CpuChipIcon, 
    DocumentTextIcon, 
    ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const SpecCard = ({ label, value, highlight }) => (
    <div className={`rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg ${highlight ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100'}`}>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <p className={`text-sm font-bold ${highlight ? 'text-indigo-900' : 'text-slate-700'}`}>{value || '—'}</p>
    </div>
);

export default function TabSpecs({ specs }) {
    if (!specs) {
        return (
            <div className="text-center py-16 text-gray-400">
                <CpuChipIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sin especificaciones registradas</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <CpuChipIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Arquitectura de Hardware</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <SpecCard label="Procesador / CPU" value={specs.procesador} highlight />
                    <SpecCard label="Memoria RAM" value={specs.memoria_ram} highlight />
                    <SpecCard label="Tecnología de Almacenamiento" value={specs.disco_duro} highlight />
                    <SpecCard label="Capacidad Bruta" value={specs.capacidad_disco} />
                    <SpecCard label="Procesamiento Gráfico" value={specs.tarjeta_video} />
                    <SpecCard label="Interfaz de Red" value={specs.tarjeta_red} />
                    <SpecCard label="Controladora de Audio" value={specs.tarjeta_sonido} />
                    <SpecCard label="Puertos USB" value={specs.usb} />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Periféricos & Multimedia</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <SpecCard label="Unidad de Visualización" value={specs.monitor} />
                    <SpecCard label="Unidad de Entrada (Teclado)" value={specs.teclado} />
                    <SpecCard label="Unidad de Entrada (Mouse)" value={specs.mouse} />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl">
                        <ShieldCheckIcon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Conectividad & Red</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <SpecCard label="Servicio de Internet" value={specs.internet} />
                    <SpecCard label="Velocidad de Enlace" value={specs.velocidad_red} />
                </div>
            </div>
        </div>
    );
}
