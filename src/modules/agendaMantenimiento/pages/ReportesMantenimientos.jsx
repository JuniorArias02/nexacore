import React, { useState, useEffect } from 'react';
import {
    ChartBarIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    CheckBadgeIcon,
    ClockIcon,
    CalendarDaysIcon,
    ArrowPathIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { mantenimientoService } from '../../mantenimiento/services/mantenimientoService';
import ReportStatCard from '../components/ReportStatCard';

export default function ReportesMantenimientos() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching statistics...");
            const data = await mantenimientoService.getStatistics();
            console.log("Statistics received:", data);
            setStats(data);
        } catch (error) {
            console.error("Error loading stats:", error);
            setError(error.message || "Error desconocido al cargar estadísticas");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <ArrowPathIcon className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Cargando estadísticas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] text-center space-y-4">
                <div className="inline-flex p-4 bg-rose-100 text-rose-600 rounded-2xl">
                    <WrenchScrewdriverIcon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-rose-900">¡Ups! Algo salió mal</h2>
                <p className="text-rose-700 max-w-md mx-auto">{error}</p>
                <button
                    onClick={loadStats}
                    className="px-8 py-3 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                >
                    REINTENTAR
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl group">
                <div className="relative z-10 text-center md:text-left">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        Analítica & Reportes
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Dashboard de Mantenimientos
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90 mx-auto md:mx-0">
                        Visualiza el rendimiento, carga de trabajo y estadísticas clave del sistema en tiempo real.
                    </p>
                </div>
                <ChartBarIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReportStatCard
                    title="Total Mantenimientos"
                    value={stats?.summary?.total_mantenimientos || 0}
                    icon={ChartBarIcon}
                    color="indigo"
                />
                <ReportStatCard
                    title="Pendientes por Revisar"
                    value={stats?.summary?.total_pendientes || 0}
                    icon={ClockIcon}
                    color="amber"
                />
                <ReportStatCard
                    title="Agendamientos Realizados"
                    value={stats?.summary?.total_agendados || 0}
                    icon={CalendarDaysIcon}
                    color="emerald"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Top Creators */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-violet-100 text-violet-600 rounded-2xl">
                            <UserGroupIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Top Creadores</h2>
                    </div>
                    <div className="space-y-6">
                        {stats?.top_creators?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <span className="font-bold text-slate-700">{item.creador?.nombre_completo}</span>
                                </div>
                                <span className="text-sm font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                    {item.total} registros
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* By Sede */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl">
                            <BuildingOfficeIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Distribución por Sede</h2>
                    </div>
                    <div className="space-y-6">
                        {stats?.by_sede?.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-extrabold text-slate-600 uppercase tracking-wider">{item.sede?.nombre}</span>
                                    <span className="font-black text-indigo-600">{item.total}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${stats?.summary?.total_mantenimientos > 0 ? (item.total / stats.summary.total_mantenimientos) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review Status */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
                            <CheckBadgeIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Estado de Revisión</h2>
                    </div>
                    <div className="flex justify-around items-center py-6">
                        {stats?.review_status?.map((item, idx) => (
                            <div key={idx} className="text-center group">
                                <div className={`text-4xl font-black mb-2 tracking-tighter transition-transform group-hover:scale-110 ${item.value ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {item.total}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technician Load */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
                            <ArrowPathIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Carga de Trabajo Técnica</h2>
                    </div>
                    <div className="space-y-4">
                        {stats?.technician_workload?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl hover:bg-indigo-50 transition-colors cursor-default">
                                <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600">
                                    {item.total}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-700">{item.tecnico?.nombre_completo}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Trabajos Agendados</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                        <CalendarDaysIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tendencia Mensual</h2>
                        <p className="text-slate-400 font-medium">Histórico de mantenimientos creados por mes</p>
                    </div>
                </div>

                <div className="relative h-64 w-full flex items-end gap-2 md:gap-4 px-2">
                    {stats?.monthly_trends?.length > 0 ? stats.monthly_trends.map((item, idx) => {
                        const maxTotal = Math.max(...stats.monthly_trends.map(t => t.total));
                        const heightPercent = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full flex items-end justify-center h-48">
                                    <div
                                        className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-blue-400 rounded-t-xl transition-all duration-1000 group-hover:from-indigo-500 group-hover:to-blue-300 relative"
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black py-1 px-2 rounded-lg">
                                            {item.total}
                                        </div>
                                    </div>
                                </div>
                                <span className="mt-4 text-[10px] font-black uppercase tracking-tighter text-slate-400 rotate-45 md:rotate-0">
                                    {item.mes}
                                </span>
                            </div>
                        );
                    }) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 font-medium italic">
                            No hay datos históricos suficientes para mostrar tendencias.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}