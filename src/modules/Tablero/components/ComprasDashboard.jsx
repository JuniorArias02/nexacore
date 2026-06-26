import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';

import ComprasHero from './widgets/ComprasHero';
import ComprasMetrics from './widgets/ComprasMetrics';
import ComprasAverageTimes from './widgets/ComprasAverageTimes';
import ComprasComparativeAnalysis from './widgets/ComprasComparativeAnalysis';
import ComprasRequestTypes from './widgets/ComprasRequestTypes';
import ComprasBreakdowns from './widgets/ComprasBreakdowns';
import ComprasQuickLinks from './widgets/ComprasQuickLinks';

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
        <div className="flex items-center justify-center h-64">
            <div className="relative flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <div className="absolute animate-ping rounded-full h-8 w-8 border border-indigo-200"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            <ComprasHero />
            <ComprasMetrics stats={stats} />
            <ComprasAverageTimes timeStats={stats?.estadisticas_tiempo} />
            <ComprasComparativeAnalysis timeStats={stats?.estadisticas_tiempo} />
            <ComprasRequestTypes tipos={stats?.desglose_solicitudes?.tipos} />
            <ComprasBreakdowns stats={stats} />
            <ComprasQuickLinks />
        </div>
    );
};

export default ComprasDashboard;
