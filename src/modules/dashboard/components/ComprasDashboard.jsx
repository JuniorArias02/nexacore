import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { Link } from 'react-router-dom';

const DonutChart = ({ data }) => {
    const { menos_24h, entre_1_y_3_dias, mas_3_dias, total_aprobados, porcentaje_menos_24h, porcentaje_1_3_dias, porcentaje_mas_3_dias } = data || {};
    
    if (!total_aprobados) {
        return (
            <div className="flex flex-col items-center justify-center h-56 text-slate-400 text-center">
                <svg className="w-10 h-10 mb-2 opacity-40 text-slate-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sin datos de aprobaciones</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">Los tiempos se calcularán cuando existan pedidos aprobados.</p>
            </div>
        );
    }

    const r = 38;
    const circ = 2 * Math.PI * r; // ~238.76
    
    const p1 = (porcentaje_menos_24h || 0) / 100;
    const p2 = (porcentaje_1_3_dias || 0) / 100;
    const p3 = (porcentaje_mas_3_dias || 0) / 100;

    const stroke1 = p1 * circ;
    const stroke2 = p2 * circ;
    const stroke3 = p3 * circ;

    const offset1 = 0;
    const offset2 = -stroke1;
    const offset3 = -(stroke1 + stroke2);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                    {p1 > 0 && (
                        <circle
                            cx="50" cy="50" r={r} fill="transparent"
                            stroke="#10b981" strokeWidth="10"
                            strokeDasharray={`${stroke1} ${circ}`}
                            strokeDashoffset={offset1}
                            strokeLinecap="round"
                            className="transition-all duration-500 hover:stroke-[12px] cursor-pointer"
                        />
                    )}
                    {p2 > 0 && (
                        <circle
                            cx="50" cy="50" r={r} fill="transparent"
                            stroke="#f59e0b" strokeWidth="10"
                            strokeDasharray={`${stroke2} ${circ}`}
                            strokeDashoffset={offset2}
                            strokeLinecap="round"
                            className="transition-all duration-500 hover:stroke-[12px] cursor-pointer"
                        />
                    )}
                    {p3 > 0 && (
                        <circle
                            cx="50" cy="50" r={r} fill="transparent"
                            stroke="#6366f1" strokeWidth="10"
                            strokeDasharray={`${stroke3} ${circ}`}
                            strokeDashoffset={offset3}
                            strokeLinecap="round"
                            className="transition-all duration-500 hover:stroke-[12px] cursor-pointer"
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-800 tracking-tight">{total_aprobados}</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Aprobados</span>
                </div>
            </div>

            <div className="space-y-2 flex-1 w-full max-w-[220px]">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-100"></span>
                        <span className="text-xs font-bold text-slate-600">&lt; 24 Horas</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">{porcentaje_menos_24h}% ({menos_24h})</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-100"></span>
                        <span className="text-xs font-bold text-slate-600">1 - 3 Días</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg">{porcentaje_1_3_dias}% ({entre_1_y_3_dias})</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-100"></span>
                        <span className="text-xs font-bold text-slate-600">&gt; 3 Días</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg">{porcentaje_mas_3_dias}% ({mas_3_dias})</span>
                </div>
            </div>
        </div>
    );
};

const ComprasDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('fastest');

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await dashboardService.getStats('compras');
                setStats(data.objeto || data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="relative flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <div className="absolute animate-ping rounded-full h-8 w-8 border border-indigo-200"></div>
            </div>
        </div>
    );

    const IconCart = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;
    const IconBox = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
    const IconTruck = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;

    const timeStats = stats?.estadisticas_tiempo || {};

    const renderTable = (pedidos, type) => {
        if (!pedidos || pedidos.length === 0) {
            return (
                <div className="text-center py-10 text-slate-400 font-medium">
                    No hay suficientes pedidos aprobados para este listado.
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pedido</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Solicitante</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sede</th>
                            <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tiempo total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {pedidos.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-slate-800 text-sm">#{p.consecutivo}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-sm font-semibold text-slate-600">{p.elaborado_por}</td>
                                <td className="px-4 py-3.5 text-sm text-slate-500 font-medium">{p.sede}</td>
                                <td className="px-4 py-3.5 text-right">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-none ${
                                        type === 'fastest' 
                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10' 
                                            : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10'
                                    }`}>
                                        {type === 'fastest' ? '⚡ ' : '🕒 '}
                                        {p.duracion}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Hero Header */}
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

            {/* Metrics cards (Ultra-Premium Redesign) */}
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

            {/* Responses and Turnaround Averages */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Average Times Card */}
                <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Desempeño Operativo</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Tiempos Promedio de Gestión</h3>

                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all duration-300 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:rotate-6 transition-transform">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aprobación de Compras</p>
                                    <p className="text-sm text-slate-500 font-medium">De creación a aprobación de compras</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-slate-800 font-mono bg-white px-3 py-1 rounded-xl shadow-sm ring-1 ring-slate-100">{timeStats.tiempo_promedio_compras || 'N/A'}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all duration-300 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:rotate-6 transition-transform">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aprobación de Responsable</p>
                                    <p className="text-sm text-slate-500 font-medium">De compras a visto bueno final</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-slate-800 font-mono bg-white px-3 py-1 rounded-xl shadow-sm ring-1 ring-slate-100">{timeStats.tiempo_promedio_gerencia || 'N/A'}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all duration-300 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:rotate-6 transition-transform">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo Promedio Total</p>
                                    <p className="text-sm text-slate-500 font-medium">Ciclo completo de vida del pedido</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-slate-800 font-mono bg-white px-3 py-1 rounded-xl shadow-sm ring-1 ring-slate-100">{timeStats.tiempo_promedio_total || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Distribution Chart Card */}
                <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Eficiencia en Tiempos</span>
                        <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Distribución de Ciclo de Entrega</h3>
                    </div>
                    <DonutChart data={timeStats.distribucion_tiempos} />
                </div>
            </div>

            {/* Comparative analysis (Fastest vs Slowest) */}
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Análisis Comparativo</span>
                        <h3 className="text-xl font-black text-slate-800 mt-1">Extremos de Gestión Operativa</h3>
                    </div>

                    <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/50">
                        <button
                            onClick={() => setActiveTab('fastest')}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                activeTab === 'fastest'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            ⚡ Mayor Eficiencia
                        </button>
                        <button
                            onClick={() => setActiveTab('slowest')}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                activeTab === 'slowest'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            🕒 Mayor Demora
                        </button>
                    </div>
                </div>

                {activeTab === 'fastest' ? (
                    <div>
                        <p className="text-sm text-slate-500 mb-4 font-medium">Pedidos aprobados y tramitados en el menor tiempo histórico.</p>
                        {renderTable(timeStats.pedidos_mas_rapidos, 'fastest')}
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-slate-500 mb-4 font-medium">Pedidos aprobados que han presentado mayores tiempos de trámite acumulado.</p>
                        {renderTable(timeStats.pedidos_mas_lentos, 'slowest')}
                    </div>
                )}
            </div>

            {/* Request Type Breakdown */}
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl shadow-slate-100 border border-slate-100/80">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Desglose de Pedidos</span>
                <h3 className="text-xl font-black text-slate-800 mt-1 mb-6">Distribución por Tipo de Solicitud</h3>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stats?.desglose_solicitudes?.tipos?.map((tipo, idx) => {
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

            {/* Quick Links Section */}
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">Accesos Rápidos del Módulo</h3>
                <div className="grid gap-6 md:grid-cols-3">
                    <Link to="/cp-pedidos" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-indigo-50 group-hover:bg-indigo-100/80 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-indigo-50 p-4 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                {IconCart}
                            </div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Gestionar Pedidos</h3>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">Crear, autorizar, rechazar y dar seguimiento al flujo de pedidos de compras.</p>
                        </div>
                    </Link>

                    <Link to="/cp-productos" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-emerald-50 group-hover:bg-emerald-100/80 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-emerald-50 p-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                {IconBox}
                            </div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Catálogo de Productos</h3>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">Administrar e ingresar bienes, suministros y servicios requeridos en la organización.</p>
                        </div>
                    </Link>

                    <Link to="/cp-proveedores" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:scale-[1.02]">
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
        </div>
    );
};

export default ComprasDashboard;
