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
    BoxOpenIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function CpProductoServicioList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await cpProductoServicioService.getAll();
            if (response && response.objeto) {
                setItems(response.objeto);
            } else if (Array.isArray(response)) {
                setItems(response);
            } else {
                setItems([]);
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
                setItems(prev => prev.filter(item => item.id !== id));
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

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const term = searchTerm.toLowerCase();
            return (
                item.nombre?.toLowerCase().includes(term) ||
                item.codigo_producto?.toLowerCase().includes(term) ||
                item.id?.toString().includes(term)
            );
        });
    }, [items, searchTerm]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">

            {/* Header Section - Modern Gradient Design */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 md:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-black text-white ring-1 ring-inset ring-white/30 mb-2 backdrop-blur-sm uppercase tracking-widest">
                        Catálogo Maestro
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                        Productos y Servicios
                    </h1>
                    <p className="text-indigo-50 max-w-2xl text-lg font-medium opacity-90">
                        Gestiona el inventario de bienes y servicios disponibles para las órdenes de compra.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/cp-productos-servicios/nuevo"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:-translate-y-1"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                            Nuevo Registro
                        </Link>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Filters Card */}
            <div className="mb-8 bg-white p-6 rounded-3xl shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <FunnelIcon className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Filtros Rápidos</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="relative group lg:col-span-2">
                        <label className="block text-xs font-black text-gray-400 mb-1 ml-1 uppercase tracking-widest">Buscador Geral</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Busca por nombre, código o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:ring-indigo-600 sm:text-sm transition-all bg-gray-50/50 focus:bg-white font-medium shadow-inner"
                            />
                        </div>
                    </div>
                    <div className="flex items-end justify-end pb-1">
                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            {filteredItems.length} registros encontrados
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-900/5 transition-all">
                <div className="overflow-x-auto">
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
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                                                <BoxOpenIcon className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-500 text-sm font-bold tracking-tight">No se encontraron productos o servicios</p>
                                            <p className="text-slate-400 text-xs mt-1">Prueba con otro término de búsqueda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
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
                                                        {item.nombre}
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
                                                Registro activo
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/cp-productos-servicios/editar/${item.id}`}
                                                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all shadow-sm bg-white ring-1 ring-slate-100"
                                                    title="Editar registro"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-xl text-red-600 hover:bg-red-100 transition-all shadow-sm bg-white ring-1 ring-slate-100"
                                                    title="Eliminar registro"
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
                {/* Footer simple info */}
                <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
                        Ecosistema NEXA &copy; {new Date().getFullYear()} - Gestión de Activos y Servicios
                    </p>
                </div>
            </div>
        </div>
    );
}
