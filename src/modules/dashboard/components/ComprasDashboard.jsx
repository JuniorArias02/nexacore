import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';

const ComprasDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
    );

    const IconCart = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;
    const IconBox = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
    const IconTruck = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <div className="h-10 w-1 rounded-full bg-orange-500"></div>
                <h2 className="text-2xl font-bold text-gray-800">Panel de Compras y Suministros</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Pedidos Totales" value={stats?.total_pedidos || 0} icon={IconCart} color="indigo" description="Histórico de solicitudes" />
                <DashboardCard title="Pendientes" value={stats?.pedidos_pendientes || 0} icon={IconCart} color="orange" description="Requieren atención" />
                <DashboardCard title="Productos" value={stats?.total_productos || 0} icon={IconBox} color="teal" description="En catálogo" />
                <DashboardCard title="Proveedores" value={stats?.total_proveedores || 0} icon={IconTruck} color="purple" description="Registrados" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Link to="/cp-pedidos" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {IconCart}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Gestionar Pedidos</h3>
                        <p className="mt-2 text-sm text-gray-500">Crear, aprobar y dar seguimiento a las órdenes de compra.</p>
                    </div>
                </Link>
                <Link to="/cp-productos" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-orange-50 p-3 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            {IconBox}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Catálogo de Productos</h3>
                        <p className="mt-2 text-sm text-gray-500">Administrar el listado de bienes y servicios disponibles.</p>
                    </div>
                </Link>
                <Link to="/cp-proveedores" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-50 p-3 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            {IconTruck}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Directorio Proveedores</h3>
                        <p className="mt-2 text-sm text-gray-500">Gestión de proveedores y contratos.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ComprasDashboard;
