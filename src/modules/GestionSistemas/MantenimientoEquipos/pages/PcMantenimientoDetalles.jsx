import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcMantenimientoService from '../services/pcMantenimientoService';
import {
    ArrowLeftIcon,
    CalendarIcon,
    ComputerDesktopIcon,
    WrenchScrewdriverIcon,
    BuildingOfficeIcon,
    TagIcon,
    UserIcon,
    MapPinIcon,
    CpuChipIcon,
    SparklesIcon,
    CubeIcon,
    CurrencyDollarIcon,
    CheckBadgeIcon,
    ClockIcon,
    ChatBubbleBottomCenterTextIcon,
    PencilSquareIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function PcMantenimientoDetalles() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [mantenimiento, setMantenimiento] = useState(null);

    useEffect(() => {
        const loadMantenimiento = async () => {
            try {
                setLoading(true);
                const response = await pcMantenimientoService.getById(id);
                setMantenimiento(response);
            } catch (error) {
                console.error("Error loading maintenance details:", error);
                Swal.fire('Error', 'No se pudo cargar el detalle del mantenimiento', 'error');
                navigate('/gestion-sistemas/pc-mantenimientos');
            } finally {
                setLoading(false);
            }
        };

        loadMantenimiento();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-24">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <WrenchScrewdriverIcon className="absolute inset-0 m-auto h-6 w-6 text-indigo-600 animate-pulse" />
                </div>
                <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Cargando Ficha Técnica...</span>
            </div>
        );
    }

    if (!mantenimiento) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                <h2 className="text-xl font-black text-slate-800 uppercase">Mantenimiento no encontrado</h2>
                <Link to="/gestion-sistemas/pc-mantenimientos" className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                    Volver al listado
                </Link>
            </div>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 animate-fade-in-up font-sans">
            {/* Navigation back */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    to="/gestion-sistemas/pc-mantenimientos"
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </div>
                    Volver al listado
                </Link>
            </div>

            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                            FICHA TÉCNICA
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                            Mantenimiento #{mantenimiento.id}
                        </h1>
                        <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                            Ficha de inspección técnica, control de limpieza, repuestos y registro de firmas.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to={`/gestion-sistemas/pc-mantenimientos/editar/${mantenimiento.id}`}
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-indigo-950/10 hover:bg-indigo-50 transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5 stroke-[2.5]" />
                            Editar Ficha
                        </Link>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-[100px] pointer-events-none"></div>
                <WrenchScrewdriverIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Maintenance Info & Details (2/3 columns) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Maintenance Information */}
                    <div className="bg-white border border-slate-50 shadow-xl rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4 flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <WrenchScrewdriverIcon className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Detalles de Intervención</h2>
                            </div>
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                mantenimiento.estado === 'completado'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                                {mantenimiento.estado === 'completado' ? (
                                    <CheckBadgeIcon className="h-3 w-3 mr-1.5" />
                                ) : (
                                    <ClockIcon className="h-3 w-3 mr-1.5" />
                                )}
                                {mantenimiento.estado}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tipo de Mantenimiento</span>
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100/50 rounded-xl px-4 py-3 w-fit">
                                    <span className={`h-2 w-2 rounded-full ${mantenimiento.tipo_mantenimiento === 'preventivo' ? 'bg-teal-500' : 'bg-orange-500'}`}></span>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-700">{mantenimiento.tipo_mantenimiento}</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fecha de Ejecución</span>
                                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100/50 rounded-xl px-4 py-3 w-fit">
                                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-bold">
                                        {mantenimiento.fecha ? new Date(mantenimiento.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha pendiente'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Technical Description */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2">
                                <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Descripción de Acciones</span>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                {mantenimiento.descripcion || 'Sin descripción detallada registrada.'}
                            </div>
                        </div>

                        {/* External Responsible Company */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Empresa Ejecutora</span>
                                <span className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                                    <BuildingOfficeIcon className="h-4 w-4 text-indigo-500" />
                                    {mantenimiento.empresa_responsable?.nombre || 'Sistemas (Interno / Propio)'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Técnico Encargado</span>
                                <span className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-indigo-500" />
                                    {mantenimiento.creador.nombre_completo || 'Técnico NexaCore'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cleaning Checklist Card */}
                    <div className="bg-white border border-slate-50 shadow-xl rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                            <SparklesIcon className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Limpieza de Componentes Realizada</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {[
                                { id: 'cpu', label: 'CPU' },
                                { id: 'pantalla', label: 'Pantalla' },
                                { id: 'teclado', label: 'Teclado' },
                                { id: 'mouse', label: 'Mouse' },
                                { id: 'unidad_cd', label: 'Unidad CD' }
                            ].map((item) => {
                                const isCleaned = !!mantenimiento[item.id];
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                                            isCleaned
                                                ? 'border-green-200 bg-green-50/30 text-green-700 shadow-sm shadow-green-50'
                                                : 'border-slate-100 bg-slate-50/50 text-slate-400'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                            isCleaned ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {isCleaned ? (
                                                <CheckCircleIcon className="w-5 h-5 stroke-[2.5]" />
                                            ) : (
                                                <ClockIcon className="w-5 h-5 stroke-[2]" />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-center">{item.label}</span>
                                        <span className="text-[9px] font-bold mt-1 uppercase tracking-widest opacity-80">
                                            {isCleaned ? 'Realizada' : 'No requerida'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Spare Parts Information Card */}
                    <div className="bg-white border border-slate-50 shadow-xl rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-2">
                                <CubeIcon className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Repuestos Utilizados</h2>
                            </div>
                        </div>

                        {mantenimiento.repuesto ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100/30">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Repuesto</span>
                                    <p className="text-sm font-black text-indigo-900 uppercase">{mantenimiento.nombre_repuesto || '---'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Cantidad y Valor Unitario</span>
                                    <p className="text-sm font-bold text-slate-700">
                                        {mantenimiento.cantidad_repuesto} unid. x {formatCurrency(mantenimiento.costo_repuesto)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Costo Total Repuestos</span>
                                    <p className="text-sm font-black text-green-700 flex items-center gap-1">
                                        <CurrencyDollarIcon className="h-4 w-4" />
                                        {formatCurrency(mantenimiento.cantidad_repuesto * mantenimiento.costo_repuesto)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium text-sm">
                                No se utilizaron ni cambiaron repuestos durante esta intervención.
                            </div>
                        )}
                    </div>

                    {/* Signatures & Cierre Validation */}
                    <div className="bg-white border border-slate-50 shadow-xl rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                            <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Firmas de Validación</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Systems Tech Signature */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Firma Técnico de Sistemas</h3>
                                {mantenimiento.firma_sistemas ? (
                                    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center min-h-[160px]">
                                        <img
                                            src={mantenimiento.firma_sistemas.startsWith('http')
                                                ? mantenimiento.firma_sistemas
                                                : `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${mantenimiento.firma_sistemas}`
                                            }
                                            alt="Firma Técnico"
                                            className="h-28 object-contain mix-blend-multiply transition-transform hover:scale-105"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                                            {mantenimiento.creador?.nombre_completo || 'Técnico de Sistemas'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 min-h-[160px] flex flex-col items-center justify-center">
                                        <ClockIcon className="h-10 w-10 text-slate-300 mb-2" />
                                        <p className="text-xs font-bold">Firma no registrada</p>
                                    </div>
                                )}
                            </div>

                            {/* Staff Member Signature */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Firma Funcionario Responsable</h3>
                                {mantenimiento.firma_personal_cargo ? (
                                    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center min-h-[160px]">
                                        <img
                                            src={mantenimiento.firma_personal_cargo.startsWith('http')
                                                ? mantenimiento.firma_personal_cargo
                                                : `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${mantenimiento.firma_personal_cargo}`
                                            }
                                            alt="Firma Funcionario"
                                            className="h-28 object-contain mix-blend-multiply transition-transform hover:scale-105"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                                            {mantenimiento.equipo?.responsable?.nombre_completo || 'Personal Asignado'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 min-h-[160px] flex flex-col items-center justify-center">
                                        <ClockIcon className="h-10 w-10 text-slate-300 mb-2" />
                                        <p className="text-xs font-bold">Firma no registrada / Pendiente</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: PC Equipment & Technical Specs (1/3 column) */}
                <div className="space-y-8">
                    {/* PC General Specs Card */}
                    <div className="bg-white border border-slate-50 shadow-xl rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                            <ComputerDesktopIcon className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Datos del Equipo</h2>
                        </div>

                        {mantenimiento.equipo ? (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nombre de Red</span>
                                        <p className="text-sm font-black text-slate-900 uppercase">{mantenimiento.equipo.nombre_equipo || '---'}</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Marca / Modelo</span>
                                        <p className="text-sm font-bold text-slate-700 uppercase flex items-center gap-1.5">
                                            <TagIcon className="h-4 w-4 text-slate-400" />
                                            {mantenimiento.equipo.marca} {mantenimiento.equipo.modelo}
                                        </p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Serial del Chasis</span>
                                        <p className="text-sm font-bold text-slate-700 uppercase">{mantenimiento.equipo.serial || '---'}</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Número de Inventario</span>
                                        <p className="text-sm font-bold text-indigo-600 font-mono uppercase">{mantenimiento.equipo.numero_inventario || '---'}</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IP del Equipo</span>
                                        <p className="text-sm font-bold text-slate-700 font-mono">{mantenimiento.equipo.ip_fija || 'DCHP (Dinámica)'}</p>
                                    </div>
                                </div>

                                {/* Location Details */}
                                <div className="pt-6 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPinIcon className="h-4.5 w-4.5 text-indigo-500" />
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Ubicación y Responsable</h3>
                                    </div>

                                    <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Sede</span>
                                            <p className="text-xs font-bold text-slate-700 uppercase">{mantenimiento.equipo.sede?.nombre || '---'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Área o Departamento</span>
                                            <p className="text-xs font-bold text-slate-700 uppercase">{mantenimiento.equipo.area?.nombre || '---'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Funcionario a Cargo</span>
                                            <p className="text-xs font-bold text-slate-900 uppercase">{mantenimiento.equipo.responsable?.nombre_completo || 'Sin asignar'}</p>
                                            {mantenimiento.equipo.responsable?.correo && (
                                                <p className="text-[10px] text-slate-400 font-medium">{mantenimiento.equipo.responsable.correo}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium text-sm">
                                No se pudo cargar la información del equipo asociado.
                            </div>
                        )}
                    </div>

                    {/* PC Characteristics Details */}
                    {mantenimiento.equipo?.caracteristicas_tecnicas && (
                        <div className="bg-white border border-slate-50 shadow-xl rounded-[2rem] p-8 space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                                <CpuChipIcon className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Especificaciones Físicas</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: 'Procesador / CPU', value: mantenimiento.equipo.caracteristicas_tecnicas.procesador },
                                    { label: 'Memoria RAM', value: mantenimiento.equipo.caracteristicas_tecnicas.memoria_ram },
                                    { label: 'Disco Duro / Capacidad', value: `${mantenimiento.equipo.caracteristicas_tecnicas.disco_duro || ''} ${mantenimiento.equipo.caracteristicas_tecnicas.capacidad_disco ? `(${mantenimiento.equipo.caracteristicas_tecnicas.capacidad_disco})` : ''}` },
                                    { label: 'Tarjeta Gráfica', value: mantenimiento.equipo.caracteristicas_tecnicas.tarjeta_video },
                                    { label: 'Monitor', value: mantenimiento.equipo.caracteristicas_tecnicas.monitor },
                                    { label: 'Teclado', value: mantenimiento.equipo.caracteristicas_tecnicas.teclado },
                                    { label: 'Mouse', value: mantenimiento.equipo.caracteristicas_tecnicas.mouse },
                                    { label: 'Unidad de CD', value: mantenimiento.equipo.caracteristicas_tecnicas.unidad_cd },
                                    { label: 'Tipo Conexión Red', value: mantenimiento.equipo.caracteristicas_tecnicas.internet },
                                    { label: 'Velocidad Red', value: mantenimiento.equipo.caracteristicas_tecnicas.velocidad_red }
                                ].map((spec, index) => {
                                    if (!spec.value || spec.value.trim() === '') return null;
                                    return (
                                        <div key={index} className="flex flex-col border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{spec.label}</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase mt-0.5">{spec.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
