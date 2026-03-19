import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { entregaActivosFijosService } from '../services/entregaActivosFijosService';
import EntregaActivosFijosHistoryDetails from '../components/EntregaActivosFijosHistoryDetails';
import {
    UserIcon,
    FolderIcon,
    ChevronRightIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

export default function EntregaActivosFijosHistory() {
    const navigate = useNavigate();
    const [coordinadores, setCoordinadores] = useState([]);
    const [selectedCoordinador, setSelectedCoordinador] = useState(null);
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingEntregas, setLoadingEntregas] = useState(false);
    const [exportingId, setExportingId] = useState(null);

    useEffect(() => {
        loadCoordinadores();
    }, []);

    const loadCoordinadores = async () => {
        try {
            setLoading(true);
            const response = await entregaActivosFijosService.getCoordinadores();
            setCoordinadores(response.objeto || []);
        } catch (error) {
            console.error('Error loading coordinators:', error);
            Swal.fire('Error', 'No se pudieron cargar los coordinadores', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCoordinador = async (coordinador) => {
        try {
            setSelectedCoordinador(coordinador);
            setLoadingEntregas(true);
            const response = await entregaActivosFijosService.getByCoordinador(coordinador.id);
            setEntregas(response.objeto || []);
        } catch (error) {
            console.error('Error loading deliveries:', error);
            Swal.fire('Error', 'No se pudieron cargar las actas', 'error');
        } finally {
            setLoadingEntregas(false);
        }
    };

    const handleBack = () => {
        setSelectedCoordinador(null);
        setEntregas([]);
    };

    const handleExportExcel = async (id) => {
        try {
            setExportingId(id);
            await entregaActivosFijosService.exportExcel(id);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        } finally {
            setExportingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        HISTORIAL
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        {selectedCoordinador ? `Actas: ${selectedCoordinador.nombre}` : 'Historial por Coordinador'}
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        {selectedCoordinador
                            ? `Visualizando todas las actas de entrega de activos fijos gestionadas por ${selectedCoordinador.nombre}.`
                            : 'Selecciona un coordinador para visualizar su historial de actas de entrega de activos fijos.'}
                    </p>

                    {selectedCoordinador && (
                        <div className="mt-8">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-white/20 backdrop-blur-md transition-all transform hover:-translate-x-1"
                            >
                                <ArrowLeftIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                                Volver al Directorio
                            </button>
                        </div>
                    )}
                </div>
                {/* Decorative Icon */}
                <FolderIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            {!selectedCoordinador ? (
                /* Directory View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coordinadores.length === 0 ? (
                        <div className="col-span-full bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                            <FolderIcon className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-xl font-bold text-slate-400">No hay coordinadores con actas registradas</p>
                        </div>
                    ) : (
                        coordinadores.map((coord) => (
                            <div
                                key={coord.id}
                                onClick={() => handleSelectCoordinador(coord)}
                                className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FolderIcon className="h-24 w-24 text-indigo-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <UserIcon className="h-7 w-7 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">
                                        {coord.nombre}
                                    </h3>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                        Coordinador
                                    </p>
                                    <div className="mt-6 flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest">
                                        Ver Actas
                                        <ChevronRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <EntregaActivosFijosHistoryDetails 
                    entregas={entregas}
                    loading={loadingEntregas}
                    handleExportExcel={handleExportExcel}
                    exportingId={exportingId}
                />
            )}
        </div>
    );
}
