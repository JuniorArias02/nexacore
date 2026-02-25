import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    EyeIcon,
    ArrowLeftIcon,
    PencilSquareIcon,
    ArchiveBoxIcon,
    UserCircleIcon,
    CpuChipIcon,
    CurrencyDollarIcon,
    ChatBubbleLeftEllipsisIcon,
    CalendarDaysIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { inventoryService } from '../services/inventoryService';

export default function InventoryDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await inventoryService.getInventarioById(id);
                setItem(data);
            } catch (err) {
                console.error("Error fetching inventory detail:", err);
                setError("No se pudo cargar la información del activo.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-slate-500 font-medium animate-pulse uppercase tracking-widest text-xs">Cargando detalles...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-12 text-center">
                <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 shadow-xl">
                    <h2 className="text-2xl font-black text-red-800 mb-2">Error</h2>
                    <p className="text-red-600 mb-6">{error || "Item no encontrado"}</p>
                    <button
                        onClick={() => navigate('/inventario')}
                        className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-2xl font-black text-xs tracking-widest uppercase shadow-sm border border-red-100 hover:bg-red-50 transition-all"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Volver al inventario
                    </button>
                </div>
            </div>
        );
    }

    const InfoField = ({ label, value, icon: Icon }) => (
        <div className="group p-4 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-3 mb-1">
                {Icon && <Icon className="h-3.5 w-3.5 text-indigo-500" />}
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {label}
                </label>
            </div>
            <p className="text-slate-900 font-medium text-sm break-words">
                {value || <span className="text-slate-300 italic">No registrado</span>}
            </p>
        </div>
    );

    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-100 rounded-xl">
                <Icon className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-800">{title}</h3>
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Action Header */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/inventario')}
                    className="group flex items-center px-4 py-2 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Regresar</span>
                </button>

                <Link
                    to={`/inventario/editar/${item.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-50 border border-indigo-50 transition-all transform hover:-translate-y-1"
                >
                    <PencilSquareIcon className="h-4 w-4" />
                    Editar Registro
                </Link>
            </div>

            {/* Hero Header Pattern */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        DETALLES DEL ACTIVO
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        {item.nombre}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-indigo-100 font-medium leading-relaxed opacity-90">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                            <ArchiveBoxIcon className="h-4 w-4" />
                            {item.codigo}
                        </span>
                        {item.serial && (
                            <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                                <CpuChipIcon className="h-4 w-4" />
                                SN: {item.serial}
                            </span>
                        )}
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className={`h-2 w-2 rounded-full ${item.estado === 'Nuevo' ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                            Estado: {item.estado}
                        </span>
                    </div>
                </div>
                {/* Floating Icon */}
                <EyeIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 transition-all hover:shadow-2xl">
                        <SectionHeader title="Información General" icon={ArchiveBoxIcon} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoField label="Código" value={item.codigo} />
                            <InfoField label="Nombre" value={item.nombre} />
                            <InfoField label="Grupo" value={item.grupo} />
                            <InfoField label="Marca" value={item.marca} />
                            <InfoField label="Modelo" value={item.modelo} />
                            <InfoField label="Serial" value={item.serial} />
                            <InfoField label="Tipo de Bien" value={item.tipo_bien} />
                            <InfoField label="Tipo de Adquisición" value={item.tipo_adquisicion} />
                        </div>
                    </div>

                    {/* Technical Support & Accessories */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 transition-all hover:shadow-2xl">
                        <SectionHeader title="Soporte y Accesorios" icon={CpuChipIcon} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoField label="Soporte / Garantía" value={item.soporte} />
                            <InfoField label="Tiene Accesorio" value={item.tiene_accesorio} />
                            <div className="sm:col-span-2">
                                <InfoField label="Descripción Accesorios" value={item.descripcion_accesorio} />
                            </div>
                            <div className="sm:col-span-2">
                                <InfoField label="Observaciones" value={item.observaciones} icon={ChatBubbleLeftEllipsisIcon} />
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 transition-all hover:shadow-2xl">
                        <SectionHeader title="Descripción Detallada" icon={DocumentTextIcon} />
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 min-h-[100px]">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {item.descripcion || "Sin descripción proporcionada."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Assignment Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 transition-all hover:shadow-2xl">
                        <SectionHeader title="Asignación" icon={UserCircleIcon} />
                        <div className="space-y-4">
                            <InfoField label="Sede" value={item.sede?.nombre} />
                            <InfoField label="Proceso / Dependencia" value={item.dependencia} />
                            <InfoField label="Ubicación" value={item.ubicacion} />
                            <div className="border-t border-slate-50 pt-4">
                                <InfoField label="Responsable" value={item.responsable_personal?.nombre || item.responsable} />
                                <InfoField label="Coordinador" value={item.coordinador_personal?.nombre || item.coordinador_nombre} />
                            </div>
                        </div>
                    </div>

                    {/* Financial & Accounting */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 transition-all hover:shadow-2xl">
                        <SectionHeader title="Contable y Financiero" icon={CurrencyDollarIcon} />
                        <div className="space-y-4">
                            <InfoField label="Valor Compra" value={item.valor_compra ? `$${new Intl.NumberFormat('es-CO').format(item.valor_compra)}` : null} />
                            <InfoField label="Num. Factura" value={item.num_factu} />
                            <InfoField label="Proveedor" value={item.proveedor} />
                            <div className="border-t border-slate-50 pt-4">
                                <InfoField label="Vida Útil" value={item.vida_util ? `${item.vida_util} años` : null} />
                                <InfoField label="Vida Útil NIIF" value={item.vida_util_niff ? `${item.vida_util_niff} años` : null} />
                                <InfoField label="Depreciación Acumulada" value={item.depreciacion_acumulada ? `$${new Intl.NumberFormat('es-CO').format(item.depreciacion_acumulada)}` : null} />
                            </div>
                            <div className="border-t border-slate-50 pt-4">
                                <InfoField label="Centro de Costo" value={item.centro_costo} />
                                <InfoField label="Cuenta Inventario" value={item.cuenta_inventario} />
                            </div>
                        </div>
                    </div>

                    {/* Dates Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 transition-all hover:shadow-2xl">
                        <SectionHeader title="Fechas Importantes" icon={CalendarDaysIcon} />
                        <div className="space-y-4">
                            <InfoField label="Fecha Compra" value={item.fecha_compra ? new Date(item.fecha_compra).toLocaleDateString('es-CO') : null} />
                            <InfoField label="Último Calibrado" value={item.calibrado ? new Date(item.calibrado).toLocaleDateString('es-CO') : null} />
                            <InfoField label="Creado el" value={item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
                        </div>
                    </div>

                    {/* Attachments */}
                    {item.soporte_adjunto && (
                        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-[2.5rem] border border-indigo-100 shadow-xl p-8">
                            <SectionHeader title="Adjuntos" icon={DocumentTextIcon} />
                            <a
                                href={`${import.meta.env.VITE_API_URL || ''}/${item.soporte_adjunto}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 rounded-3xl hover:bg-indigo-100/50 transition-all group"
                            >
                                <DocumentTextIcon className="h-12 w-12 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Ver Soporte Adjunto</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
