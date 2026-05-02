import { useNavigate } from 'react-router-dom';
import Can from '../../../components/common/Can';
import {
    ClockIcon,
    XMarkIcon,
    BuildingOfficeIcon,
    UserIcon,
    CalendarDaysIcon,
    DocumentTextIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

const formatDateTime = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

export default function AgendaMantenimientoDetailModal({
    show,
    onClose,
    selectedEvent,
    onDelete
}) {
    const navigate = useNavigate();

    if (!show || !selectedEvent) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
            <div
                className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'modalIn 0.25s ease-out' }}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 py-5">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">{selectedEvent.title}</h3>
                            <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                                <ClockIcon className="h-4 w-4" />
                                <span>{formatDateTime(selectedEvent.start)} → {formatDateTime(selectedEvent.end)}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition ml-3 shrink-0">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 mb-1">
                                <BuildingOfficeIcon className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs font-semibold text-gray-500 uppercase">Sede</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{selectedEvent.sede?.nombre || '—'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 mb-1">
                                <UserIcon className="h-4 w-4 text-purple-500" />
                                <span className="text-xs font-semibold text-gray-500 uppercase">Técnico</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{selectedEvent.tecnico?.nombre_completo || '—'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 mb-1">
                                <UserIcon className="h-4 w-4 text-pink-500" />
                                <span className="text-xs font-semibold text-gray-500 uppercase">Coordinador</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{selectedEvent.coordinador?.nombre_completo || '—'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarDaysIcon className="h-4 w-4 text-green-500" />
                                <span className="text-xs font-semibold text-gray-500 uppercase">Mantenimiento</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">#{selectedEvent.mantenimiento_id || '—'}</p>
                        </div>
                    </div>

                    {selectedEvent.descripcion && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                                <DocumentTextIcon className="h-4 w-4" /> Descripción
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEvent.descripcion}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex gap-2">
                        <Can permission="agenda_mantenimiento.crear">
                            <button
                                onClick={() => onDelete(selectedEvent.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-sm transition shrink-0"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Eliminar
                            </button>
                        </Can>
                        <Can permission="mantenimiento.crear">
                            {selectedEvent.mantenimiento_id && (
                                <button
                                    onClick={() => navigate(`/mantenimientos/editar/${selectedEvent.mantenimiento_id}`)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-semibold text-sm transition shrink-0"
                                >
                                    <CalendarDaysIcon className="h-4 w-4" />
                                    Ingresar mantenimiento
                                </button>
                            )}
                        </Can>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 font-semibold text-sm transition shrink-0"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
