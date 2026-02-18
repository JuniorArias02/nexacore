import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cpPedidoService } from '../services/cpPedidoService';
import { formatDate } from '../../../utils/dateFormatter';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    DocumentArrowDownIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';

export default function CpPedidoList() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Pagination
    const [filterMonth, setFilterMonth] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [searchCreator, setSearchCreator] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            setLoading(true);
            const data = await cpPedidoService.getAll();
            console.log(data);
            const sortedData = (data.objeto || []).sort((a, b) => b.id - a.id);
            setPedidos(sortedData);
        } catch (error) {
            console.error('Error loading pedidos:', error);
            const errorMessage = error.response?.data?.message || 'No se pudieron cargar los pedidos';
            const errorDetails = error.response?.data?.error || '';
            Swal.fire({
                icon: 'error',
                title: 'Error de Permisos',
                text: errorMessage,
                footer: errorDetails ? `<pre class="text-xs text-red-500">${errorDetails}</pre>` : null
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/cp-pedidos/${id}`);
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
                await cpPedidoService.delete(id);
                setPedidos(prev => prev.filter(p => p.id !== id));
                Swal.fire('Eliminado!', 'El pedido ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el pedido', 'error');
            }
        }
    };

    // Filter Logic
    const filteredPedidos = useMemo(() => {
        return pedidos.filter(pedido => {
            // Filter by Month
            if (filterMonth) {
                const pedidoDate = new Date(pedido.fecha_solicitud);
                const pedidoMonth = `${pedidoDate.getFullYear()}-${String(pedidoDate.getMonth() + 1).padStart(2, '0')}`;
                if (pedidoMonth !== filterMonth) return false;
            }

            // Filter by Estado Compras
            if (filterEstado && pedido.estado_compras !== filterEstado) {
                return false;
            }

            // Filter by Creator
            if (searchCreator) {
                const creatorName = pedido.elaborado_por?.nombre_completo?.toLowerCase() || '';
                const creatorUser = pedido.elaborado_por?.usuario?.toLowerCase() || '';
                const term = searchCreator.toLowerCase();
                if (!creatorName.includes(term) && !creatorUser.includes(term)) return false;
            }

            return true;
        });
    }, [pedidos, filterMonth, searchCreator, filterEstado]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
    const paginatedPedidos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPedidos.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPedidos, currentPage, itemsPerPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterMonth, searchCreator, filterEstado, itemsPerPage]);


    const getEstadoBadge = (estado) => {
        const styles = {
            'pendiente': 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
            'aprobado': 'bg-green-50 text-green-700 ring-green-600/20',
            'rechazado': 'bg-red-50 text-red-700 ring-red-600/20',
            'en proceso': 'bg-blue-50 text-blue-700 ring-blue-600/20'
        };
        const className = styles[estado] || 'bg-gray-50 text-gray-600 ring-gray-500/10';

        return (
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
                {estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'N/A'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

            {/* Header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Pedidos de Compra
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona las solicitudes de compra del departamento.
                    </p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <button
                        type="button"
                        onClick={() => navigate('/cp-pedidos/nuevo')}
                        className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                    >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Nuevo Pedido
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="block w-full rounded-xl border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>

                <div className="relative rounded-md shadow-sm">
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="block w-full rounded-xl border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Todos los Estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="rechazado">Rechazado</option>
                    </select>
                </div>

                <div className="relative rounded-md shadow-sm lg:col-span-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por Elaborado Por..."
                        value={searchCreator}
                        onChange={(e) => setSearchCreator(e.target.value)}
                        className="block w-full rounded-xl border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            {/* Content list */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-gray-900/5 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Info. Pedido</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Solicitante</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado Compras</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado Gerencia</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {paginatedPedidos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No se encontraron pedidos
                                    </td>
                                </tr>
                            ) : (
                                paginatedPedidos.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">#{pedido.consecutivo}</span>
                                                <span className="text-xs text-gray-500">{formatDate(pedido.fecha_solicitud)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900 font-medium">{pedido.solicitante?.nombre || 'N/A'}</span>
                                                <span className="text-xs text-gray-500">Sede: {pedido.sede?.nombre || 'N/A'}</span>
                                                <span className="text-xs text-gray-400 mt-1">Por: {pedido.elaborado_por?.nombre_completo || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getEstadoBadge(pedido.estado_compras)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getEstadoBadge(pedido.estado_gerencia)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pedido.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(pedido.id)}
                                                    className="p-1 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="Ver Detalles"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/cp-pedidos/${pedido.id}/editar`)}
                                                    className="p-1 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                {/* Placeholder for Excel/PDF - functionality to be added */}
                                                <button
                                                    className="p-1 rounded-full text-green-600 hover:bg-green-50 transition-colors"
                                                    title="Descargar Excel (Próximamente)"
                                                >
                                                    <TableCellsIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-1 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Descargar PDF (Próximamente)"
                                                >
                                                    <DocumentArrowDownIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pedido.id)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

                {/* Pagination Controls */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredPedidos.length)}</span> de <span className="font-medium">{filteredPedidos.length}</span> resultados
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="block w-24 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Anterior</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {/* Simple Page Info */}
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    Página {currentPage} de {totalPages || 1}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Siguiente</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
