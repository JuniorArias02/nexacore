import React from 'react';
import { IconCart, IconBox, IconTruck } from './ComprasIcons';

export default function ComprasMetrics({ stats }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-indigo-100/40 border border-slate-100 hover:scale-[1.03] transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pedidos Totales</span>
                        <p className="text-3xl font-black mt-1 text-slate-800">{stats?.total_pedidos || 0}</p>
                    </div>
                    <span className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
                        {IconCart}
                    </span>
                </div>
                <p className="mt-4 text-xs text-indigo-500 font-bold uppercase tracking-wider">Histórico de solicitudes</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-orange-100/40 border border-slate-100 hover:scale-[1.03] transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pedidos Pendientes</span>
                        <p className="text-3xl font-black mt-1 text-slate-800">{stats?.pedidos_pendientes || 0}</p>
                    </div>
                    <span className="p-3.5 rounded-2xl bg-orange-50 text-orange-600 animate-pulse">
                        {IconCart}
                    </span>
                </div>
                <p className="mt-4 text-xs text-orange-500 font-bold uppercase tracking-wider">Requieren atención</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-teal-100/40 border border-slate-100 hover:scale-[1.03] transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Productos en Catálogo</span>
                        <p className="text-3xl font-black mt-1 text-slate-800">{stats?.total_productos || 0}</p>
                    </div>
                    <span className="p-3.5 rounded-2xl bg-teal-50 text-teal-600">
                        {IconBox}
                    </span>
                </div>
                <p className="mt-4 text-xs text-teal-500 font-bold uppercase tracking-wider">Bienes registrados</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-purple-100/40 border border-slate-100 hover:scale-[1.03] transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Proveedores Activos</span>
                        <p className="text-3xl font-black mt-1 text-slate-800">{stats?.total_proveedores || 0}</p>
                    </div>
                    <span className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
                        {IconTruck}
                    </span>
                </div>
                <p className="mt-4 text-xs text-purple-500 font-bold uppercase tracking-wider">Directorio de contacto</p>
            </div>
        </div>
    );
}
