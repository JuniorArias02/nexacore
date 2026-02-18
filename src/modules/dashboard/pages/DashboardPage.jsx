import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import SistemasDashboard from '../components/SistemasDashboard';
import ComprasDashboard from '../components/ComprasDashboard';
import DefaultDashboard from '../components/DefaultDashboard';
import DashboardSkeleton from '../components/DashboardSkeleton';

const DashboardPage = () => {
    const { user } = useAuth();
    const [view, setView] = useState(null); // Initialize as null to show skeleton


    // Normalize role name for easier comparison
    const roleName = user?.rol?.nombre?.toLowerCase() || '';

    useEffect(() => {
        // Simulate a small delay to ensure the skeleton is seen and transitions smootly (optional, but good for UX if auth is instant)
        // For now, we'll just set it directly but using a timeout 0 helps loop break if needed, 
        // essentially we act when roleName is available.

        if (!user) return; // Wait for user to be loaded

        const determineView = () => {
            if (roleName.includes('administrador web') || roleName.includes('admin')) {
                setView('admin');
            } else if (roleName.includes('sistemas')) {
                setView('sistemas');
            } else if (roleName.includes('compras')) {
                setView('compras');
            } else {
                setView('default');
            }
        };

        determineView();

    }, [roleName, user]);

    const isAdmin = roleName.includes('administrador') || roleName.includes('admin');

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    // Show skeleton while view is being determined
    if (!view) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl md:p-12 text-white">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                                {user?.rol?.nombre || 'Panel de Control'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                {getGreeting()}, <span className="opacity-90">{user?.nombre_completo?.split(' ')[0]}</span>
                            </h1>
                            <p className="max-w-xl text-lg text-indigo-100 font-medium">
                                Bienvenido a tu panel de gestión. Aquí tienes un resumen de la actividad reciente y accesos rápidos.
                            </p>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
                    </div>

                    {isAdmin && (
                        <div className="mt-8 relative z-10">
                            <div className="inline-flex rounded-xl bg-white/10 p-1 backdrop-blur-md border border-white/20">
                                <button
                                    onClick={() => setView('admin')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${view === 'admin'
                                        ? 'bg-white text-indigo-600 shadow-lg scale-105'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    General
                                </button>
                                <button
                                    onClick={() => setView('sistemas')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${view === 'sistemas'
                                        ? 'bg-white text-indigo-600 shadow-lg scale-105'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    Sistemas
                                </button>
                                <button
                                    onClick={() => setView('compras')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${view === 'compras'
                                        ? 'bg-white text-indigo-600 shadow-lg scale-105'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    Compras
                                </button>
                                <button
                                    onClick={() => setView('default')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${view === 'default'
                                        ? 'bg-white text-indigo-600 shadow-lg scale-105'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    Bienvenida
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area with Fade In Animation */}
                <div className="animate-fade-in-up">
                    {view === 'admin' && (
                        <div className="space-y-6">
                            <AdminDashboard />
                        </div>
                    )}
                    {view === 'sistemas' && (
                        <div className="space-y-6">
                            <SistemasDashboard />
                        </div>
                    )}
                    {view === 'compras' && (
                        <div className="space-y-6">
                            <ComprasDashboard />
                        </div>
                    )}

                    {view === 'default' && <DefaultDashboard />}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
