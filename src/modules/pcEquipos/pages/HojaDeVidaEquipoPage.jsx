import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pcEquiposService from '../services/pcEquiposService';
import {
    ArrowLeftIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    WrenchScrewdriverIcon,
    DocumentTextIcon,
    ClockIcon,
    TruckIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    MapPinIcon,
    UserIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const TABS = [
    { id: 'general', label: 'Info General', icon: ComputerDesktopIcon },
    { id: 'specs', label: 'Especificaciones', icon: CpuChipIcon },
    { id: 'licencias', label: 'Licencias', icon: ShieldCheckIcon },
    { id: 'entregas', label: 'Entregas', icon: TruckIcon },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: WrenchScrewdriverIcon },
];

export default function HojaDeVidaEquipoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await pcEquiposService.getHojaDeVida(id);
            setData(response.objeto || response);
        } catch (error) {
            console.error('Error loading hoja de vida:', error);
            Swal.fire('Error', 'No se pudo cargar la hoja de vida', 'error');
            navigate('/pc-equipos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Cargando hoja de vida...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const equipo = data.equipo;
    const mantoConfig = data.mantenimiento_config;
    const specs = equipo.caracteristicas_tecnicas;
    const licencias = equipo.licencias_software;

    const estadoColor = {
        operativo: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        mantenimiento: 'bg-amber-100 text-amber-800 border-amber-200',
        baja: 'bg-red-100 text-red-800 border-red-200',
    };

    // Maintenance countdown color
    const getMantoColor = () => {
        if (mantoConfig.dias_restantes === null) return 'gray';
        if (mantoConfig.dias_restantes <= 0) return 'red';
        if (mantoConfig.dias_restantes <= 30) return 'amber';
        return 'emerald';
    };
    const mantoColor = getMantoColor();

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            {/* Back button */}
            <button
                onClick={() => navigate('/pc-equipos')}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Volver a Equipos
            </button>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm mb-3">
                                <ComputerDesktopIcon className="h-3.5 w-3.5" />
                                HOJA DE VIDA
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                {equipo.nombre_equipo || `${equipo.marca} ${equipo.modelo}`}
                            </h1>
                            <p className="text-white/80 mt-2 text-lg">
                                {equipo.tipo && <span className="capitalize">{equipo.tipo}</span>}
                                {equipo.serial && <span> · SN: {equipo.serial}</span>}
                                {equipo.numero_inventario && <span> · AF: {equipo.numero_inventario}</span>}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${estadoColor[equipo.estado] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                {equipo.estado?.toUpperCase() || 'SIN ESTADO'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                <MapPinIcon className="h-3.5 w-3.5" /> Sede
                            </div>
                            <p className="font-semibold truncate">{equipo.sede?.nombre || 'N/A'}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                <DocumentTextIcon className="h-3.5 w-3.5" /> Área
                            </div>
                            <p className="font-semibold truncate">{equipo.area?.nombre || 'N/A'}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                <UserIcon className="h-3.5 w-3.5" /> Responsable
                            </div>
                            <p className="font-semibold truncate">{equipo.responsable?.nombre_completo || 'N/A'}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                <ClockIcon className="h-3.5 w-3.5" /> Próx. Mantenimiento
                            </div>
                            <p className={`font-bold ${mantoConfig.dias_restantes !== null && mantoConfig.dias_restantes <= 0 ? 'text-red-200' : ''}`}>
                                {mantoConfig.dias_restantes !== null
                                    ? mantoConfig.dias_restantes <= 0
                                        ? `¡Vencido hace ${Math.abs(mantoConfig.dias_restantes)} días!`
                                        : `${mantoConfig.dias_restantes} días`
                                    : 'Sin registro'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-4 overflow-x-auto">
                    <nav className="flex gap-1 -mb-px" aria-label="Tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'general' && <TabGeneral equipo={equipo} />}
                    {activeTab === 'specs' && <TabSpecs specs={specs} />}
                    {activeTab === 'licencias' && <TabLicencias licencias={licencias} />}
                    {activeTab === 'entregas' && <TabEntregas entregas={equipo.entregas} />}
                    {activeTab === 'mantenimiento' && <TabMantenimiento mantenimientos={equipo.mantenimientos} config={mantoConfig} />}
                </div>
            </div>
        </div>
    );
}

/* ─── TAB: Info General ──────────────────── */
function TabGeneral({ equipo }) {
    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between py-3 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right">{value || '—'}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ComputerDesktopIcon className="h-5 w-5 text-blue-500" />
                    Identificación
                </h3>
                <div className="bg-gray-50/50 rounded-xl p-4">
                    <InfoRow label="Nombre" value={equipo.nombre_equipo} />
                    <InfoRow label="Marca" value={equipo.marca} />
                    <InfoRow label="Modelo" value={equipo.modelo} />
                    <InfoRow label="Serial" value={equipo.serial} />
                    <InfoRow label="Nº Inventario" value={equipo.numero_inventario} />
                    <InfoRow label="Tipo" value={equipo.tipo} />
                    <InfoRow label="IP Fija" value={equipo.ip_fija} />
                    <InfoRow label="Propiedad" value={equipo.propiedad} />
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-cyan-500" />
                    Detalles
                </h3>
                <div className="bg-gray-50/50 rounded-xl p-4">
                    <InfoRow label="Sede" value={equipo.sede?.nombre} />
                    <InfoRow label="Área" value={equipo.area?.nombre} />
                    <InfoRow label="Responsable" value={equipo.responsable?.nombre_completo} />
                    <InfoRow label="Fecha Ingreso" value={equipo.fecha_ingreso} />
                    <InfoRow label="Fecha Entrega" value={equipo.fecha_entrega} />
                    <InfoRow label="Garantía" value={equipo.garantia_meses ? `${equipo.garantia_meses} meses` : null} />
                    <InfoRow label="Forma Adquisición" value={equipo.forma_adquisicion} />
                    <InfoRow label="Creado por" value={equipo.creador?.nombre_completo || equipo.creador?.usuario} />
                </div>
            </div>
            {(equipo.descripcion_general || equipo.observaciones || equipo.repuestos_principales || equipo.recomendaciones || equipo.equipos_adicionales) && (
                <div className="md:col-span-2 space-y-4">
                    {equipo.descripcion_general && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-blue-800 mb-2">Descripción General</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{equipo.descripcion_general}</p>
                        </div>
                    )}
                    {equipo.observaciones && (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-amber-800 mb-2">Observaciones</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{equipo.observaciones}</p>
                        </div>
                    )}
                    {equipo.repuestos_principales && (
                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Repuestos Principales</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{equipo.repuestos_principales}</p>
                        </div>
                    )}
                    {equipo.recomendaciones && (
                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Recomendaciones</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{equipo.recomendaciones}</p>
                        </div>
                    )}
                    {equipo.equipos_adicionales && (
                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Equipos Adicionales</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{equipo.equipos_adicionales}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── TAB: Especificaciones Técnicas ──────── */
function TabSpecs({ specs }) {
    if (!specs) {
        return (
            <div className="text-center py-16 text-gray-400">
                <CpuChipIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sin especificaciones registradas</p>
            </div>
        );
    }

    const SpecCard = ({ label, value, highlight }) => (
        <div className={`rounded-xl p-4 border ${highlight ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-100'}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-sm font-semibold ${highlight ? 'text-blue-900' : 'text-gray-900'}`}>{value || '—'}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CpuChipIcon className="h-5 w-5 text-blue-500" />
                Hardware
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <SpecCard label="Procesador" value={specs.procesador} highlight />
                <SpecCard label="Memoria RAM" value={specs.memoria_ram} highlight />
                <SpecCard label="Disco Duro" value={specs.disco_duro} highlight />
                <SpecCard label="Capacidad Disco" value={specs.capacidad_disco} />
                <SpecCard label="Tarjeta Video" value={specs.tarjeta_video} />
                <SpecCard label="Tarjeta Red" value={specs.tarjeta_red} />
                <SpecCard label="Tarjeta Sonido" value={specs.tarjeta_sonido} />
                <SpecCard label="USB" value={specs.usb} />
                <SpecCard label="Unidad CD" value={specs.unidad_cd} />
                <SpecCard label="Parlantes" value={specs.parlantes} />
                <SpecCard label="Drive" value={specs.drive} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mt-8">
                <DocumentTextIcon className="h-5 w-5 text-cyan-500" />
                Periféricos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <SpecCard label="Monitor" value={specs.monitor} />
                <SpecCard label="Teclado" value={specs.teclado} />
                <SpecCard label="Mouse" value={specs.mouse} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mt-8">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-500" />
                Conectividad
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <SpecCard label="Internet" value={specs.internet} />
                <SpecCard label="Velocidad Red" value={specs.velocidad_red} />
            </div>
        </div>
    );
}

/* ─── TAB: Licencias ──────────────────────── */
function TabLicencias({ licencias }) {
    if (!licencias) {
        return (
            <div className="text-center py-16 text-gray-400">
                <ShieldCheckIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sin licencias registradas</p>
            </div>
        );
    }

    const LicCard = ({ name, value, color }) => {
        const hasLicense = value && value !== 'N/A' && value !== 'No';
        return (
            <div className={`rounded-2xl p-6 border-2 transition-all ${hasLicense
                ? `border-${color}-200 bg-${color}-50/50`
                : 'border-gray-100 bg-gray-50/30'
                }`}>
                <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-bold text-lg ${hasLicense ? `text-${color}-800` : 'text-gray-400'}`}>{name}</h4>
                    {hasLicense ? (
                        <CheckCircleIcon className={`h-6 w-6 text-${color}-500`} />
                    ) : (
                        <ExclamationTriangleIcon className="h-6 w-6 text-gray-300" />
                    )}
                </div>
                <p className={`text-sm ${hasLicense ? 'text-gray-700' : 'text-gray-400'}`}>
                    {hasLicense ? value : 'No registrada'}
                </p>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LicCard name="Windows" value={licencias.windows} color="blue" />
            <LicCard name="Office" value={licencias.office} color="orange" />
            <LicCard name="Nitro PDF" value={licencias.nitro} color="purple" />
        </div>
    );
}

/* ─── TAB: Entregas ───────────────────────── */
function TabEntregas({ entregas }) {
    if (!entregas || entregas.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <TruckIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sin entregas registradas</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-blue-500" />
                Historial de Entregas ({entregas.length})
            </h3>
            <div className="space-y-3">
                {entregas.map((e, idx) => (
                    <div key={e.id || idx} className={`rounded-xl p-5 border transition-all ${e.devolucion ? 'border-gray-200 bg-gray-50/50' : 'border-blue-200 bg-blue-50/30'
                        }`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${e.devolucion ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    <TruckIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {e.funcionario?.nombre || 'Funcionario no disponible'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Entregado: {e.fecha_entrega || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${e.devolucion
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                    {e.devolucion ? 'Devuelto' : 'Activo'}
                                </span>
                                {e.estado && (
                                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                                        {e.estado}
                                    </span>
                                )}
                            </div>
                        </div>
                        {e.devolucion && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    <span className="font-medium">Devuelto:</span> {e.devolucion.fecha_devolucion || 'N/A'}
                                    {e.devolucion.observaciones && (
                                        <span> — {e.devolucion.observaciones}</span>
                                    )}
                                </p>
                            </div>
                        )}
                        {e.perifericos && e.perifericos.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs font-medium text-gray-500 mb-1">Periféricos entregados:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {e.perifericos.map((p, i) => (
                                        <span key={i} className="inline-flex px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
                                            {p.nombre || p.tipo || `Periférico ${i + 1}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── TAB: Mantenimiento ──────────────────── */
function TabMantenimiento({ mantenimientos, config }) {
    const colorMap = {
        red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500', ring: 'ring-red-500', fill: 'bg-red-500' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-500', ring: 'ring-amber-500', fill: 'bg-amber-500' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-500', ring: 'ring-emerald-500', fill: 'bg-emerald-500' },
        gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: 'text-gray-400', ring: 'ring-gray-400', fill: 'bg-gray-400' },
    };

    const getColor = () => {
        if (config.dias_restantes === null) return 'gray';
        if (config.dias_restantes <= 0) return 'red';
        if (config.dias_restantes <= 30) return 'amber';
        return 'emerald';
    };
    const c = colorMap[getColor()];

    // Progress ring (0–100%)
    const progress = config.dias_restantes !== null
        ? Math.max(0, Math.min(100, (config.dias_restantes / config.dias_cumplimiento) * 100))
        : 0;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="space-y-6">
            {/* Countdown Card */}
            <div className={`rounded-2xl p-6 border-2 ${c.border} ${c.bg}`}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Progress Ring */}
                    <div className="relative flex-shrink-0">
                        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200" />
                            <circle
                                cx="50" cy="50" r="45" fill="none" strokeWidth="6" strokeLinecap="round"
                                className={c.icon}
                                stroke="currentColor"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-2xl font-extrabold ${c.text}`}>
                                {config.dias_restantes !== null ? config.dias_restantes : '?'}
                            </span>
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h3 className={`text-xl font-bold ${c.text}`}>
                            {config.dias_restantes !== null
                                ? config.dias_restantes <= 0
                                    ? '¡Mantenimiento Vencido!'
                                    : config.dias_restantes <= 30
                                        ? 'Mantenimiento Próximo'
                                        : 'Mantenimiento al Día'
                                : 'Sin Mantenimiento Registrado'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {config.dias_restantes !== null
                                ? `Ciclo de ${config.dias_cumplimiento} días · Próximo: ${config.fecha_proximo_mantenimiento || 'N/A'}`
                                : 'No se ha registrado ningún mantenimiento para este equipo.'}
                        </p>
                        {config.fecha_ultimo_mantenimiento && (
                            <p className="text-xs text-gray-400 mt-1">
                                Último mantenimiento: {config.fecha_ultimo_mantenimiento}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Maintenance History */}
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <WrenchScrewdriverIcon className="h-5 w-5 text-blue-500" />
                Historial de Mantenimientos ({mantenimientos?.length || 0})
            </h3>

            {(!mantenimientos || mantenimientos.length === 0) ? (
                <div className="text-center py-12 text-gray-400">
                    <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Sin mantenimientos registrados</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Responsable</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Repuesto</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Costo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mantenimientos.map((m, idx) => (
                                <tr key={m.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                        {m.fecha || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${m.tipo_mantenimiento === 'preventivo'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {m.tipo_mantenimiento || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                                        {m.descripcion || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                        {m.responsable_mantenimiento || m.empresa_responsable?.nombre || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {m.repuesto ? (
                                            <span className="text-emerald-700">
                                                {m.nombre_repuesto || 'Sí'} {m.cantidad_repuesto ? `(×${m.cantidad_repuesto})` : ''}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">No</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                                        {m.costo_repuesto ? `$${Number(m.costo_repuesto).toLocaleString()}` : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
