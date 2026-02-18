import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await dashboardService.getStats('admin');
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    const IconUser = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
    const IconBuilding = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>;
    const IconKey = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <div className="h-10 w-1 rounded-full bg-purple-500"></div>
                <h2 className="text-2xl font-bold text-gray-800">Panel General de Administración</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Usuarios" value={stats?.total_usuarios || 0} icon={IconUser} color="orange" description="Usuarios activos" />
                <DashboardCard title="Total Equipos" value={stats?.total_equipos || 0} icon={IconUser} color="blue" description="En inventario global" />
                <DashboardCard title="Pedidos" value={stats?.total_pedidos || 0} icon={IconUser} color="indigo" description="Gestión de compras" />
                <DashboardCard title="Sedes" value={stats?.total_sedes || 0} icon={IconBuilding} color="green" description="Operativas" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Link to="/usuarios" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-orange-50 p-3 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            {IconUser}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Gestión de Usuarios</h3>
                        <p className="mt-2 text-sm text-gray-500">Administración de cuentas, perfiles y accesos al sistema.</p>
                    </div>
                </Link>
                <Link to="/sedes" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-50 p-3 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            {IconBuilding}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Administrar Sedes</h3>
                        <p className="mt-2 text-sm text-gray-500">Configuración de ubicaciones y dependencias físicas.</p>
                    </div>
                </Link>
                <Link to="/roles" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-emerald-50 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            {IconKey}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Roles y Permisos</h3>
                        <p className="mt-2 text-sm text-gray-500">Configurar seguridad, roles y niveles de acceso.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
