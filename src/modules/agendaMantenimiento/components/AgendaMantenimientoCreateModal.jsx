import { useState, useRef, useEffect, useCallback } from 'react';
import { agendaMantenimientoService } from '../services/agendaMantenimientoService';
import {
    PlusIcon,
    XMarkIcon,
    ClockIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    ChevronDownIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// ─── helpers ────────────────────────────────────────────────────────────────
const toLocalInput = (isoStr) => {
    if (!isoStr) return '';
    // FullCalendar gives us ISO strings like "2025-05-10T08:00:00-05:00"
    // datetime-local input needs "YYYY-MM-DDTHH:mm"
    const d = new Date(isoStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromLocalInput = (localStr) => {
    // datetime-local → ISO string (preserve local timezone)
    if (!localStr) return '';
    return new Date(localStr).toISOString();
};

const formatDisplay = (isoStr) => {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

// ─── MultiTecnicoSelect ──────────────────────────────────────────────────────
function MultiTecnicoSelect({ personas, value, onChange, ocupados = [] }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = personas.filter((p) =>
        (p.nombre_completo || p.nombre || '').toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id) => {
        if (ocupados.includes(id)) return; // No se puede seleccionar si está ocupado
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    const selectedPersonas = personas.filter((p) => value.includes(p.id));

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white hover:border-indigo-300"
            >
                <span className={value.length === 0 ? 'text-gray-400' : 'text-gray-700 font-medium'}>
                    {value.length === 0
                        ? 'Seleccionar técnicos...'
                        : `${value.length} técnico${value.length > 1 ? 's' : ''} seleccionado${value.length > 1 ? 's' : ''}`}
                </span>
                <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Chips de técnicos seleccionados */}
            {selectedPersonas.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedPersonas.map((p) => (
                        <span
                            key={p.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"
                        >
                            {p.nombre_completo || p.nombre}
                            <button
                                type="button"
                                onClick={() => toggle(p.id)}
                                className="hover:text-indigo-900 ml-0.5"
                            >
                                <XMarkIcon className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Ocupados info */}
            {ocupados.length > 0 && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-3.5 w-3.5 shrink-0" />
                    {ocupados.length} técnico{ocupados.length > 1 ? 's' : ''} ocupado{ocupados.length > 1 ? 's' : ''} en ese horario
                </p>
            )}

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar técnico..."
                                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                            />
                        </div>
                    </div>
                    {/* List */}
                    <ul className="max-h-44 overflow-y-auto divide-y divide-gray-50">
                        {filtered.length === 0 && (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">Sin resultados</li>
                        )}
                        {filtered.map((p) => {
                            const selected = value.includes(p.id);
                            const ocupado  = ocupados.includes(p.id);
                            return (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(p.id)}
                                        disabled={ocupado}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition ${
                                            ocupado
                                                ? 'bg-red-50 text-red-400 cursor-not-allowed opacity-70'
                                                : selected
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                                            ocupado
                                                ? 'border-red-300 bg-red-50'
                                                : selected
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'border-gray-300'
                                        }`}>
                                            {ocupado
                                                ? <ExclamationTriangleIcon className="h-3 w-3 text-red-400" />
                                                : selected && <CheckIcon className="h-3 w-3 text-white" />
                                            }
                                        </div>
                                        <span className="flex-1">{p.nombre_completo || p.nombre}</span>
                                        {ocupado && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-500">
                                                Ocupado
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ─── Main modal ──────────────────────────────────────────────────────────────
export default function AgendaMantenimientoCreateModal({
    show,
    onClose,
    modalData,
    setModalData,
    sedes,
    personas,
    onCreate,
    creating,
}) {
    // IDs de técnicos que ya tienen conflicto en el rango seleccionado
    const [tecnicosOcupados, setTecnicosOcupados] = useState([]);
    const [checkingDisp, setCheckingDisp] = useState(false);

    // Consultar disponibilidad cada vez que cambian las fechas
    useEffect(() => {
        if (!show || !modalData.fecha_inicio || !modalData.fecha_fin) {
            setTecnicosOcupados([]);
            return;
        }
        let cancelled = false;
        const check = async () => {
            try {
                setCheckingDisp(true);
                const ocupados = await agendaMantenimientoService.getDisponibilidad(
                    modalData.fecha_inicio,
                    modalData.fecha_fin
                );
                if (!cancelled) {
                    setTecnicosOcupados(ocupados);
                    // Quitar del array de seleccionados los que ahora están ocupados
                    setModalData((prev) => ({
                        ...prev,
                        tecnicos: (prev.tecnicos ?? []).filter((id) => !ocupados.includes(id)),
                    }));
                }
            } catch {
                if (!cancelled) setTecnicosOcupados([]);
            } finally {
                if (!cancelled) setCheckingDisp(false);
            }
        };
        check();
        return () => { cancelled = true; };
    }, [show, modalData.fecha_inicio, modalData.fecha_fin]);

    if (!show) return null;

    const handleDatetimeChange = (field, val) => {
        setModalData((prev) => ({ ...prev, [field]: fromLocalInput(val) }));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'modalIn 0.25s ease-out' }}
            >
                {/* ── Header ── */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <PlusIcon className="h-6 w-6 text-white" />
                            <h3 className="text-lg font-bold text-white">Nuevo Agendamiento</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                    {modalData.fecha_inicio && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                            <ClockIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                                {formatDisplay(modalData.fecha_inicio)} → {formatDisplay(modalData.fecha_fin)}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Body ── */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Título */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                            Título *
                        </label>
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
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                            Descripción <span className="text-gray-400 font-normal normal-case">(opcional)</span>
                        </label>
                        <textarea
                            value={modalData.descripcion}
                            onChange={(e) => setModalData({ ...modalData, descripcion: e.target.value })}
                            rows={2}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                            placeholder="Notas adicionales..."
                        />
                    </div>

                    {/* Fecha y hora */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <ClockIcon className="h-3.5 w-3.5" /> Inicio *
                            </label>
                            <input
                                type="datetime-local"
                                value={toLocalInput(modalData.fecha_inicio)}
                                onChange={(e) => handleDatetimeChange('fecha_inicio', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <ClockIcon className="h-3.5 w-3.5" /> Fin *
                            </label>
                            <input
                                type="datetime-local"
                                value={toLocalInput(modalData.fecha_fin)}
                                onChange={(e) => handleDatetimeChange('fecha_fin', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                    </div>

                    {/* Sede */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                            <BuildingOfficeIcon className="h-3.5 w-3.5" /> Sede *
                        </label>
                        <select
                            value={modalData.sede_id}
                            onChange={(e) => setModalData({ ...modalData, sede_id: e.target.value })}
                            className={`w-full rounded-xl border px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white ${
                                !modalData.sede_id ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                            }`}
                        >
                            <option value="">— Seleccionar sede —</option>
                            {sedes.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                        {!modalData.sede_id && (
                            <p className="mt-1 text-xs text-red-500">La sede es obligatoria</p>
                        )}
                    </div>

                    {/* Técnicos (multi-select) */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                            <UserGroupIcon className="h-3.5 w-3.5" /> Técnicos *
                            {modalData.tecnicos?.length > 1 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                    ×{modalData.tecnicos.length}
                                </span>
                            )}
                            {checkingDisp && (
                                <span className="ml-auto text-[10px] text-gray-400 font-normal normal-case flex items-center gap-1">
                                    <div className="h-2.5 w-2.5 border border-gray-400 border-t-indigo-500 rounded-full animate-spin" />
                                    Verificando...
                                </span>
                            )}
                        </label>
                        <MultiTecnicoSelect
                            personas={personas}
                            value={modalData.tecnicos ?? []}
                            onChange={(ids) => setModalData({ ...modalData, tecnicos: ids })}
                            ocupados={tecnicosOcupados}
                        />
                        {modalData.tecnicos?.length > 1 && (
                            <p className="mt-1.5 text-xs text-indigo-600 font-medium flex items-center gap-1">
                                <CalendarDaysIcon className="h-3.5 w-3.5" />
                                Se creará un agendamiento por cada técnico seleccionado
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={creating}
                        className="px-5 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 font-semibold text-sm transition"
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
                    to   { opacity: 1; transform: scale(1)   translateY(0); }
                }
            `}</style>
        </div>
    );
}
