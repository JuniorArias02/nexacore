import React from 'react';
import { IconCart } from './ComprasIcons';

export default function ComprasHero() {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl group">
            <div className="relative z-10">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                    Dashboard Analítico
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                    Compras y Suministros
                </h1>
                <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                    Monitoreo de inventario, directorio de proveedores y análisis del ciclo de gestión de pedidos en tiempo real.
                </p>
            </div>
            {/* Decorative floating icon */}
            <div className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                {IconCart}
            </div>
        </div>
    );
}
