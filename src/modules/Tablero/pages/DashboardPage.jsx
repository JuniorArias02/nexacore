import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import SistemasDashboard from '../components/SistemasDashboard';
import ComprasDashboard from '../components/ComprasDashboard';
import DefaultDashboard from '../components/DefaultDashboard';
import MantenimientoDashboard from '../components/MantenimientoDashboard';
import DashboardSkeleton from '../components/DashboardSkeleton';

const DashboardPage = () => {
    const { user, hasPermission } = useAuth();
    const [view, setView] = useState(null);

    // Permission checks for dashboard access
    const canAdmin = hasPermission('configuracion.dashboard_administrador');
    const canSistemas = hasPermission('configuracion.dashboard_sistemas');
    const canCompras = hasPermission('configuracion.dashboard_compras');
    const canMantenimiento = hasPermission('configuracion.dashboard_mantenimiento');

    // Determine which dashboards the user can see (for tab switching)
    const availableViews = [];
    if (canAdmin) availableViews.push({ key: 'admin', label: 'General' });
    if (canSistemas) availableViews.push({ key: 'sistemas', label: 'Sistemas' });
    if (canCompras) availableViews.push({ key: 'compras', label: 'Compras' });
    if (canMantenimiento) availableViews.push({ key: 'mantenimiento', label: 'Mantenimiento' });
    availableViews.push({ key: 'default', label: 'Bienvenida' });

    useEffect(() => {
        if (!user) return;

        // Set initial view based on permissions (first available)
        if (canAdmin) setView('admin');
        else if (canSistemas) setView('sistemas');
        else if (canCompras) setView('compras');
        else if (canMantenimiento) setView('mantenimiento');
        else setView('default');
    }, [user, canAdmin, canSistemas, canCompras, canMantenimiento]);

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

    // Show tab switcher if user has more than 1 real dashboard (not counting default)
    const showTabs = availableViews.length > 1;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-8 font-sans">
            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 md:p-12 text-white shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                                {user?.rol?.nombre || 'Panel de Control'}
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                                {getGreeting()}, <span className="opacity-90">{user?.nombre_completo?.split(' ')[0]}</span>
                            </h1>
                            <p className="max-w-xl text-sm sm:text-base md:text-lg text-indigo-100 font-medium opacity-90">
                                Bienvenido a tu panel de gestión. Aquí tienes un resumen de la actividad reciente y accesos rápidos.
                            </p>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>
                    </div>

                    {showTabs && (
                        <div className="mt-6 sm:mt-8 relative z-10">
                            <div className="flex sm:inline-flex overflow-x-auto rounded-xl bg-white/10 p-1 backdrop-blur-md border border-white/20 gap-1 max-w-full no-scrollbar">
                                {availableViews.map((v) => (
                                    <button
                                        key={v.key}
                                        onClick={() => setView(v.key)}
                                        className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex-shrink-0 ${view === v.key
                                            ? 'bg-white text-indigo-600 shadow-lg scale-105'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {v.label}
                                    </button>
                                ))}
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
                    {view === 'mantenimiento' && (
                        <div className="space-y-6">
                            <MantenimientoDashboard />
                        </div>
                    )}

                    {view === 'default' && <DefaultDashboard />}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
