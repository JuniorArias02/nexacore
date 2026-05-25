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
import AgendaMantenimientoMobileView from '../components/AgendaMantenimientoMobileView';
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
    const [modalData, setModalData] = useState({
        titulo: '',
        descripcion: '',
        sede_id: '',
        tecnicos: [],       // ← array of tecnico IDs (multi-select)
        fecha_inicio: '',
        fecha_fin: '',
    });

    // Detail modal state
    const [showDetail, setShowDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const calendarRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            setLoading(true);
            const [agendasRes, sedesRes, personasRes] = await Promise.all([
                agendaMantenimientoService.getAll(),
                api.get('/sedes'),
                agendaMantenimientoService.getUsuariosPorPermiso('mantenimiento.seleccion_tecnico'),
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
                    coordinador: a.coordinador,
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

    // ─── Google Calendar-style: click on a day cell → jump to timeGridDay ───
    const handleDateClick = (info) => {
        const calApi = calendarRef.current?.getApi();
        if (!calApi) return;
        calApi.changeView('timeGridDay', info.date);
    };

    // ─── Drag-to-select → open modal with times pre-filled ───────────────────
    // Skip if the user just clicked a single day in month view (allDay + 1 day)
    const handleDateSelect = (selectInfo) => {
        if (!canCreate) return;

        const isSingleDayClick =
            selectInfo.allDay &&
            (new Date(selectInfo.endStr) - new Date(selectInfo.startStr)) <= 24 * 60 * 60 * 1000;

        if (isSingleDayClick) {
            // Let dateClick handle navigation; just clear the highlight
            calendarRef.current?.getApi()?.unselect();
            return;
        }

        setModalData({
            titulo: '',
            descripcion: '',
            sede_id: '',
            tecnicos: [],
            fecha_inicio: selectInfo.startStr,
            fecha_fin: selectInfo.endStr,
        });
        setShowModal(true);
        // NOTE: do NOT unselect here — let the user re-drag the same slot after closing
    };

    const handleNewEvent = (startStr, endStr) => {
        setModalData({
            titulo: '',
            descripcion: '',
            sede_id: '',
            tecnicos: [],
            fecha_inicio: startStr,
            fecha_fin: endStr,
        });
        setShowModal(true);
    };

    // ─── Close create modal → reset calendar selection so drag works again ───
    const handleCloseModal = () => {
        setShowModal(false);
        // Small timeout ensures FullCalendar re-renders before we clear the selection
        setTimeout(() => calendarRef.current?.getApi()?.unselect(), 50);
    };

    // ─── Click on an existing event ──────────────────────────────────────────
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

    // ─── Create agenda (multi-technician: sends one record per technician) ───
    const handleCreate = async () => {
        if (!modalData.titulo.trim()) {
            Swal.fire('Campo requerido', 'El título es obligatorio', 'warning');
            return;
        }
        if (!modalData.sede_id) {
            Swal.fire('Campo requerido', 'La sede es obligatoria', 'warning');
            return;
        }
        if (!modalData.tecnicos || modalData.tecnicos.length === 0) {
            Swal.fire('Campo requerido', 'Debes asignar al menos un técnico', 'warning');
            return;
        }

        try {
            setCreating(true);

            // One API call per technician selected
            await Promise.all(
                modalData.tecnicos.map((tecnicoId) =>
                    agendaMantenimientoService.create({
                        titulo: modalData.titulo,
                        descripcion: modalData.descripcion,
                        sede_id: modalData.sede_id || null,
                        asignado_a: tecnicoId,
                        fecha_inicio: modalData.fecha_inicio,
                        fecha_fin: modalData.fecha_fin,
                    })
                )
            );

            setShowModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Agendado',
                text: modalData.tecnicos.length > 1
                    ? `Se crearon ${modalData.tecnicos.length} agendamientos (uno por técnico).`
                    : 'Se creó el agendamiento y el mantenimiento asociado.',
                timer: 2000,
                showConfirmButton: false,
            });
            loadAll();
        } catch (err) {
            console.error('Error creating:', err);
            const msg = err.response?.data?.mensaje || 'Error al crear la agenda';
            Swal.fire('Error', msg, 'error');
        } finally {
            setCreating(false);
        }
    };

    // ─── Delete ───────────────────────────────────────────────────────────────
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

    // ─── Filter events by sede and permissions ───────────────────────────────
    let filteredEvents = sedeFilter
        ? events.filter((e) => String(e.extendedProps.sede_id) === String(sedeFilter))
        : events;

    if (!canCreate && user?.id) {
        filteredEvents = filteredEvents.filter(
            (e) => String(e.extendedProps.tecnico_id) === String(user.id)
        );
    }

    return (
        <div className="px-0 sm:px-6 lg:px-8 py-0 sm:py-6 space-y-4 sm:space-y-6">
            {/* ── Hero ── */}
            <div className="mx-4 sm:mx-0 mt-4 sm:mt-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-5 sm:p-8 shadow-2xl">
                <div className="absolute inset-0">
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-pink-400/20 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-row items-center gap-3 sm:gap-4">
                        <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex-shrink-0">
                            <CalendarDaysIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Agenda de Mantenimientos
                            </h1>
                            <p className="text-white/70 mt-1 text-xs sm:text-sm">
                                {isMobile 
                                    ? "Toca un día para agendar o ver horarios · Múltiples técnicos" 
                                    : "Haz clic en un día para ver su horario · Arrastra para agendar · Múltiples técnicos por sesión"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        {/* Sede filter */}
                        <div className="relative flex-1 sm:flex-initial">
                            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                            <select
                                value={sedeFilter}
                                onChange={(e) => setSedeFilter(e.target.value)}
                                className="w-full rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-white/40 appearance-none min-w-[140px] sm:min-w-[160px]"
                            >
                                <option value="" className="text-gray-900">Todas las sedes</option>
                                {sedes.map((s) => (
                                    <option key={s.id} value={s.id} className="text-gray-900">
                                        {s.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center flex-shrink-0">
                            <p className="text-xl sm:text-2xl font-bold text-white">{filteredEvents.length}</p>
                            <p className="text-xxs sm:text-xs text-white/70">Agendados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Calendar ── */}
            {isMobile ? (
                loading ? (
                    <div className="flex items-center justify-center py-24 bg-white border-t border-b border-gray-100">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                    </div>
                ) : (
                    <AgendaMantenimientoMobileView
                        events={filteredEvents}
                        canCreate={canCreate}
                        onEventClick={handleEventClick}
                        onNewEvent={handleNewEvent}
                    />
                )
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
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
                            // ── Interaction ──────────────────────────────────────
                            selectable={canCreate}
                            selectMirror={canCreate}
                            dateClick={handleDateClick}   // click single day → go to timeGridDay
                            select={handleDateSelect}      // drag selects range → open modal
                            eventClick={handleEventClick}
                            // ────────────────────────────────────────────────────
                            events={filteredEvents}
                            height="auto"
                            dayMaxEvents={3}
                            navLinks={true}               // number links also navigate to day view
                            navLinkDayClick={(date) => {
                                const calApi = calendarRef.current?.getApi();
                                calApi?.changeView('timeGridDay', date);
                            }}
                            buttonText={{
                                today: 'Hoy',
                                month: 'Mes',
                                week: 'Semana',
                                day: 'Día',
                            }}
                            eventDisplay="block"
                            allDayText="Todo el día"
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
                            slotMinTime="06:00:00"
                            slotMaxTime="21:00:00"
                            scrollTime="07:00:00"
                        />
                    )}
                </div>
            )}

            {/* ── Create Modal ── */}
            <AgendaMantenimientoCreateModal
                show={showModal}
                onClose={handleCloseModal}
                modalData={modalData}
                setModalData={setModalData}
                sedes={sedes}
                personas={personas}
                onCreate={handleCreate}
                creating={creating}
            />

            {/* ── Detail Modal ── */}
            <AgendaMantenimientoDetailModal
                show={showDetail}
                onClose={() => setShowDetail(false)}
                selectedEvent={selectedEvent}
                onDelete={handleDelete}
            />
        </div>
    );
}
