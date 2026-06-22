import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cpPedidoService } from '../services/cpPedidoService';
import { 
    ChartBarIcon, 
    ArrowLeftIcon,
    ClockIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon,
    UserCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function CpPedidoEstadisticasPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [estadisticas, setEstadisticas] = useState(null);

    useEffect(() => {
        loadEstadisticas();
    }, [id]);

    const loadEstadisticas = async () => {
        try {
            setLoading(true);
            const response = await cpPedidoService.getEstadisticas(id);
            
            // The backend returns { mensaje, objeto: { estadisticas: {...} }, status }
            if (response.objeto && response.objeto.estadisticas) {
                setEstadisticas(response.objeto.estadisticas);
            } else if (response.success && response.data) {
                // Fallback to docs structure
                setEstadisticas(response.data.estadisticas);
            } else {
                throw new Error("Formato de respuesta inesperado");
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            const errorMessage = error.response?.data?.message || 'No se pudieron cargar las estadísticas del pedido';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
            navigate('/gestion-compras/cp-pedidos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen animate-fade-in">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <span className="mt-4 text-gray-500 font-medium tracking-widest text-sm uppercase">Cargando Estadísticas...</span>
                </div>
            </div>
        );
    }

    if (!estadisticas) {
        return null; // Will redirect or show error in catch block
    }

    const { reglas_cumplimiento, responsable_aprobacion } = estadisticas;
    const esSlaCumplido = reglas_cumplimiento?.cumple_sla;

    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            
            {/* Botón Volver */}
            <button
                onClick={() => navigate('/gestion-compras/cp-pedidos')}
                className="mb-6 group flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <div className="mr-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-900/5 group-hover:ring-indigo-600/20 transition-all">
                    <ArrowLeftIcon className="h-4 w-4" />
                </div>
                Volver a Pedidos
            </button>

            {/* Hero Header - Nexa Premium Style */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        ESTADÍSTICAS Y SLA
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Métricas del Pedido #{id}
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Análisis de tiempos de respuesta, responsables y cumplimiento de Acuerdos de Nivel de Servicio (SLA) para esta solicitud.
                    </p>
                </div>
                <ChartBarIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Tiempos de Aprobación Card */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden group/item transition-all hover:shadow-[0_20px_60px_-10px_rgba(79,70,229,0.15)] hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/item:opacity-20 transition-opacity">
                        <ClockIcon className="w-16 h-16 text-indigo-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Tiempo de Aprobación</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                            {estadisticas.tiempo_aprobacion_horas}
                        </span>
                        <span className="text-lg font-medium text-gray-500 mb-1">hrs</span>
                    </div>
                    <p className="text-sm font-medium text-indigo-600 bg-indigo-50 inline-flex px-3 py-1 rounded-full">
                        {estadisticas.tiempo_aprobacion_formato}
                    </p>
                </div>

                {/* SLA Cumplimiento Card */}
                <div className={`rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden group/item transition-all hover:-translate-y-1 hover:shadow-lg ${esSlaCumplido ? 'bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-green-500/20' : 'bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-red-500/20'}`}>
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                        {esSlaCumplido ? <CheckBadgeIcon className="w-16 h-16 text-green-600" /> : <ExclamationTriangleIcon className="w-16 h-16 text-red-600" />}
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Cumplimiento SLA</h3>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-3xl font-extrabold tracking-tight ${esSlaCumplido ? 'text-green-700' : 'text-red-700'}`}>
                            {esSlaCumplido ? 'CUMPLE' : 'NO CUMPLE'}
                        </span>
                    </div>
                    <p className={`text-sm font-medium inline-flex px-3 py-1 rounded-full ${esSlaCumplido ? 'text-green-800 bg-green-200/50' : 'text-red-800 bg-red-200/50'}`}>
                        Máx. Permitido: {reglas_cumplimiento?.tiempo_maximo_permitido || 'N/A'}
                    </p>
                </div>

                {/* Responsable Card */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden group/item transition-all hover:shadow-[0_20px_60px_-10px_rgba(79,70,229,0.15)] hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/item:opacity-20 transition-opacity">
                        <UserCircleIcon className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Responsable de Aprobación</h3>
                    <div className="flex flex-col justify-center h-[calc(100%-2rem)]">
                        <span className="text-xl font-bold text-gray-900 mb-1 truncate" title={responsable_aprobacion?.nombre || 'N/A'}>
                            {responsable_aprobacion?.nombre || 'Pendiente'}
                        </span>
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 self-start px-3 py-1 rounded-full">
                            {responsable_aprobacion?.rol || 'N/A'}
                        </span>
                    </div>
                </div>

            </div>

            {/* Detalles de Cumplimiento */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 mb-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-indigo-50 rounded-2xl text-indigo-600">
                        <InformationCircleIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900">Detalles de la Solicitud y SLA</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Información del Pedido */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Categoría</p>
                            <p className="text-base font-semibold text-gray-900">{reglas_cumplimiento?.categoria || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Tipo de Solicitud</p>
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                                {reglas_cumplimiento?.tipo_solicitud || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Tiempo Estimado de Entrega</p>
                            <p className="text-base font-semibold text-gray-900">{estadisticas?.tiempo_estimado_entrega_items || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Checkmarks de Cumplimiento */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-sm font-semibold text-gray-700">Aprobado a tiempo</span>
                            {reglas_cumplimiento?.aprobado_a_tiempo ? (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                    <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                                </span>
                            ) : (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                                    <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-sm font-semibold text-gray-700">Entregado a tiempo</span>
                            {reglas_cumplimiento?.entregado_a_tiempo ? (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                    <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                                </span>
                            ) : (
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                                    <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                                </span>
                            )}
                        </div>

                        {!reglas_cumplimiento?.entregado_a_tiempo && reglas_cumplimiento?.dias_retraso > 0 && (
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-100">
                                <span className="text-sm font-semibold text-rose-700">Días de retraso</span>
                                <span className="text-lg font-black text-rose-700">{reglas_cumplimiento.dias_retraso}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
