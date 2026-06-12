import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';
import { 
    UsersIcon, 
    ComputerDesktopIcon, 
    ShoppingCartIcon, 
    BuildingOfficeIcon, 
    ShieldCheckIcon,
    ChartPieIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

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
        <div className="flex items-center justify-center h-64 animate-fade-in-up">
            <div className="relative flex justify-center items-center">
                <div className="absolute animate-ping h-12 w-12 rounded-full bg-indigo-400 opacity-75"></div>
                <div className="relative h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Premium Hero Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl group mt-6">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        PANEL PRINCIPAL
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Resumen de Administración
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Visualiza los indicadores clave del sistema y accede rápidamente a los módulos de configuración y control maestro de NexaCore.
                    </p>
                </div>
                {/* Icono Decorativo Flotante */}
                <ChartPieIcon className="absolute right-4 md:right-12 bottom-0 h-48 w-48 md:h-72 md:w-72 text-white/5 -mb-10 md:-mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out" />
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard 
                    title="Usuarios" 
                    value={stats?.total_usuarios || 0} 
                    icon={<UsersIcon className="h-7 w-7" />} 
                    color="orange" 
                    description="Usuarios registrados" 
                />
                <DashboardCard 
                    title="Total Equipos" 
                    value={stats?.total_equipos || 0} 
                    icon={<ComputerDesktopIcon className="h-7 w-7" />} 
                    color="blue" 
                    description="En inventario global" 
                />
                <DashboardCard 
                    title="Pedidos" 
                    value={stats?.total_pedidos || 0} 
                    icon={<ShoppingCartIcon className="h-7 w-7" />} 
                    color="indigo" 
                    description="Gestión de compras" 
                />
                <DashboardCard 
                    title="Sedes" 
                    value={stats?.total_sedes || 0} 
                    icon={<BuildingOfficeIcon className="h-7 w-7" />} 
                    color="green" 
                    description="Instalaciones activas" 
                />
            </div>

            {/* Accesos Directos - Premium Module Cards */}
            <div className="mt-12">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-slate-100 p-2 rounded-xl">
                        <ShieldCheckIcon className="h-6 w-6 text-slate-700" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-800">Accesos Rápidos</h2>
                </div>

                <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                    <Link to="/usuarios" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1 border border-orange-50">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 group-hover:scale-150 transition-transform duration-500 ease-in-out opacity-50"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                <UsersIcon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-2">Gestión de Usuarios</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 flex-grow">
                                Administración de cuentas, perfiles y accesos al sistema centralizado.
                            </p>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-orange-600 group-hover:text-orange-700 transition-colors">
                                Acceder al módulo <ArrowRightIcon className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/sedes" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-emerald-100/50 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1 border border-emerald-50">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 group-hover:scale-150 transition-transform duration-500 ease-in-out opacity-50"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                <BuildingOfficeIcon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-2">Administrar Sedes</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 flex-grow">
                                Configuración de ubicaciones, instalaciones y dependencias físicas.
                            </p>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:text-emerald-700 transition-colors">
                                Acceder al módulo <ArrowRightIcon className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/roles" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-1 border border-indigo-50">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 group-hover:scale-150 transition-transform duration-500 ease-in-out opacity-50"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                                <ShieldCheckIcon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-2">Roles y Permisos</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 flex-grow">
                                Configurar niveles de seguridad, jerarquías y políticas de acceso.
                            </p>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:text-indigo-700 transition-colors">
                                Acceder al módulo <ArrowRightIcon className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
