import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pcEquiposService from '../services/pcEquiposService';
import {
    ArrowLeftIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    WrenchScrewdriverIcon,
    DocumentTextIcon,
    TruckIcon,
    ShieldCheckIcon,
    MapPinIcon,
    CalendarDaysIcon,
    UserIcon,
    ClockIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

// Componentes modulares
import TabGeneral from '../components/hojaDeVida/TabGeneral';
import TabSpecs from '../components/hojaDeVida/TabSpecs';
import TabLicencias from '../components/hojaDeVida/TabLicencias';
import TabEntregas from '../components/hojaDeVida/TabEntregas';
import TabDevoluciones from '../components/hojaDeVida/TabDevoluciones';
import TabMantenimiento from '../components/hojaDeVida/TabMantenimiento';

const TABS = [
    { id: 'general', label: 'Info General', icon: ComputerDesktopIcon },
    { id: 'specs', label: 'Especificaciones', icon: CpuChipIcon },
    { id: 'licencias', label: 'Licencias', icon: ShieldCheckIcon },
    { id: 'entregas', label: 'Entregas', icon: TruckIcon },
    { id: 'devoluciones', label: 'Devoluciones', icon: ArrowPathIcon },
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
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600"></div>
                    <CpuChipIcon className="h-8 w-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Sincronizando Hoja de Vida...</p>
            </div>
        );
    }

    if (!data) return null;

    const equipo = data.equipo;
    const mantoConfig = data.mantenimiento_config;
    const specs = equipo.caracteristicas_tecnicas;
    const licencias = equipo.licencias_software;

    const estadoConfig = {
        operativo: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500', border: 'border-emerald-500/20' },
        mantenimiento: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-500', border: 'border-amber-500/20' },
        baja: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-500', border: 'border-red-500/20' },
    };

    const currentEstado = estadoConfig[equipo.estado] || estadoConfig.mantenimiento;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Back Nav */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/pc-equipos')}
                    className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 font-bold text-xs uppercase tracking-widest"
                >
                    <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inventario
                </button>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-12 group">
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                                HOJA DE VIDA TÉCNICA
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                                {equipo.nombre_equipo || `${equipo.marca} ${equipo.modelo}`}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-indigo-100 font-medium">
                                {equipo.tipo && (
                                    <span className="capitalize px-2.5 py-0.5 bg-white/10 rounded-lg text-sm">
                                        {equipo.tipo}
                                    </span>
                                )}
                                {equipo.serial && (
                                    <span className="flex items-center gap-1.5 text-sm opacity-80">
                                        <div className="w-1 h-1 rounded-full bg-indigo-300"></div>
                                        SN: <span className="font-bold text-white">{equipo.serial}</span>
                                    </span>
                                )}
                                {equipo.numero_inventario && (
                                    <span className="flex items-center gap-1.5 text-sm opacity-80">
                                        <div className="w-1 h-1 rounded-full bg-indigo-300"></div>
                                        AF: <span className="font-bold text-white">{equipo.numero_inventario}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest backdrop-blur-md border ${currentEstado.bg} ${currentEstado.text} ${currentEstado.border} shadow-lg shadow-black/10`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${currentEstado.dot} animate-pulse`}></span>
                                {equipo.estado || 'SIN ESTADO'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                        <div className="group/stat bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center gap-3 text-white/60 text-[9px] font-black uppercase tracking-widest mb-3">
                                <div className="p-1.5 bg-white/10 rounded-lg">
                                    <MapPinIcon className="h-3.5 w-3.5 text-indigo-200" />
                                </div>
                                Ubicación / Sede
                            </div>
                            <p className="text-base font-bold text-white leading-tight">
                                {equipo.sede?.nombre || 'No Asignada'}
                            </p>
                        </div>

                        <div className="group/stat bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center gap-3 text-white/60 text-[9px] font-black uppercase tracking-widest mb-3">
                                <div className="p-1.5 bg-white/10 rounded-lg">
                                    <DocumentTextIcon className="h-3.5 w-3.5 text-indigo-200" />
                                </div>
                                Departamento / Área
                            </div>
                            <p className="text-base font-bold text-white leading-tight">
                                {equipo.area?.nombre || 'General'}
                            </p>
                        </div>

                        <div className="group/stat bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center gap-3 text-white/60 text-[9px] font-black uppercase tracking-widest mb-3">
                                <div className="p-1.5 bg-white/10 rounded-lg">
                                    <UserIcon className="h-3.5 w-3.5 text-indigo-200" />
                                </div>
                                Responsable Directo
                            </div>
                            <p className="text-base font-bold text-white leading-tight truncate">
                                {equipo.responsable?.nombre_completo || 'Sin Asignar'}
                            </p>
                        </div>

                        <div className={`group/stat backdrop-blur-md rounded-[1.5rem] p-5 border transition-all duration-300 hover:scale-[1.02] ${
                            mantoConfig.dias_restantes !== null && mantoConfig.dias_restantes <= 0 
                                ? 'bg-red-500/20 border-red-500/30' 
                                : 'bg-white/10 border-white/10 hover:bg-white/15'
                        }`}>
                            <div className="flex items-center gap-3 text-white/60 text-[9px] font-black uppercase tracking-widest mb-3">
                                <div className={`p-1.5 rounded-lg ${
                                    mantoConfig.dias_restantes !== null && mantoConfig.dias_restantes <= 0 
                                        ? 'bg-red-500/20' 
                                        : 'bg-white/10'
                                }`}>
                                    <ClockIcon className={`h-3.5 w-3.5 ${
                                        mantoConfig.dias_restantes !== null && mantoConfig.dias_restantes <= 0 
                                            ? 'text-red-300' 
                                            : 'text-indigo-200'
                                    }`} />
                                </div>
                                Próx. Mantenimiento
                            </div>
                            <p className={`text-base font-black leading-tight ${
                                mantoConfig.dias_restantes !== null && mantoConfig.dias_restantes <= 0 
                                    ? 'text-red-200' 
                                    : 'text-white'
                            }`}>
                                {mantoConfig.dias_restantes !== null
                                    ? mantoConfig.dias_restantes <= 0
                                        ? `¡Vencido (${Math.abs(mantoConfig.dias_restantes)}d)!`
                                        : `${mantoConfig.dias_restantes} días`
                                    : 'Sin definir'}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Decorative Icon */}
                <ComputerDesktopIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-28 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
                <div className="border-b border-slate-100 px-6 overflow-x-auto custom-scrollbar">
                    <nav className="flex gap-8 -mb-px" aria-label="Tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group flex items-center gap-2.5 px-2 py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                                    }`}
                            >
                                <tab.icon className={`h-4 w-4 transition-colors ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="animate-fade-in">
                {activeTab === 'general' && <TabGeneral equipo={equipo} />}
                {activeTab === 'specs' && <TabSpecs specs={specs} />}
                {activeTab === 'licencias' && <TabLicencias licencias={licencias} />}
                {activeTab === 'entregas' && <TabEntregas entregas={equipo.entregas} />}
                {activeTab === 'devoluciones' && <TabDevoluciones entregas={equipo.entregas} />}
                {activeTab === 'mantenimiento' && <TabMantenimiento mantenimientos={equipo.mantenimientos} config={mantoConfig} />}
            </div>
        </div>
    );
}
