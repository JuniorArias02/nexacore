import {
    XMarkIcon,
    WrenchScrewdriverIcon,
    BuildingOfficeIcon,
    UserIcon,
    CalendarIcon,
    CheckBadgeIcon,
    PhotoIcon,
    EyeIcon,
    CheckCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const formatDateTime = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
};

export default function MantenimientoDetailModal({ selected, onClose, onMarcarRevisado, API_URL }) {
    if (!selected) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
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
                            onClick={onClose}
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
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 font-semibold text-sm transition shadow-sm"
                    >
                        Cerrar
                    </button>
                    {!selected.esta_revisado && (
                        <button
                            onClick={() => onMarcarRevisado(selected.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:from-blue-700 hover:to-cyan-600 transition shadow-lg shadow-blue-500/25"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                            Marcar como revisado
                        </button>
                    )}
                </div>

                {/* Modal animation keyframes */}
                <style>{`
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>
            </div>
        </div>
    );
}
