import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { agendaMantenimientoService } from '../services/agendaMantenimientoService';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import {
    CalendarDaysIcon,
    XMarkIcon,
    FunnelIcon,
    PlusIcon,
    TrashIcon,
    BuildingOfficeIcon,
    UserIcon,
    ClockIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function AgendaMantenimientoList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sedes, setSedes] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [sedeFilter, setSedeFilter] = useState('');

    // Create modal state
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ titulo: '', descripcion: '', sede_id: '', asignado_a: '', fecha_inicio: '', fecha_fin: '' });

    // Detail modal state
    const [showDetail, setShowDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const calendarRef = useRef(null);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            setLoading(true);
            const [agendasRes, sedesRes, personasRes] = await Promise.all([
                agendaMantenimientoService.getAll(),
                api.get('/sedes'),
                agendaMantenimientoService.getUsuariosPorPermiso('mantenimiento.asignado'),
            ]);
            const agendas = agendasRes?.objeto ?? [];
            setSedes(sedesRes.data?.objeto ?? []);
            setPersonas(personasRes?.objeto ?? []);

            const calEvents = agendas.map((a) => ({
                id: String(a.id),
                title: a.titulo || 'Sin título',
                start: a.fecha_inicio,
                end: a.fecha_fin,
                backgroundColor: getEventColor(a),
                borderColor: getEventColor(a),
                extendedProps: { ...a },
            }));
            setEvents(calEvents);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getEventColor = (agenda) => {
        const colors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5', '#be185d'];
        const sedeId = agenda.sede_id || 0;
        return colors[sedeId % colors.length];
    };

    // Drag-to-select handler
    const handleDateSelect = (selectInfo) => {
        setModalData({
            titulo: '',
            descripcion: '',
            sede_id: '',
            asignado_a: '',
            fecha_inicio: selectInfo.startStr,
            fecha_fin: selectInfo.endStr,
        });
        setShowModal(true);
    };

    // Click event handler
    const handleEventClick = (clickInfo) => {
        const data = clickInfo.event.extendedProps;
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            ...data,
        });
        setShowDetail(true);
    };

    // Create agenda + mantenimiento
    const handleCreate = async () => {
        if (!modalData.titulo.trim()) {
            Swal.fire('Campo requerido', 'El título es obligatorio', 'warning');
            return;
        }
        if (!modalData.asignado_a) {
            Swal.fire('Campo requerido', 'Debes asignar a una persona', 'warning');
            return;
        }

        try {
            await agendaMantenimientoService.create(modalData);
            setShowModal(false);
            Swal.fire({ icon: 'success', title: 'Agendado', text: 'Se creó el agendamiento y el mantenimiento asociado.', timer: 2000, showConfirmButton: false });
            loadAll();
        } catch (err) {
            console.error('Error creating:', err);
            const msg = err.response?.data?.mensaje || 'Error al crear la agenda';
            Swal.fire('Error', msg, 'error');
        }
    };

    // Delete
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar agendamiento?',
            text: 'Esto eliminará solo la agenda, no el mantenimiento.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar',
        });
        if (!result.isConfirmed) return;

        try {
            await agendaMantenimientoService.delete(id);
            setShowDetail(false);
            Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
            loadAll();
        } catch (err) {
            Swal.fire('Error', 'No se pudo eliminar la agenda', 'error');
        }
    };

    // Filter events by sede
    const filteredEvents = sedeFilter
        ? events.filter((e) => String(e.extendedProps.sede_id) === String(sedeFilter))
        : events;

    const formatDateTime = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleString('es-CO', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
        });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl">
                <div className="absolute inset-0">
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-pink-400/20 blur-3xl"></div>
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm">
                            <CalendarDaysIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Agenda de Mantenimientos</h1>
                            <p className="text-white/70 mt-1">Arrastra para agendar, haz clic para ver detalles</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Sede filter */}
                        <div className="relative">
                            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                            <select
                                value={sedeFilter}
                                onChange={(e) => setSedeFilter(e.target.value)}
                                className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-white/40 appearance-none min-w-[160px]"
                            >
                                <option value="" className="text-gray-900">Todas las sedes</option>
                                {sedes.map((s) => (
                                    <option key={s.id} value={s.id} className="text-gray-900">{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                            <p className="text-2xl font-bold text-white">{filteredEvents.length}</p>
                            <p className="text-xs text-white/70">Agendados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        locale="es"
                        selectable={true}
                        selectMirror={true}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        events={filteredEvents}
                        height="auto"
                        dayMaxEvents={3}
                        buttonText={{
                            today: 'Hoy',
                            month: 'Mes',
                            week: 'Semana',
                            day: 'Día',
                        }}
                        eventDisplay="block"
                        allDayText="hoy"
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        }}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        }}
                    />
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
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
                                <button onClick={() => setShowModal(false)} className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition">
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

                            {/* Asignar a */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                    <UserIcon className="h-3.5 w-3.5" /> Asignar a *
                                </label>
                                <select
                                    value={modalData.asignado_a}
                                    onChange={(e) => setModalData({ ...modalData, asignado_a: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white"
                                >
                                    <option value="">Seleccionar persona</option>
                                    {personas.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nombre_completo || p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 font-semibold text-sm transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-500/25"
                            >
                                <CalendarDaysIcon className="h-4 w-4" />
                                Agendar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
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
                                <button onClick={() => setShowDetail(false)} className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition ml-3 shrink-0">
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
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Asignado a</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{selectedEvent.creador?.nombre_completo || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <UserIcon className="h-4 w-4 text-pink-500" />
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Agendado por</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{selectedEvent.agendador?.nombre_completo || '—'}</p>
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
                        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={() => handleDelete(selectedEvent.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-sm transition"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Eliminar
                            </button>
                            <button
                                onClick={() => setShowDetail(false)}
                                className="px-5 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 font-semibold text-sm transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation + Calendar Styles */}
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .fc {
                    --fc-border-color: #e5e7eb;
                    --fc-today-bg-color: #eef2ff;
                    --fc-event-border-color: transparent;
                    font-family: inherit;
                }
                .fc .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    font-weight: 800 !important;
                    color: #1e293b;
                }
                .fc .fc-button {
                    background: #f8fafc !important;
                    border: 1px solid #e2e8f0 !important;
                    color: #475569 !important;
                    font-weight: 600 !important;
                    font-size: 0.8125rem !important;
                    border-radius: 0.75rem !important;
                    padding: 0.4rem 0.85rem !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
                    transition: all 0.15s !important;
                }
                .fc .fc-button:hover {
                    background: #e2e8f0 !important;
                    color: #1e293b !important;
                }
                .fc .fc-button-active {
                    background: #4f46e5 !important;
                    border-color: #4f46e5 !important;
                    color: white !important;
                }
                .fc .fc-button-active:hover {
                    background: #4338ca !important;
                    color: white !important;
                }
                .fc .fc-daygrid-event {
                    border-radius: 0.5rem !important;
                    padding: 2px 6px !important;
                    font-size: 0.8125rem !important;
                    font-weight: 600 !important;
                }
                .fc .fc-timegrid-event {
                    border-radius: 0.5rem !important;
                    font-size: 0.8125rem !important;
                }
                .fc .fc-col-header-cell {
                    padding: 0.5rem 0 !important;
                    font-weight: 700 !important;
                    font-size: 0.8125rem !important;
                    text-transform: uppercase !important;
                    color: #64748b !important;
                    background: #f8fafc !important;
                }
                .fc .fc-daygrid-day-number {
                    font-weight: 600 !important;
                    color: #334155 !important;
                    padding: 0.5rem !important;
                }
                .fc .fc-highlight {
                    background: rgba(79, 70, 229, 0.12) !important;
                }
                .fc td, .fc th {
                    border-color: #f1f5f9 !important;
                }
                .fc .fc-scrollgrid {
                    border-radius: 0.75rem !important;
                    overflow: hidden !important;
                    border: 1px solid #e5e7eb !important;
                }
            `}</style>
        </div>
    );
}
