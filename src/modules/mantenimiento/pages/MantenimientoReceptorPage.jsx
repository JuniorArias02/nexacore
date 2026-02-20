import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { mantenimientoService } from '../services/mantenimientoService';
import {
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    WrenchScrewdriverIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    UserIcon,
    PhotoIcon,
    ClockIcon,
    CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function MantenimientoReceptorPage() {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [selected, setSelected] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

    useEffect(() => {
        loadMisMantenimientos();
    }, []);

    const loadMisMantenimientos = async () => {
        try {
            setLoading(true);
            const res = await mantenimientoService.getMisMantenimientos();
            setMantenimientos(res.objeto ?? []);
        } catch (error) {
            console.error('Error loading mis mantenimientos:', error);
            Swal.fire('Error', 'No se pudieron cargar tus mantenimientos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMarcarRevisado = async (id) => {
        const result = await Swal.fire({
            title: '¿Marcar como revisado?',
            text: 'Confirma que has revisado este mantenimiento.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, marcar',
        });
        if (!result.isConfirmed) return;

        try {
            await mantenimientoService.marcarRevisado(id);
            Swal.fire('Listo', 'Mantenimiento marcado como revisado', 'success');
            setSelected(null);
            loadMisMantenimientos();
        } catch (error) {
            const msg = error.response?.data?.mensaje || 'Error al marcar como revisado';
            Swal.fire('Error', msg, 'error');
        }
    };

    const filtered = mantenimientos.filter((m) => {
        // Status filter
        if (statusFilter === 'pendientes' && m.esta_revisado) return false;
        if (statusFilter === 'revisados' && !m.esta_revisado) return false;

        // Text search
        const term = search.toLowerCase();
        return (
            m.titulo?.toLowerCase().includes(term) ||
            m.codigo?.toLowerCase().includes(term) ||
            m.dependencia?.toLowerCase().includes(term)
        );
    });

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('es-CO', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    const formatDateTime = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('es-CO', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    const pendientes = mantenimientos.filter((m) => !m.esta_revisado).length;
    const revisados = mantenimientos.filter((m) => m.esta_revisado).length;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8 shadow-2xl">
                <div className="absolute inset-0">
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm">
                                <ClipboardDocumentCheckIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">Mis Mantenimientos</h1>
                                <p className="text-blue-100 mt-1">Revisa y gestiona los mantenimientos que te han sido asignados</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[90px]">
                                <p className="text-2xl font-bold text-white">{pendientes}</p>
                                <p className="text-xs text-blue-200">Pendientes</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[90px]">
                                <p className="text-2xl font-bold text-white">{revisados}</p>
                                <p className="text-xs text-blue-200">Revisados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Buscar por título, código o dependencia..."
                    />
                </div>
                {/* Status filter pills */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5 shrink-0">
                    {[
                        { key: 'todos', label: 'Todos' },
                        { key: 'pendientes', label: 'Pendientes' },
                        { key: 'revisados', label: 'Revisados' },
                    ].map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => setStatusFilter(opt.key)}
                            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter === opt.key
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <ClipboardDocumentCheckIcon className="mx-auto h-16 w-16 text-gray-300" />
                    <p className="mt-4 text-lg font-semibold text-gray-500">No tienes mantenimientos asignados</p>
                    <p className="text-sm text-gray-400 mt-1">Cuando te asignen uno, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((m) => (
                        <div
                            key={m.id}
                            className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden"
                        >
                            {/* Status ribbon */}
                            <div className={`absolute top-0 left-0 right-0 h-1 ${m.esta_revisado ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}></div>

                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                            {m.titulo}
                                        </h3>
                                        {m.codigo && (
                                            <span className="inline-block mt-1 text-xs font-mono text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
                                                {m.codigo}
                                            </span>
                                        )}
                                    </div>
                                    {m.esta_revisado ? (
                                        <CheckCircleSolid className="h-6 w-6 text-emerald-500 shrink-0 ml-2" />
                                    ) : (
                                        <ClockIcon className="h-6 w-6 text-amber-500 shrink-0 ml-2" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="space-y-2 mb-4">
                                    {m.sede?.nombre && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400 shrink-0" />
                                            <span className="truncate">{m.sede.nombre}</span>
                                        </div>
                                    )}
                                    {m.dependencia && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <WrenchScrewdriverIcon className="h-4 w-4 text-gray-400 shrink-0" />
                                            <span className="truncate">{m.dependencia}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0" />
                                        <span>{formatDate(m.fecha_creacion)}</span>
                                    </div>
                                </div>

                                {/* Status badge + Action */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${m.esta_revisado
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {m.esta_revisado ? (
                                            <><CheckCircleIcon className="h-3.5 w-3.5" /> Revisado</>
                                        ) : (
                                            <><ClockIcon className="h-3.5 w-3.5" /> Pendiente</>
                                        )}
                                    </span>
                                    <button
                                        onClick={() => setSelected(m)}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-colors"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        Detalle
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modern Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"></div>

                    {/* Modal */}
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'modalIn 0.25s ease-out' }}
                    >
                        {/* Modal Header */}
                        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 px-6 py-6">
                            <div className="absolute inset-0">
                                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                            </div>
                            <div className="relative flex items-start justify-between">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {selected.esta_revisado ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-100">
                                                <CheckCircleSolid className="h-3.5 w-3.5" /> Revisado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-100">
                                                <ClockIcon className="h-3.5 w-3.5" /> Pendiente
                                            </span>
                                        )}
                                        {selected.codigo && (
                                            <span className="text-xs font-mono text-blue-200 bg-white/10 rounded px-2 py-0.5">
                                                {selected.codigo}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight">{selected.titulo}</h3>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/15 hover:bg-white/25 text-white transition"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body — Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* Info Cards Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <WrenchScrewdriverIcon className="h-4 w-4 text-blue-500" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Modelo</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{selected.modelo || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BuildingOfficeIcon className="h-4 w-4 text-blue-500" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Sede</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{selected.sede?.nombre || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BuildingOfficeIcon className="h-4 w-4 text-cyan-500" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Dependencia</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{selected.dependencia || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <UserIcon className="h-4 w-4 text-purple-500" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Creado por</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{selected.creador?.nombre_completo || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CalendarIcon className="h-4 w-4 text-green-500" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Fecha creación</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{formatDateTime(selected.fecha_creacion)}</p>
                                </div>
                                {selected.esta_revisado && selected.fecha_revisado && (
                                    <div className="bg-emerald-50 rounded-xl p-3.5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckBadgeIcon className="h-4 w-4 text-emerald-500" />
                                            <span className="text-xs font-semibold text-emerald-600 uppercase">Revisado el</span>
                                        </div>
                                        <p className="text-sm font-medium text-emerald-800">{formatDateTime(selected.fecha_revisado)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {selected.descripcion && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Descripción</h4>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {selected.descripcion}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Images */}
                            {selected.imagen && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                                        <PhotoIcon className="h-4 w-4" /> Fotografías
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selected.imagen.split(',').filter(Boolean).map((img, i) => (
                                            <a
                                                key={i}
                                                href={`${API_URL}/${img}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group/img relative block rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md"
                                            >
                                                <img
                                                    src={`${API_URL}/${img}`}
                                                    alt={`Foto ${i + 1}`}
                                                    className="w-full h-44 object-cover group-hover/img:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                                                    <EyeIcon className="h-8 w-8 text-white opacity-0 group-hover/img:opacity-100 transition-opacity drop-shadow-lg" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setSelected(null)}
                                className="px-5 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 font-semibold text-sm transition shadow-sm"
                            >
                                Cerrar
                            </button>
                            {!selected.esta_revisado && (
                                <button
                                    onClick={() => handleMarcarRevisado(selected.id)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:from-blue-700 hover:to-cyan-600 transition shadow-lg shadow-blue-500/25"
                                >
                                    <CheckCircleIcon className="h-5 w-5" />
                                    Marcar como revisado
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal animation keyframes */}
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
