import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { mantenimientoService } from '../services/mantenimientoService';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckCircleIcon,
    WrenchScrewdriverIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 15;

export default function MantenimientoList() {
    const { user } = useAuth();
    const [mantenimientos, setMantenimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sedeFilter, setSedeFilter] = useState('');
    const [sedes, setSedes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadMantenimientos();
        loadSedes();
    }, []);

    const loadSedes = async () => {
        try {
            const res = await api.get('/sedes');
            setSedes(res.data?.objeto ?? []);
        } catch (e) {
            console.error('Error loading sedes:', e);
        }
    };

    const loadMantenimientos = async () => {
        try {
            setLoading(true);
            const response = await mantenimientoService.getAll();
            const data = response?.objeto ?? (Array.isArray(response) ? response : []);
            // Only show mantenimientos created by the logged-in user
            const mine = data.filter((m) => m.creado_por === user?.id);
            // Sort descending by id (most recent first)
            mine.sort((a, b) => b.id - a.id);
            setMantenimientos(mine);
        } catch (error) {
            console.error('Error loading mantenimientos:', error);
            Swal.fire('Error', 'No se pudieron cargar los mantenimientos', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filtered data
    const filtered = useMemo(() => {
        let result = mantenimientos;

        // Search filter
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (m) =>
                    m.titulo?.toLowerCase().includes(q) ||
                    m.codigo?.toLowerCase().includes(q) ||
                    m.dependencia?.toLowerCase().includes(q) ||
                    m.receptor?.nombre_completo?.toLowerCase().includes(q)
            );
        }

        // Sede filter
        if (sedeFilter) {
            result = result.filter((m) => String(m.sede_id) === String(sedeFilter));
        }

        return result;
    }, [mantenimientos, search, sedeFilter]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, sedeFilter]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await mantenimientoService.delete(id);
                setMantenimientos((prev) => prev.filter((item) => item.id !== id));
                Swal.fire('Eliminado', 'El mantenimiento ha sido eliminado.', 'success');
            } catch (error) {
                console.error('Error deleting:', error);
                const errorMessage = error.response?.data?.mensaje || 'No se pudo eliminar el registro';
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8 md:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-4">
                        <WrenchScrewdriverIcon className="h-4 w-4" />
                        MANTENIMIENTO
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Gestión de Mantenimientos
                    </h1>
                    <p className="mt-2 text-white/80 max-w-2xl">
                        Administra todos los mantenimientos registrados, revisa su estado y agenda las actividades necesarias.
                    </p>
                </div>
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar título, código, dependencia..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                    />
                </div>

                {/* Sede Filter */}
                <div className="relative max-w-[220px] w-full">
                    <FunnelIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        value={sedeFilter}
                        onChange={(e) => setSedeFilter(e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-8 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition appearance-none bg-white"
                    >
                        <option value="">Todas las sedes</option>
                        {sedes.map((s) => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Counter */}
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
                </span>

                {/* New button */}
                <Link
                    to="/mantenimientos/nuevo"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-600 transition sm:ml-auto"
                >
                    <PlusIcon className="h-4 w-4" />
                    Nuevo
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th className="py-3.5 pl-5 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Título</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Sede</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Receptor</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                                <th className="py-3.5 pl-3 pr-5 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                            <span className="text-sm text-gray-500">Cargando mantenimientos...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-16">
                                        <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-300" />
                                        <p className="mt-3 text-sm font-medium text-gray-500">No hay mantenimientos registrados</p>
                                        <p className="text-xs text-gray-400 mt-1">Crea uno nuevo con el botón de arriba</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="whitespace-nowrap py-3.5 pl-5 pr-3 text-sm font-medium text-gray-900">
                                            {item.id}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-800 font-medium max-w-[200px] truncate">
                                            {item.titulo}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-500">
                                            {item.codigo ? (
                                                <span className="inline-block font-mono text-xs bg-gray-100 rounded px-2 py-0.5">{item.codigo}</span>
                                            ) : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-500">
                                            {item.sede?.nombre || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-500">
                                            {item.receptor?.nombre_completo || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                                            {item.esta_revisado ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                    <CheckCircleIcon className="h-3.5 w-3.5" />
                                                    Revisado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                    <ClockIcon className="h-3.5 w-3.5" />
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3.5 text-sm text-gray-500">
                                            {formatDate(item.fecha_creacion)}
                                        </td>
                                        <td className="whitespace-nowrap py-3.5 pl-3 pr-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {item.esta_revisado ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 px-2 py-1" title="No se puede modificar, ya fue revisado">
                                                        <LockClosedIcon className="h-4 w-4" />
                                                        Bloqueado
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Link
                                                            to={`/mantenimientos/editar/${item.id}`}
                                                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filtered.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5 bg-gray-50/50">
                        <p className="text-sm text-gray-500">
                            Mostrando <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
                            <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> de{' '}
                            <span className="font-semibold">{filtered.length}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition ${currentPage === page
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
