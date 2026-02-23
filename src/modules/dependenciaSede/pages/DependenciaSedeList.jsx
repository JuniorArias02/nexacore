import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dependenciaSedeService } from '../services/dependenciaSedeService';
import Swal from 'sweetalert2';
import { PencilIcon, TrashIcon, PlusIcon, BuildingOfficeIcon, MapPinIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';

export default function DependenciaSedeList() {
    const [mockData, setMockData] = useState([]); // In case API fails or we want to test locally first (optional)
    const [dependencias, setDependencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDependencias();
    }, []);

    const loadDependencias = async () => {
        try {
            setLoading(true);
            const response = await dependenciaSedeService.getAll();
            // API endpoint wrapper handling
            // Standard response: { status: "success", objeto: [...], mensaje: "..." }
            if (response && response.objeto) {
                setDependencias(response.objeto);
            } else if (Array.isArray(response)) {
                setDependencias(response);
            } else {
                setDependencias([]);
            }
        } catch (error) {
            console.error("Error loading dependencias:", error);
            Swal.fire('Error', 'No se pudieron cargar las dependencias', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await dependenciaSedeService.delete(id);
                setDependencias(prev => prev.filter(item => item.id !== id));
                Swal.fire('Eliminado', 'La dependencia ha sido eliminada.', 'success');
            } catch (error) {
                console.error("Error deleting:", error);
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
            }
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">

            {/* Hero Section - Nexa Purple Theme (Matching CpPedidoList) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/30 mb-2 backdrop-blur-sm">
                        ESTRUCTURA ORGANIZACIONAL
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                        Sedes y Dependencias
                    </h1>
                    <p className="text-indigo-50 max-w-2xl text-lg">
                        Administra las sedes físicas y las dependencias administrativas de la organización para una gestión centralizada.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/dependencias-sedes/nuevo"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:-translate-y-1"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                            Nueva Dependencia
                        </Link>
                    </div>
                </div>
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Table Content */}
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-900/5 transition-all">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nombre Dependencia</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sede Principal</th>
                                <th scope="col" className="relative px-6 py-5">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center">
                                        <div className="flex justify-center flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                            <span className="text-xs font-bold text-slate-400">Cargando dependencias...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : dependencias.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                                                <Square3Stack3DIcon className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-500 text-sm font-bold tracking-tight">No se encontraron dependencias</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                dependencias.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 tracking-tight">
                                                #{item.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                    <Square3Stack3DIcon className="h-5 w-5" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                    {item.nombre}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <BuildingOfficeIcon className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    {item.sede ? item.sede.nombre : `ID: ${item.sede_id}`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/dependencias-sedes/editar/${item.id}`}
                                                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all shadow-sm bg-white ring-1 ring-slate-100"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-xl text-red-600 hover:bg-red-100 transition-all shadow-sm bg-white ring-1 ring-slate-100"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Footer Brand */}
                <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
                        Ecosistema NEXA &copy; {new Date().getFullYear()} - Infraestructura de Sedes
                    </p>
                </div>
            </div>
        </div>
    );
}
