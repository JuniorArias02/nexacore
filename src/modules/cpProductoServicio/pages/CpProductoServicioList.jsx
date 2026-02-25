import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cpProductoServicioService } from '../services/cpProductoServicioService';
import Swal from 'sweetalert2';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    TableCellsIcon,
    ArchiveBoxIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function CpProductoServicioList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 15;

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadItems();
    }, [debouncedTerm, currentPage]);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await cpProductoServicioService.getAll({
                search: debouncedTerm,
                page: currentPage,
                per_page: perPage
            });

            // Laravel Paginated Response handling
            const data = response.objeto || response;
            if (data && data.data) {
                setItems(data.data);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
                setTotal(data.total);
            } else if (Array.isArray(data)) {
                setItems(data);
                setTotal(data.length);
            } else {
                setItems([]);
                setTotal(0);
            }
        } catch (error) {
            console.error("Error loading productos servicios:", error);
            Swal.fire('Error', 'No se pudieron cargar los registros', 'error');
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
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                container: 'font-sans',
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                await cpProductoServicioService.delete(id);
                loadItems(); // Reload current page
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El registro ha sido eliminado correctamente.',
                    customClass: { popup: 'rounded-3xl' }
                });
            } catch (error) {
                console.error("Error deleting:", error);
                const errorMessage = error.response?.data?.mensaje || 'No se pudo eliminar el registro';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    customClass: { popup: 'rounded-3xl' }
                });
            }
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/30 mb-2 backdrop-blur-sm">
                        CATÁLOGO MAESTRO
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                        Productos y Servicios
                    </h1>
                    <p className="text-indigo-50 max-w-2xl text-lg">
                        Gestiona el inventario de bienes y servicios disponibles para las órdenes de compra.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/cp-productos-servicios/nuevo"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-all transform hover:-translate-y-1"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                            Nuevo Registro
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Filters Card */}
            <div className="mb-8 bg-white p-6 rounded-3xl shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <FunnelIcon className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Filtros dinámicos</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="relative group lg:col-span-2">
                        <label className="block text-xs font-black text-gray-400 mb-1 ml-1 uppercase tracking-widest">Buscador em tiempo real</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <MagnifyingGlassIcon className={`h-5 w-5 transition-colors ${loading ? 'text-indigo-500 animate-pulse' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Escribe nombre o código para buscar en la base de datos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:ring-indigo-600 sm:text-sm transition-all bg-gray-50/50 focus:bg-white font-medium shadow-inner"
                            />
                        </div>
                    </div>
                    <div className="flex items-end justify-end pb-1">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            Total: {total} registros
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-900/5 transition-all">
                <div className="overflow-x-auto relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    )}
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Producto / Servicio</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Clasificación</th>
                                <th scope="col" className="relative px-6 py-5">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white capitalize">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                                                <ArchiveBoxIcon className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-500 text-sm font-bold tracking-tight">No se encontraron productos o servicios</p>
                                            <p className="text-slate-400 text-xs mt-1">Intenta con otro término de búsqueda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 tracking-tight">
                                                #{item.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                    <TagIcon className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                        {item.nombre.toLowerCase()}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        {item.codigo_producto || 'SIN CÓDIGO'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 opacity-60">
                                                <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
                                                Maestro
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/cp-productos-servicios/editar/${item.id}`}
                                                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all shadow-sm bg-white ring-1 ring-slate-100"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-xl text-red-600 hover:bg-red-100 transition-all shadow-sm bg-white ring-1 ring-slate-100"
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

                {/* Modern Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 bg-gray-50/50 border-t border-gray-100">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Página {currentPage} de {lastPage}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1 || loading}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Anterior
                        </button>

                        <div className="hidden md:flex items-center gap-1">
                            {[...Array(lastPage)].map((_, i) => {
                                const page = i + 1;
                                // Show first, last, current, and neighbors
                                if (
                                    page === 1 ||
                                    page === lastPage ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === page
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    (page === 2 && currentPage > 3) ||
                                    (page === lastPage - 1 && currentPage < lastPage - 2)
                                ) {
                                    return <span key={page} className="px-1 text-slate-300">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
                            disabled={currentPage === lastPage || loading}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
                        >
                            Siguiente
                        </button>
                    </div>

                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        Nexa Maestro &reg; {new Date().getFullYear()}
                    </div>
                </div>
            </div>
        </div>
    );
}
