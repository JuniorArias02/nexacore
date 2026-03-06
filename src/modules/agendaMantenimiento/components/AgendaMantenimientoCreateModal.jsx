import {
    PlusIcon,
    XMarkIcon,
    ClockIcon,
    BuildingOfficeIcon,
    UserIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const formatDateTime = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

export default function AgendaMantenimientoCreateModal({
    show,
    onClose,
    modalData,
    setModalData,
    sedes,
    personas,
    onCreate,
    creating
}) {
    if (!show) return null;

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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <PlusIcon className="h-6 w-6 text-white" />
                            <h3 className="text-lg font-bold text-white">Nuevo Agendamiento</h3>
                        </div>
                        <button onClick={onClose} className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatDateTime(modalData.fecha_inicio)} → {formatDateTime(modalData.fecha_fin)}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Título */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Título *</label>
                        <input
                            type="text"
                            value={modalData.titulo}
                            onChange={(e) => setModalData({ ...modalData, titulo: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Ej: Mantenimiento preventivo equipo X"
                            autoFocus
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Descripción <span className="text-gray-400 font-normal normal-case">(opcional)</span></label>
                        <textarea
                            value={modalData.descripcion}
                            onChange={(e) => setModalData({ ...modalData, descripcion: e.target.value })}
                            rows={2}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                            placeholder="Notas adicionales..."
                        />
                    </div>

                    {/* Sede */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                            <BuildingOfficeIcon className="h-3.5 w-3.5" /> Sede
                        </label>
                        <select
                            value={modalData.sede_id}
                            onChange={(e) => setModalData({ ...modalData, sede_id: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white"
                        >
                            <option value="">Seleccionar sede</option>
                            {sedes.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Técnico */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                            <UserIcon className="h-3.5 w-3.5" /> Técnico *
                        </label>
                        <select
                            value={modalData.asignado_a}
                            onChange={(e) => setModalData({ ...modalData, asignado_a: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white"
                        >
                            <option value="">Seleccionar técnico</option>
                            {personas.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre_completo || p.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={creating}
                        className="px-5 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onCreate}
                        disabled={creating}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-500/25"
                    >
                        {creating ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <CalendarDaysIcon className="h-4 w-4" />
                        )}
                        {creating ? 'Guardando...' : 'Agendar'}
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
