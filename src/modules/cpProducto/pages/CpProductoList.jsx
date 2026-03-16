import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cpProductoService } from '../services/cpProductoService';
import Swal from 'sweetalert2';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, TagIcon, ArchiveBoxIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function CpProductoList() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            setLoading(true);
            const response = await cpProductoService.getAll();
            const data = response.objeto || response;
            if (Array.isArray(data)) {
                setProductos(data);
            } else {
                setProductos([]);
            }
        } catch (error) {
            console.error("Error loading productos:", error);
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredProductos = useMemo(() => {
        return productos.filter(producto => {
            const search = searchTerm.toLowerCase();
            return (
                producto.nombre?.toLowerCase().includes(search) ||
                producto.codigo?.toLowerCase().includes(search) ||
                producto.id?.toString().includes(search)
            );
        });
    }, [productos, searchTerm]);

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
                await cpProductoService.delete(id);
                setProductos(prev => prev.filter(item => item.id !== id));
                Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            } catch (error) {
                console.error("Error deleting:", error);
                const errorMessage = error.response?.data?.mensaje || 'No se pudo eliminar el registro';
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">

            {/* Hero Section - Nexa Premium v2.0 */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        CATÁLOGO MAESTRO
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Productos (CP)
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Administra el catálogo de productos utilizados en las operaciones de compra.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/cp-productos/nuevo"
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5 stroke-[3]" />
                            Nuevo Producto
                        </Link>
                    </div>
                </div>
                {/* Decorative Elements */}
                <CubeIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-all duration-700" />
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Filters Card */}
            <div className="mb-8 bg-white p-6 rounded-[2rem] shadow-xl ring-1 ring-gray-900/5 transition-all hover:shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <FunnelIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Filtros dinámicos</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                        Total: {filteredProductos.length} registros
                    </span>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="relative group lg:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.2em]">Buscador</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <MagnifyingGlassIcon className={`h-5 w-5 transition-colors ${loading ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Escribe nombre, código o ID para buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full rounded-2xl border-0 py-4 pl-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-100 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 focus:ring-indigo-600 sm:text-sm transition-all bg-slate-50/50 focus:bg-white font-medium italic"
                            />
                        </div>
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
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Producto</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Código</th>
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
                                            <span className="text-xs font-bold text-slate-400">Cargando catálogo...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProductos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 shadow-inner ring-1 ring-slate-100">
                                                <ArchiveBoxIcon className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-500 text-base font-extrabold tracking-tight">No se encontraron productos</p>
                                            <p className="text-slate-400 text-xs mt-2 font-medium">Intenta con otro término en los filtros dinámicos.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProductos.map((item) => (
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
                                                <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                    {item.nombre}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                {item.codigo || 'S/C'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/cp-productos/editar/${item.id}`}
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
                        Ecosistema NEXA &copy; {new Date().getFullYear()} - Gestión de Maestros
                    </p>
                </div>
            </div>
        </div>
    );
}
