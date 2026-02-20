import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { mantenimientoService } from '../../mantenimiento/services/mantenimientoService';
import { agendaMantenimientoService } from '../../agendaMantenimiento/services/agendaMantenimientoService';
import DashboardCard from './DashboardCard';

const MantenimientoDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        misMantenimientos: 0,
        revisados: 0,
        pendientes: 0,
        totalAgendas: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [mantRes, agendaRes] = await Promise.all([
                    mantenimientoService.getAll(),
                    agendaMantenimientoService.getAll(),
                ]);

                const mantenimientos = mantRes?.objeto ?? (Array.isArray(mantRes) ? mantRes : []);
                const agendas = agendaRes?.objeto ?? (Array.isArray(agendaRes) ? agendaRes : []);

                const misMantenimientos = mantenimientos.filter(
                    (m) => m.creado_por === user?.id
                );

                setStats({
                    total: mantenimientos.length,
                    misMantenimientos: misMantenimientos.length,
                    revisados: mantenimientos.filter((m) => m.esta_revisado).length,
                    pendientes: mantenimientos.filter((m) => !m.esta_revisado).length,
                    totalAgendas: agendas.length,
                });
            } catch (error) {
                console.error('Failed to load mantenimiento stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [user?.id]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );

    // Icons
    const IconWrench = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.72-.014a2.547 2.547 0 012.35 1.17l.008.016a2.548 2.548 0 01-2.127 3.824m-1.748-4.259a4.323 4.323 0 01-1.23-1.517" />
        </svg>
    );
    const IconCheck = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
    const IconClock = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
    const IconCalendar = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    );
    const IconPlus = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
    const IconList = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center space-x-4">
                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500"></div>
                <h2 className="text-2xl font-bold text-gray-800">Panel de Mantenimiento</h2>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Mis Mantenimientos"
                    value={stats.misMantenimientos}
                    icon={IconWrench}
                    color="blue"
                    description="Creados por ti"
                />
                <DashboardCard
                    title="Total General"
                    value={stats.total}
                    icon={IconWrench}
                    color="cyan"
                    description="Todos los registros"
                />
                <DashboardCard
                    title="Revisados"
                    value={stats.revisados}
                    icon={IconCheck}
                    color="green"
                    description="Marcados como revisados"
                />
                <DashboardCard
                    title="Pendientes"
                    value={stats.pendientes}
                    icon={IconClock}
                    color="yellow"
                    description="Sin revisar aún"
                />
            </div>

            {/* Action Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Link
                    to="/mantenimientos/nuevo"
                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {IconPlus}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Crear Mantenimiento</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Registra un nuevo mantenimiento preventivo o correctivo.
                        </p>
                    </div>
                </Link>

                <Link
                    to="/mantenimientos"
                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-cyan-50 group-hover:bg-cyan-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-cyan-50 p-3 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                            {IconList}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Ver Mantenimientos</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Consulta, edita o revisa los mantenimientos registrados.
                        </p>
                    </div>
                </Link>

                <Link
                    to="/mis-mantenimientos"
                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-50 p-3 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            {IconCheck}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Mis Mantenimientos</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Revisa y marca como revisados los que te asignaron.
                        </p>
                    </div>
                </Link>

                <Link
                    to="/agenda-mantenimientos"
                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-50 p-3 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            {IconCalendar}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Agenda</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Programa y gestiona las fechas de los mantenimientos.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default MantenimientoDashboard;
