import React from 'react';
import { Link } from 'react-router-dom';
import { IconCart, IconBox, IconTruck } from './ComprasIcons';

export default function ComprasQuickLinks() {
    return (
        <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">Accesos Rápidos del Módulo</h3>
            <div className="grid gap-6 md:grid-cols-3">
                <Link to="/gestion-compras/cp-pedidos" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-indigo-50 group-hover:bg-indigo-100/80 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-indigo-50 p-4 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            {IconCart}
                        </div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Gestionar Pedidos</h3>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">Crear, autorizar, rechazar y dar seguimiento al flujo de pedidos de compras.</p>
                    </div>
                </Link>

                <Link to="/gestion-compras/cp-productos" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-emerald-50 group-hover:bg-emerald-100/80 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-emerald-50 p-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            {IconBox}
                        </div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Catálogo de Productos</h3>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">Administrar e ingresar bienes, suministros y servicios requeridos en la organización.</p>
                    </div>
                </Link>

                <Link to="/gestion-compras/cp-proveedores" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-purple-50 group-hover:bg-purple-100/80 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-purple-50 p-4 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                            {IconTruck}
                        </div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Directorio Proveedores</h3>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">Gestionar datos de contacto, contratos asignados y cotizaciones por proveedor.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
