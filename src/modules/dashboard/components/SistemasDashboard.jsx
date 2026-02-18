import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';

const SistemasDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await dashboardService.getStats('sistemas');
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
        <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const IconComputer = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>;
    const IconDelivery = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;
    const IconTools = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.72-.014a2.547 2.547 0 012.35 1.17l.008.016a2.548 2.548 0 01-2.127 3.824m-1.748-4.259a4.323 4.323 0 01-1.23-1.517" /></svg>;

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <div className="h-10 w-1 rounded-full bg-blue-500"></div>
                <h2 className="text-2xl font-bold text-gray-800">Panel de Tecnología y Sistemas</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Total Equipos" value={stats?.total_equipos || 0} icon={IconComputer} color="blue" description="Inventario total" />
                <DashboardCard title="Disponibles" value={stats?.equipos_disponibles || 0} icon={IconComputer} color="green" description="Listos para asignar" />
                <DashboardCard title="Entregas" value={stats?.total_entregas || 0} icon={IconDelivery} color="cyan" description="Equipos asignados" />
                <DashboardCard title="Mantenimientos" value={stats?.total_mantenimientos || 0} icon={IconTools} color="yellow" description="En reparación/Revisión" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Link to="/pc-equipos" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {IconComputer}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Gestionar Equipos</h3>
                        <p className="mt-2 text-sm text-gray-500">Administra el inventario de hardware, características y estados.</p>
                    </div>
                </Link>

                <Link to="/pc-entregas" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-cyan-50 group-hover:bg-cyan-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-cyan-50 p-3 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                            {IconDelivery}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Entregas y Asignaciones</h3>
                        <p className="mt-2 text-sm text-gray-500">Gestiona las actas de entrega y asignación a funcionarios.</p>
                    </div>
                </Link>

                <Link to="/pc-devueltos" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-red-50 p-3 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Devoluciones</h3>
                        <p className="mt-2 text-sm text-gray-500">Registra y gestiona el retorno de equipos al inventario.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default SistemasDashboard;
