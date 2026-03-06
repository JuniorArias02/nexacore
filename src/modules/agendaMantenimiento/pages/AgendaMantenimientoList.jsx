import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { agendaMantenimientoService } from '../services/agendaMantenimientoService';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import AgendaMantenimientoCreateModal from '../components/AgendaMantenimientoCreateModal';
import AgendaMantenimientoDetailModal from '../components/AgendaMantenimientoDetailModal';
import '../resources/calendar-styles.css';
import {
    CalendarDaysIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';


export default function AgendaMantenimientoList() {
    const { user, hasPermission } = useAuth();
    const canCreate = hasPermission('agenda_mantenimiento.crear');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sedes, setSedes] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [sedeFilter, setSedeFilter] = useState('');

    // Create modal state
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
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
                agendaMantenimientoService.getUsuariosPorPermiso('mantenimiento.seleccion_tecnico'), // Technicians
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
                extendedProps: {
                    ...a,
                    tecnico: a.tecnico,
                    coordinador: a.coordinador
                },
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
        if (!canCreate) return;
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
            setCreating(true);
            await agendaMantenimientoService.create(modalData);
            setShowModal(false);
            Swal.fire({ icon: 'success', title: 'Agendado', text: 'Se creó el agendamiento y el mantenimiento asociado.', timer: 2000, showConfirmButton: false });
            loadAll();
        } catch (err) {
            console.error('Error creating:', err);
            const msg = err.response?.data?.mensaje || 'Error al crear la agenda';
            Swal.fire('Error', msg, 'error');
        } finally {
            setCreating(false);
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

    // Filter events by sede and permissions
    let filteredEvents = sedeFilter
        ? events.filter((e) => String(e.extendedProps.sede_id) === String(sedeFilter))
        : events;

    if (!canCreate && user?.id) {
        filteredEvents = filteredEvents.filter(e => String(e.extendedProps.tecnico_id) === String(user.id));
    }

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
                        selectable={canCreate}
                        selectMirror={canCreate}
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
            <AgendaMantenimientoCreateModal
                show={showModal}
                onClose={() => setShowModal(false)}
                modalData={modalData}
                setModalData={setModalData}
                sedes={sedes}
                personas={personas}
                onCreate={handleCreate}
                creating={creating}
            />

            {/* Detail Modal */}
            <AgendaMantenimientoDetailModal
                show={showDetail}
                onClose={() => setShowDetail(false)}
                selectedEvent={selectedEvent}
                onDelete={handleDelete}
            />
        </div>
    );
}
