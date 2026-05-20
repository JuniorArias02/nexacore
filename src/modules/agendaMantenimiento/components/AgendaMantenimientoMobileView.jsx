import { useState, useMemo } from 'react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    MapPinIcon,
    UserIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

// ─── Mini strip calendar (week row) ──────────────────────────────────────────

function WeekStrip({ currentDate, selectedDate, onSelectDate, events }) {
    // Show 7 days centered around selectedDate
    const days = useMemo(() => {
        const result = [];
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay()); // go to Sunday of selected week
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            result.push(d);
        }
        return result;
    }, [selectedDate]);

    const hasEvent = (date) =>
        events.some((ev) => {
            const start = new Date(ev.start);
            const end = ev.end ? new Date(ev.end) : start;
            return date >= startOfDay(start) && date <= startOfDay(end);
        });

    return (
        <div className="flex justify-between items-center gap-1 py-2">
            {days.map((d, i) => {
                const isToday = isSameDay(d, new Date());
                const isSelected = isSameDay(d, selectedDate);
                const hasDot = hasEvent(d);
                return (
                    <button
                        key={i}
                        onClick={() => onSelectDate(new Date(d))}
                        className="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all"
                        style={{
                            background: isSelected
                                ? '#4f46e5'
                                : isToday
                                ? 'rgba(79,70,229,0.1)'
                                : 'transparent',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                color: isSelected ? 'rgba(255,255,255,0.8)' : '#94a3b8',
                                textTransform: 'uppercase',
                            }}
                        >
                            {DAYS_SHORT[d.getDay()]}
                        </span>
                        <span
                            style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: isSelected ? '#fff' : isToday ? '#4f46e5' : '#1e293b',
                            }}
                        >
                            {d.getDate()}
                        </span>
                        {hasDot && (
                            <span
                                style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    background: isSelected ? 'rgba(255,255,255,0.8)' : '#4f46e5',
                                    display: 'block',
                                }}
                            />
                        )}
                        {!hasDot && <span style={{ width: 5, height: 5, display: 'block' }} />}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event, onEventClick }) {
    const props = event.extendedProps || {};
    const sede = props.sede?.nombre || props.sede_nombre || '';
    const tecnico = props.tecnico
        ? `${props.tecnico.nombre ?? ''} ${props.tecnico.apellido ?? ''}`.trim()
        : '';

    return (
        <button
            onClick={() => onEventClick({ event: { id: event.id, title: event.title, start: new Date(event.start), end: event.end ? new Date(event.end) : null, extendedProps: props } })}
            className="w-full text-left"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
            <div
                style={{
                    borderLeft: `4px solid ${event.backgroundColor || '#4f46e5'}`,
                    background: `${event.backgroundColor || '#4f46e5'}12`,
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    transition: 'background 0.15s',
                }}
            >
                {/* Title */}
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.3rem' }}>
                    {event.title}
                </p>

                {/* Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                    <ClockIcon style={{ width: 13, height: 13, flexShrink: 0 }} />
                    <span>
                        {formatTime(event.start)}
                        {event.end ? ` → ${formatTime(event.end)}` : ''}
                    </span>
                </div>

                {/* Sede */}
                {sede && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                        <MapPinIcon style={{ width: 13, height: 13, flexShrink: 0 }} />
                        <span>{sede}</span>
                    </div>
                )}

                {/* Técnico */}
                {tecnico && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.78rem' }}>
                        <UserIcon style={{ width: 13, height: 13, flexShrink: 0 }} />
                        <span>{tecnico}</span>
                    </div>
                )}
            </div>
        </button>
    );
}

// ─── Main mobile view ─────────────────────────────────────────────────────────

export default function AgendaMantenimientoMobileView({
    events,
    canCreate,
    onEventClick,
    onNewEvent,
}) {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month' | 'day'
    const [monthOffset, setMonthOffset] = useState(0); // for month picker navigation

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + monthOffset;
    const displayYear = currentYear + Math.floor(currentMonth / 12);
    const displayMonth = ((currentMonth % 12) + 12) % 12;

    // ── Events for the selected day ───────────────────────────────────────────
    const dayEvents = useMemo(() => {
        return events.filter((ev) => {
            const start = new Date(ev.start);
            const end = ev.end ? new Date(ev.end) : start;
            const sel = startOfDay(selectedDate);
            return sel >= startOfDay(start) && sel <= startOfDay(end);
        });
    }, [events, selectedDate]);

    // ── Mini month grid ───────────────────────────────────────────────────────
    const monthGrid = useMemo(() => {
        const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
        const daysCount = getDaysInMonth(displayYear, displayMonth);
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysCount; d++) {
            cells.push(new Date(displayYear, displayMonth, d));
        }
        return cells;
    }, [displayYear, displayMonth]);

    const hasEvent = (date) => {
        if (!date) return false;
        return events.some((ev) => {
            const start = new Date(ev.start);
            const end = ev.end ? new Date(ev.end) : start;
            return date >= startOfDay(start) && date <= startOfDay(end);
        });
    };

    // ── Handle new event tap (open modal with just the date) ─────────────────
    const handleNewEventForDay = () => {
        if (!canCreate || !onNewEvent) return;
        const start = new Date(selectedDate);
        start.setHours(8, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(9, 0, 0, 0);
        onNewEvent(start.toISOString(), end.toISOString());
    };

    return (
        <div style={{ background: '#fff', borderRadius: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>

            {/* ── Top bar: month/year + view toggle ── */}
            <div style={{ padding: '1rem 1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    {/* Month navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={() => setMonthOffset((o) => o - 1)}
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.3rem', display: 'flex', cursor: 'pointer' }}
                        >
                            <ChevronLeftIcon style={{ width: 16, height: 16, color: '#475569' }} />
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b', minWidth: 140, textAlign: 'center' }}>
                            {MONTHS_ES[displayMonth]} {displayYear}
                        </span>
                        <button
                            onClick={() => setMonthOffset((o) => o + 1)}
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.3rem', display: 'flex', cursor: 'pointer' }}
                        >
                            <ChevronRightIcon style={{ width: 16, height: 16, color: '#475569' }} />
                        </button>
                    </div>

                    {/* View toggle */}
                    <div style={{ display: 'flex', gap: '0.25rem', background: '#f8fafc', borderRadius: '0.75rem', padding: '0.25rem', border: '1px solid #e2e8f0' }}>
                        {[
                            { key: 'month', label: 'Mes' },
                            { key: 'week', label: 'Sem' },
                            { key: 'day', label: 'Día' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key)}
                                style={{
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    background: viewMode === key ? '#4f46e5' : 'transparent',
                                    color: viewMode === key ? '#fff' : '#64748b',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Week strip (sem view) ── */}
                {viewMode === 'week' && (
                    <WeekStrip
                        currentDate={today}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        events={events}
                    />
                )}

                {/* ── Month mini-grid ── */}
                {viewMode === 'month' && (
                    <div>
                        {/* Day headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.25rem' }}>
                            {DAYS_SHORT.map((d) => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '0.25rem 0' }}>
                                    {d}
                                </div>
                            ))}
                        </div>
                        {/* Day cells */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.15rem', marginBottom: '0.75rem' }}>
                            {monthGrid.map((date, idx) => {
                                if (!date) return <div key={`empty-${idx}`} />;
                                const isToday = isSameDay(date, today);
                                const isSelected = isSameDay(date, selectedDate);
                                const hasDot = hasEvent(date);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => { setSelectedDate(new Date(date)); setViewMode('day'); }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            padding: '0.3rem 0.1rem',
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: isSelected ? '#4f46e5' : isToday ? 'rgba(79,70,229,0.1)' : 'transparent',
                                            gap: '0.15rem',
                                        }}
                                    >
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#fff' : isToday ? '#4f46e5' : '#1e293b' }}>
                                            {date.getDate()}
                                        </span>
                                        <span style={{
                                            width: 4, height: 4, borderRadius: '50%',
                                            background: hasDot ? (isSelected ? 'rgba(255,255,255,0.8)' : '#4f46e5') : 'transparent',
                                            display: 'block',
                                        }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Day view: just show selected date label ── */}
                {viewMode === 'day' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
                        <button
                            onClick={() => {
                                const d = new Date(selectedDate);
                                d.setDate(d.getDate() - 1);
                                setSelectedDate(d);
                            }}
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.3rem', display: 'flex', cursor: 'pointer' }}
                        >
                            <ChevronLeftIcon style={{ width: 16, height: 16, color: '#475569' }} />
                        </button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                            {DAYS_SHORT[selectedDate.getDay()]}, {selectedDate.getDate()} de {MONTHS_ES[selectedDate.getMonth()]}
                        </span>
                        <button
                            onClick={() => {
                                const d = new Date(selectedDate);
                                d.setDate(d.getDate() + 1);
                                setSelectedDate(d);
                            }}
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.3rem', display: 'flex', cursor: 'pointer' }}
                        >
                            <ChevronRightIcon style={{ width: 16, height: 16, color: '#475569' }} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, background: '#f1f5f9', margin: '0 1rem' }} />

            {/* ── Selected day events list ── */}
            <div style={{ padding: '1rem' }}>
                {/* Day label for week/month view */}
                {viewMode !== 'day' && (
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                        {DAYS_SHORT[selectedDate.getDay()]}, {selectedDate.getDate()} de {MONTHS_ES[selectedDate.getMonth()]}
                    </p>
                )}

                {dayEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>
                            Sin agendamientos para este día
                        </p>
                        {canCreate && (
                            <button
                                onClick={handleNewEventForDay}
                                style={{
                                    marginTop: '1rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    padding: '0.55rem 1.1rem',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                }}
                            >
                                <PlusIcon style={{ width: 14, height: 14 }} />
                                Nuevo agendamiento
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {dayEvents.map((ev) => (
                            <EventCard key={ev.id} event={ev} onEventClick={onEventClick} />
                        ))}
                        {canCreate && (
                            <button
                                onClick={handleNewEventForDay}
                                style={{
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    padding: '0.5rem 1rem',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    width: '100%',
                                    justifyContent: 'center',
                                }}
                            >
                                <PlusIcon style={{ width: 14, height: 14 }} />
                                Agregar en este día
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
