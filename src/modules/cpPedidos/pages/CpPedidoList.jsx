import React, { useState, useEffect, useMemo } from 'react';
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
    TableCellsIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    LinkIcon
} from '@heroicons/react/24/outline';

export default function CpPedidoList() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Filters & Pagination
    // Raw Filter Inputs
    const [monthInput, setMonthInput] = useState(new Date().toISOString().slice(0, 7));
    const [estadoInput, setEstadoInput] = useState('');
    const [creatorInput, setCreatorInput] = useState('');
    const [consecutivoInput, setConsecutivoInput] = useState('');

    // Debounced Filter State
    const [debouncedFilters, setDebouncedFilters] = useState({
        month: new Date().toISOString().slice(0, 7),
        estado: '',
        creator: '',
        consecutivo: ''
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);

    // Debounce Handler
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters({
                month: monthInput,
                estado: estadoInput,
                creator: creatorInput,
                consecutivo: consecutivoInput
            });
        }, 1000); // 1s as requested

        return () => clearTimeout(handler);
    }, [monthInput, estadoInput, creatorInput, consecutivoInput]);

    useEffect(() => {
        // Initial load with current month
        loadPedidos({ month: monthInput });
    }, []);

    // Fetch data from backend on month or consecutive change
    useEffect(() => {
        loadPedidos({
            month: debouncedFilters.month,
            consecutivo: debouncedFilters.consecutivo
        });
    }, [debouncedFilters.month, debouncedFilters.consecutivo]);

    const loadPedidos = async (filters = {}) => {
        try {
            setLoading(true);
            const data = await cpPedidoService.getAll(filters);

            // Pre-process data for faster filtering
            const processedData = (data || []).map(pedido => {
                let pedidoDate;
                if (typeof pedido.fecha_solicitud === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(pedido.fecha_solicitud)) {
                    const [year, month, day] = pedido.fecha_solicitud.split('-').map(Number);
                    pedidoDate = new Date(year, month - 1, day);
                } else {
                    pedidoDate = new Date(pedido.fecha_solicitud);
                }

                return {
                    ...pedido,
                    _searchMonth: `${pedidoDate.getFullYear()}-${String(pedidoDate.getMonth() + 1).padStart(2, '0')}`,
                    _searchCreator: ((pedido.elaborado_por?.nombre_completo || '') + ' ' + (pedido.elaborado_por?.usuario || '')).toLowerCase(),
                    _searchConsecutivo: pedido.consecutivo?.toString() || ''
                };
            });

            const sortedData = processedData.sort((a, b) => b.id - a.id);
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

    const toggleRow = (id) => {
        if (expandedOrderId === id) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(id);
        }
    };

    // Filter Logic - Using Debounced State
    const filteredPedidos = useMemo(() => {
        const { month, estado, creator, consecutivo } = debouncedFilters;
        const term = creator.toLowerCase();

        return pedidos.filter(pedido => {
            // Filter by Month - Ignore if searching by consecutive
            if (month && !consecutivo && pedido._searchMonth !== month) return false;

            // Filter by Estado Compras
            if (estado && pedido.estado_compras !== estado) return false;

            // Filter by Creator
            if (creator && !pedido._searchCreator.includes(term)) return false;

            // Filter by Consecutivo - Exact Match
            if (consecutivo && pedido._searchConsecutivo !== consecutivo) return false;

            return true;
        });
    }, [pedidos, debouncedFilters]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
    const paginatedPedidos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPedidos.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPedidos, currentPage, itemsPerPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedFilters, itemsPerPage]);


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


    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

            {/* Hero Section - Nexa Purple Theme */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/30 mb-2 backdrop-blur-sm">
                        GESTIÓN DE COMPRAS
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                        Pedidos de Compra
                    </h1>
                    <p className="text-indigo-50 max-w-2xl text-lg">
                        Gestiona, aprueba y da seguimiento a las solicitudes de compra de la organización.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/cp-pedidos/nuevo')}
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:-translate-y-1"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                            Nuevo Pedido
                        </button>
                    </div>
                </div>
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Filters & Search Card */}
            <div className="mb-8 bg-white p-6 rounded-3xl shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <FunnelIcon className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Month Filter */}
                    <div className="relative group">
                        <label htmlFor="filterMonth" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Mes</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                {/* <span className="text-gray-400 text-sm">🗓️</span> */}
                            </div>
                            <input
                                id="filterMonth"
                                type="month"
                                value={monthInput}
                                onChange={(e) => setMonthInput(e.target.value)}
                                className="block w-full rounded-2xl border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Estado Filter */}
                    <div className="relative group">
                        <label htmlFor="filterEstado" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Estado</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${!estadoInput ? 'bg-gray-400' :
                                    estadoInput === 'pendiente' ? 'bg-yellow-400' :
                                        estadoInput === 'aprobado' ? 'bg-green-400' :
                                            'bg-red-400'
                                    }`}></div>
                            </div>
                            <select
                                id="filterEstado"
                                value={estadoInput}
                                onChange={(e) => setEstadoInput(e.target.value)}
                                className="block w-full rounded-2xl border-0 py-3 pl-9 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white appearance-none"
                            >
                                <option value="">Todos los Estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="aprobado">Aprobado</option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Search Creator */}
                    <div className="relative group">
                        <label htmlFor="searchCreator" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Buscar Solicitante</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" aria-hidden="true" />
                            </div>
                            <input
                                id="searchCreator"
                                type="text"
                                placeholder="Nombre..."
                                value={creatorInput}
                                onChange={(e) => setCreatorInput(e.target.value)}
                                className="block w-full rounded-2xl border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Search Consecutivo */}
                    <div className="relative group">
                        <label htmlFor="searchConsecutivo" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Buscar Consecutivo</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" aria-hidden="true" />
                            </div>
                            <input
                                id="searchConsecutivo"
                                type="text"
                                placeholder="Pedido #..."
                                value={consecutivoInput}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setConsecutivoInput(val);
                                    if (val) setMonthInput('');
                                }}
                                className="block w-full rounded-2xl border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>
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
                        <tbody className="divide-y divide-gray-200 bg-white relative">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                            <span className="ml-3 text-gray-500 font-medium italic">Actualizando listado...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedPedidos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No se encontraron pedidos
                                    </td>
                                </tr>
                            ) : (
                                paginatedPedidos.map((pedido) => (
                                    <React.Fragment key={pedido.id}>
                                        <tr className={`hover:bg-gray-50 transition-colors duration-150 ${expandedOrderId === pedido.id ? 'bg-indigo-50/30' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <button
                                                        onClick={() => toggleRow(pedido.id)}
                                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 focus:outline-none transition-colors"
                                                    >
                                                        {expandedOrderId === pedido.id ? (
                                                            <ChevronUpIcon className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDownIcon className="h-4 w-4" />
                                                        )}
                                                        #{pedido.consecutivo}
                                                    </button>
                                                    <span className="text-xs text-gray-500 ml-5">{formatDate(pedido.fecha_solicitud)}</span>
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
                                                    <button
                                                        onClick={() => cpPedidoService.exportExcel(pedido.id)}
                                                        className="p-1 rounded-full text-green-600 hover:bg-green-50 transition-colors"
                                                        title="Descargar Excel"
                                                    >
                                                        <TableCellsIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="p-1 rounded-full text-red-600 hover:bg-red-50 transition-colors opacity-50 cursor-not-allowed"
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
                                        {expandedOrderId === pedido.id && (
                                            <tr className="bg-gray-50 animate-fade-in">
                                                <td colSpan="6" className="px-6 py-4 border-t border-gray-100 shadow-inner">
                                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Item</th>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {pedido.items && pedido.items.length > 0 ? (
                                                                    pedido.items.map((item) => (
                                                                        <tr key={item.id}>
                                                                            <td className="px-4 py-2 text-sm font-medium text-indigo-600">{item.producto?.codigo || 'N/A'}</td>
                                                                            <td className="px-4 py-2 text-sm text-gray-900">{item.nombre}</td>
                                                                            <td className="px-4 py-2 text-sm text-gray-500">{item.cantidad}</td>
                                                                            <td className="px-4 py-2 text-sm text-gray-500">{item.unidad_medida}</td>
                                                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                                                {item.referencia_items ? (
                                                                                    <a
                                                                                        href={item.referencia_items}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                                                                                        title="Ver referencia"
                                                                                    >
                                                                                        <LinkIcon className="h-4 w-4" />
                                                                                        <span className="text-xs underline">Ver enlace</span>
                                                                                    </a>
                                                                                ) : '-'}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="5" className="px-4 py-2 text-sm text-gray-500 text-center">No hay items en este pedido.</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
