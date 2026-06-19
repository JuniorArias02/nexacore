import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEquiposService from '../services/pcEquiposService';
import { sedeService } from '../../../Configuracion/Sede/services/sedeService';
import {
    ComputerDesktopIcon,
    DeviceTabletIcon,
    PencilSquareIcon,
    TrashIcon,
    DocumentTextIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    CpuChipIcon,
    ServerIcon,
    FunnelIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';

const tipoIconMap = {
    desktop: ComputerDesktopIcon,
    portatil: DeviceTabletIcon,
    laptop: DeviceTabletIcon,
    servidor: ServerIcon,
};

const estadoConfig = {
    operativo: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    mantenimiento: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
    baja: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200' },
};

export default function PcEquiposList() {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todos');

    const [sedes, setSedes] = useState([]);
    const [filterSede, setFilterSede] = useState('todas');
    
    const [exportingExcelIds, setExportingExcelIds] = useState([]);
    const [exportingPdfIds, setExportingPdfIds] = useState([]);

    useEffect(() => {
        loadSedes();
    }, []);

    useEffect(() => {
        loadEquipos();
    }, [filterSede]);

    const loadSedes = async () => {
        try {
            const data = await sedeService.getAll();
            setSedes(data || []);
        } catch (error) {
            console.error('Error loading sedes:', error);
        }
    };

    const loadEquipos = async () => {
        try {
            setLoading(true);
            const params = filterSede !== 'todas' ? { sede_id: filterSede } : {};
            const response = await pcEquiposService.getAll(params);
            setEquipos(response.objeto || []);
        } catch (error) {
            console.error('Error loading equipos:', error);
            Swal.fire('Error', 'No se pudieron cargar los equipos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async (id) => {
        try {
            setExportingExcelIds(prev => [...prev, id]);
            const response = await pcEquiposService.exportExcel(id);
            
            if (response.success && response.data && response.data.file_url) {
                window.open(response.data.file_url, '_blank');
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Archivo Excel generado y descargado correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } else {
                throw new Error(response.message || 'Error desconocido al exportar');
            }
        } catch (error) {
            console.error('Error exporting PC to Excel:', error);
            Swal.fire('Error', 'No se pudo generar el archivo Excel.', 'error');
        } finally {
            setExportingExcelIds(prev => prev.filter(exportId => exportId !== id));
        }
    };

    const handleExportPdf = async (id) => {
        try {
            setExportingPdfIds(prev => [...prev, id]);
            const response = await pcEquiposService.exportPdf(id);
            
            if (response.success && response.data && response.data.file_url) {
                window.open(response.data.file_url, '_blank');
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Archivo PDF generado y descargado correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } else {
                throw new Error(response.message || 'Error desconocido al exportar');
            }
        } catch (error) {
            console.error('Error exporting PC to PDF:', error);
            Swal.fire('Error', 'No se pudo generar el archivo PDF.', 'error');
        } finally {
            setExportingPdfIds(prev => prev.filter(exportId => exportId !== id));
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await pcEquiposService.delete(id);
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El equipo ha sido eliminado',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                loadEquipos();
            } catch (error) {
                console.error('Error deleting equipo:', error);
                Swal.fire('Error', 'No se pudo eliminar el equipo', 'error');
            }
        }
    };

    const filtered = equipos.filter((item) => {
        const matchSearch =
            !searchTerm ||
            item.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.activo_fijo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tipo_equipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sede?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchEstado = filterEstado === 'todos' || item.estado === filterEstado;
        return matchSearch && matchEstado;
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600"></div>
                    <CpuChipIcon className="h-8 w-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Sincronizando Inventario...</p>
            </div>
        );
    }

    const TipoIcon = (tipo) => tipoIconMap[tipo?.toLowerCase()] || ComputerDesktopIcon;

    return (
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        ACTIVOS TECNOLÓGICOS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Inventario de Equipos
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Gestiona y monitorea el parque computacional de la organización en tiempo real.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/gestion-sistemas/pc-equipos/nuevo')}
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            Registrar Equipo
                        </button>
                    </div>
                </div>
                {/* Decorative Icon */}
                <ComputerDesktopIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            {/* Search & Filter Bar */}
            <div className="mb-10 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por marca, modelo, serial, sede..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-3xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm shadow-slate-200/50"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FunnelIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                        value={filterSede}
                        onChange={(e) => setFilterSede(e.target.value)}
                        className="block w-full pl-10 pr-10 py-4 bg-white border border-slate-100 rounded-3xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="todas">Todas las Sedes</option>
                        {sedes.map((sede) => (
                            <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ChevronRightIcon className="h-4 w-4 text-slate-400 rotate-90" />
                    </div>
                </div>
                <div className="relative min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FunnelIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="block w-full pl-10 pr-10 py-4 bg-white border border-slate-100 rounded-3xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="todos">Todos los Estados</option>
                        <option value="operativo">Operativo</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="baja">Baja</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ChevronRightIcon className="h-4 w-4 text-slate-400 rotate-90" />
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm animate-fade-in">
                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <ComputerDesktopIcon className="h-12 w-12 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">No se encontraron resultados</h3>
                    <p className="text-slate-400 max-w-sm text-center font-medium">
                        {searchTerm || filterEstado !== 'todos'
                            ? 'Ajusta los filtros para encontrar lo que buscas'
                            : 'El inventario está vacío. Comienza agregando el primer equipo.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50 transition-all">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equipo / Tipo</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificadores</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ubicación</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filtered.map((item) => {
                                    const Icon = TipoIcon(item.tipo_equipo);
                                    const estado = estadoConfig[item.estado] || estadoConfig.mantenimiento;
                                    return (
                                        <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
                                                            {item.marca} {item.modelo || ''}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                                                            {item.tipo_equipo}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Serial:</span>
                                                        <span className="text-xs font-bold text-slate-700 truncate">{item.serial}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Activo:</span>
                                                        <span className="text-xs font-bold text-slate-700 truncate">{item.activo_fijo || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-50/50 flex items-center justify-center border border-indigo-100/50">
                                                        <MapPinIcon className="h-4 w-4 text-indigo-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-indigo-900 truncate uppercase leading-none mb-1">
                                                            {item.sede?.nombre || 'Sin Sede'}
                                                        </span>
                                                        <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase truncate">
                                                            {item.area?.nombre || 'Sin Área'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${estado.bg} ${estado.text} border ${estado.border} shadow-sm`}>
                                                    <span className={`w-2 h-2 rounded-full ${estado.dot} ${item.estado === 'operativo' ? '' : 'animate-pulse'}`}></span>
                                                    {item.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2.5">
                                                    <button
                                                        onClick={() => navigate(`/gestion-sistemas/pc-equipos/hoja-de-vida/${item.id}`)}
                                                        className="p-2.5 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-blue-600 hover:-translate-y-0.5"
                                                        title="Ver Hoja de Vida"
                                                    >
                                                        <EyeIcon className="stroke-[2] w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleExportExcel(item.id)}
                                                        disabled={exportingExcelIds.includes(item.id)}
                                                        className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                                                            exportingExcelIds.includes(item.id)
                                                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                                                : 'bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white border-slate-100 hover:border-emerald-600 hover:-translate-y-0.5'
                                                        }`}
                                                        title="Descargar Excel"
                                                    >
                                                        {exportingExcelIds.includes(item.id) ? (
                                                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <ArrowDownTrayIcon className="stroke-[2] w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleExportPdf(item.id)}
                                                        disabled={exportingPdfIds.includes(item.id)}
                                                        className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                                                            exportingPdfIds.includes(item.id)
                                                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                                                : 'bg-slate-50 hover:bg-rose-600 text-slate-400 hover:text-white border-slate-100 hover:border-rose-600 hover:-translate-y-0.5'
                                                        }`}
                                                        title="Descargar PDF"
                                                    >
                                                        {exportingPdfIds.includes(item.id) ? (
                                                            <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <DocumentTextIcon className="stroke-[2] w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/gestion-sistemas/pc-equipos/editar/${item.id}`)}
                                                        className="p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-indigo-600 hover:-translate-y-0.5"
                                                        title="Editar"
                                                    >
                                                        <PencilSquareIcon className="h-4.5 w-4.5 stroke-[2] w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2.5 bg-slate-50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-red-600 hover:-translate-y-0.5"
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="h-4.5 w-4.5 stroke-[2] w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
