import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcMantenimientoService from '../services/pcMantenimientoService';
import {
    WrenchScrewdriverIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    ComputerDesktopIcon,
    InformationCircleIcon,
    CheckBadgeIcon,
    ClockIcon,
    ArrowPathIcon,
    PencilSquareIcon,
    TrashIcon,
    BuildingOfficeIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function PcMantenimientoList() {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        loadMantenimientos();
    }, []);

    const loadMantenimientos = async () => {
        try {
            setLoading(true);
            const data = await pcMantenimientoService.getAll();
            setMantenimientos(data || []);
        } catch (error) {
            console.error('Error loading mantenimientos:', error);
            Swal.fire('Error', 'No se pudieron cargar los mantenimientos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar registro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#indigo-600',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        });

        if (result.isConfirmed) {
            try {
                await pcMantenimientoService.delete(id);
                setMantenimientos(prev => prev.filter(item => item.id !== id));
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El mantenimiento ha sido eliminado correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } catch (error) {
                console.error('Error deleting:', error);
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
            }
        }
    };

    const filteredItems = mantenimientos.filter(item => {
        const matchesSearch = 
            item.equipo?.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.equipo?.marca?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterType === 'all' || item.tipo_mantenimiento === filterType;
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        INFRAESTRUCTURA TÉCNICA
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Mantenimientos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Hardware</span>
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Historial completo de intervenciones técnicas, reparaciones y preventivos realizados a la flota de cómputo.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            to="/pc-mantenimientos/nuevo"
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5 stroke-[3]" />
                            Registrar Mantenimiento
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-[100px] group-hover:bg-blue-400/30 transition-colors duration-700"></div>
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-[100px] group-hover:bg-indigo-400/30 transition-colors duration-700"></div>
                <WrenchScrewdriverIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
            </div>

            {/* Filters & search */}
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 mb-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="relative w-full lg:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                        placeholder="Buscar por serial, marca o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilterType('preventivo')}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === 'preventivo' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Preventivo
                        </button>
                        <button
                            onClick={() => setFilterType('correctivo')}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === 'correctivo' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Correctivo
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50 transition-all">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equipo / Activo</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha e Intervención</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable Externo</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-24">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                                                <ArrowPathIcon className="absolute inset-0 m-auto h-6 w-6 text-indigo-600 animate-pulse" />
                                            </div>
                                            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Analizando Sincronización...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="bg-slate-50 rounded-3xl p-8 mb-4 border border-dashed border-slate-300">
                                                <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-slate-300" />
                                            </div>
                                            <h3 className="text-slate-800 font-black uppercase tracking-tight">Sin Historial</h3>
                                            <p className="text-slate-400 text-sm font-medium mt-1">No se encontraron registros de mantenimiento con los criterios actuales.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    <ComputerDesktopIcon className="h-6 w-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
                                                        {item.equipo?.serial || '---'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                                                        <TagIcon className="h-3 w-3" />
                                                        {item.equipo ? `${item.equipo.marca} ${item.equipo.modelo}` : 'EQUIPO SIN IDENTIFICAR'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-600">
                                                        {item.fecha ? new Date(item.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha pendiente'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100/50 rounded-lg px-2 py-1 w-fit group-active:bg-indigo-100 transition-colors">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${item.tipo_mantenimiento === 'preventivo' ? 'bg-teal-500' : 'bg-orange-500'}`}></span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.tipo_mantenimiento}</span>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500 line-clamp-1 max-w-[250px]">
                                                    {item.descripcion || 'Sin descripción detallada'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <BuildingOfficeIcon className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-700 uppercase leading-none mb-1">
                                                        {item.empresa_responsable?.nombre || 'Interno / Propio'}
                                                    </span>
                                                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">
                                                        Responsable: {item.responsable_mantenimiento || 'DEPARTAMENTO SISTEMAS'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.estado === 'completado'
                                                ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm shadow-green-100'
                                                : 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm shadow-amber-100'
                                                }`}>
                                                {item.estado === 'completado' ? (
                                                    <CheckBadgeIcon className="h-3 w-3 mr-1.5" />
                                                ) : (
                                                    <ClockIcon className="h-3 w-3 mr-1.5 animate-pulse" />
                                                )}
                                                {item.estado || 'Procesando'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2.5">
                                                <Link
                                                    to={`/pc-mantenimientos/editar/${item.id}`}
                                                    className="p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-indigo-600 hover:-translate-y-0.5"
                                                    title="Editar registro"
                                                >
                                                    <PencilSquareIcon className="h-4.5 w-4.5 stroke-[2]" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2.5 bg-slate-50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-red-600 hover:-translate-y-0.5"
                                                    title="Eliminar registro"
                                                >
                                                    <TrashIcon className="h-4.5 w-4.5 stroke-[2]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / Footer Info */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-3 text-slate-400">
                    <InformationCircleIcon className="h-5 w-5 text-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Mostrando {filteredItems.length} de {mantenimientos.length} registros totales
                    </span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    NexaCore Systems &copy; 2026 | Hardware Compliance Mngt
                </p>
            </div>
        </div>
    );
} 