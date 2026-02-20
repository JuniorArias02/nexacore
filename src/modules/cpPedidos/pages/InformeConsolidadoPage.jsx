import { useState, useEffect, useMemo } from 'react';
import { cpPedidoService } from '../services/cpPedidoService';
import EditTrackingModal from '../components/EditTrackingModal';
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    DocumentChartBarIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 15;

const estadoBadge = (estado) => {
    const map = {
        pendiente: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        aprobado: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        rechazado: 'bg-red-50 text-red-700 ring-red-600/20',
        'en proceso': 'bg-sky-50 text-sky-700 ring-sky-600/20',
    };
    return map[estado] || 'bg-gray-50 text-gray-700 ring-gray-600/20';
};

const InformeConsolidadoPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterProceso, setFilterProceso] = useState('');
    const [filterSede, setFilterSede] = useState('');
    const [filterElaborado, setFilterElaborado] = useState('');
    const [filterFechaDesde, setFilterFechaDesde] = useState('');
    const [filterFechaHasta, setFilterFechaHasta] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Modal state
    const [editingPedido, setEditingPedido] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            setLoading(true);
            const data = await cpPedidoService.getAll();
            setPedidos(data || []);
        } catch (err) {
            console.error('Error loading pedidos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Unique filter options — sedes first (independent)
    const sedes = useMemo(() => {
        const map = new Map();
        pedidos.forEach(p => { if (p.sede) map.set(p.sede.nombre, p.sede.id); });
        return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    }, [pedidos]);

    // Procesos filtered by selected sede (cascading)
    const procesos = useMemo(() => {
        const set = new Set();
        pedidos.forEach(p => {
            if (!p.solicitante?.nombre) return;
            // If a sede is selected, only show procesos belonging to that sede
            if (filterSede && String(p.solicitante.sede_id) !== filterSede) return;
            set.add(p.solicitante.nombre);
        });
        return [...set].sort();
    }, [pedidos, filterSede]);

    const elaboradores = useMemo(() => {
        const map = new Map();
        pedidos.forEach(p => {
            if (p.elaborado_por_rel) {
                map.set(p.elaborado_por_rel.id, p.elaborado_por_rel.nombre_completo);
            } else if (p.elaborado_por_data) {
                map.set(p.elaborado_por_data.id, p.elaborado_por_data.nombre_completo);
            }
        });
        return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    }, [pedidos]);

    // Reset proceso when sede changes
    const handleSedeChange = (value) => {
        setFilterSede(value);
        setFilterProceso(''); // reset proceso because it depends on sede
    };

    // Filtered data
    const filtered = useMemo(() => {
        return pedidos.filter(p => {
            const matchSearch = !search || [
                p.consecutivo?.toString(),
                p.observacion,
                p.solicitante?.nombre,
                p.sede?.nombre,
                p.tipo_solicitud_rel?.nombre,
            ].some(v => v && v.toLowerCase().includes(search.toLowerCase()));

            const matchProceso = !filterProceso || p.solicitante?.nombre === filterProceso;
            const matchSede = !filterSede || String(p.sede?.id) === filterSede;
            const matchElaborado = !filterElaborado || String(p.elaborado_por) === filterElaborado;

            // Date range filter on fecha_solicitud
            let matchFecha = true;
            if (filterFechaDesde || filterFechaHasta) {
                const fecha = p.fecha_solicitud;
                if (!fecha) {
                    matchFecha = false;
                } else {
                    if (filterFechaDesde && fecha < filterFechaDesde) matchFecha = false;
                    if (filterFechaHasta && fecha > filterFechaHasta) matchFecha = false;
                }
            }

            return matchSearch && matchProceso && matchSede && matchElaborado && matchFecha;
        });
    }, [pedidos, search, filterProceso, filterSede, filterElaborado, filterFechaDesde, filterFechaHasta]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [search, filterProceso, filterSede, filterElaborado, filterFechaDesde, filterFechaHasta]);

    // Save tracking
    const handleSave = async (id, data) => {
        try {
            setSaving(true);
            await cpPedidoService.updateTracking(id, data);
            setPedidos(prev => prev.map(p =>
                p.id === id ? { ...p, ...data } : p
            ));
            setEditingPedido(null);
        } catch (err) {
            console.error('Error updating tracking:', err);
            alert('Error al guardar el seguimiento');
        } finally {
            setSaving(false);
        }
    };

    const clearFilters = () => {
        setFilterProceso('');
        setFilterSede('');
        setFilterElaborado('');
        setFilterFechaDesde('');
        setFilterFechaHasta('');
        setSearch('');
    };

    const hasActiveFilters = filterProceso || filterSede || filterElaborado || filterFechaDesde || filterFechaHasta || search;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 font-sans">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-6 md:p-8 mb-6 shadow-xl shadow-indigo-500/10">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-white/5" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-lg">
                            <DocumentChartBarIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Informe Consolidado
                            </h1>
                            <p className="text-sm text-indigo-100 mt-0.5">Pedidos por Procesos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-sm px-4 py-2">
                            <span className="text-sm font-bold text-white">{filtered.length}</span>
                            <span className="text-xs text-indigo-100">pedidos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por consecutivo, descripción..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${showFilters || hasActiveFilters
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                            }`}
                    >
                        <FunnelIcon className="h-4 w-4" />
                        Filtros
                        {hasActiveFilters && (
                            <span className="ml-1 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                                {[filterProceso, filterSede, filterElaborado, filterFechaDesde, filterFechaHasta].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Sede</label>
                                <select
                                    value={filterSede}
                                    onChange={e => handleSedeChange(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                                >
                                    <option value="">Todas las sedes</option>
                                    {sedes.map(([nombre, id]) => <option key={id} value={id}>{nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Proceso {filterSede && <span className="text-indigo-500 normal-case">(filtrado por sede)</span>}</label>
                                <select
                                    value={filterProceso}
                                    onChange={e => setFilterProceso(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                                >
                                    <option value="">Todos los procesos</option>
                                    {procesos.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Elaborado por</label>
                                <select
                                    value={filterElaborado}
                                    onChange={e => setFilterElaborado(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                                >
                                    <option value="">Todos</option>
                                    {elaboradores.map(([id, nombre]) => <option key={id} value={id}>{nombre}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Fecha desde</label>
                                <input
                                    type="date"
                                    value={filterFechaDesde}
                                    onChange={e => setFilterFechaDesde(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Fecha hasta</label>
                                <input
                                    type="date"
                                    value={filterFechaHasta}
                                    onChange={e => setFilterFechaHasta(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className="mt-3 flex justify-end">
                                <button onClick={clearFilters} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="text-sm text-gray-500">Cargando pedidos...</span>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                            <DocumentChartBarIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">No se encontraron pedidos</h3>
                        <p className="text-xs text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/80">
                                    {[
                                        '#', 'Fecha Solicitud', 'Proceso', 'Sede', 'Consecutivo',
                                        'Tipo Compra', 'Estado', 'Observación',
                                        'Solicitud Cotización', 'Respuesta Cotización',
                                        'Aprobación Orden', 'Envío Proveedor',
                                        'Obs. Pedido', 'Acciones'
                                    ].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginated.map((p, idx) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {p.fecha_solicitud || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-[160px] truncate" title={p.solicitante?.nombre}>
                                            {p.solicitante?.nombre || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {p.sede?.nombre || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                                                {p.consecutivo}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {p.tipo_solicitud_rel?.nombre || p.tipoSolicitud?.nombre || '—'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset capitalize ${estadoBadge(p.estado_compras)}`}>
                                                {p.estado_compras}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 max-w-[150px] truncate" title={p.observacion}>
                                            {p.observacion || '—'}
                                        </td>

                                        {/* Tracking columns */}
                                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {p.fecha_solicitud_cotizacion || <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {p.fecha_respuesta_cotizacion || <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {p.firma_aprobacion_orden || <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {p.fecha_envio_proveedor || <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 max-w-[120px] truncate" title={p.observaciones_pedidos}>
                                            {p.observaciones_pedidos || <span className="text-gray-300">—</span>}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <button
                                                onClick={() => setEditingPedido(p)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 ring-1 ring-inset ring-indigo-600/20 transition-all opacity-60 group-hover:opacity-100"
                                            >
                                                <PencilSquareIcon className="h-3.5 w-3.5" />
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                        <p className="text-sm text-gray-500">
                            Mostrando <span className="font-semibold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
                            <span className="font-semibold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> de{' '}
                            <span className="font-semibold text-gray-900">{filtered.length}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all ${currentPage === pageNum
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <EditTrackingModal
                isOpen={!!editingPedido}
                onClose={() => setEditingPedido(null)}
                pedido={editingPedido}
                onSave={handleSave}
                saving={saving}
            />
        </div>
    );
};

export default InformeConsolidadoPage;
