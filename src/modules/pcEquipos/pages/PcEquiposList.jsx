import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEquiposService from '../services/pcEquiposService';
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

    useEffect(() => {
        loadEquipos();
    }, []);

    const loadEquipos = async () => {
        try {
            setLoading(true);
            const response = await pcEquiposService.getAll();
            setEquipos(response.objeto || []);
        } catch (error) {
            console.error('Error loading equipos:', error);
            Swal.fire('Error', 'No se pudieron cargar los equipos', 'error');
        } finally {
            setLoading(false);
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
                Swal.fire('Eliminado', 'El equipo ha sido eliminado', 'success');
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
            <div className="flex flex-col justify-center items-center h-80 gap-4">
                <div className="relative">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-100 border-t-indigo-600"></div>
                    <CpuChipIcon className="h-6 w-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-gray-500 animate-pulse">Cargando equipos...</p>
            </div>
        );
    }

    const TipoIcon = (tipo) => tipoIconMap[tipo?.toLowerCase()] || ComputerDesktopIcon;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventario de Equipos</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {equipos.length} equipo{equipos.length !== 1 ? 's' : ''} registrado{equipos.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/pc-equipos/nuevo')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 active:scale-95"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nuevo Equipo
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por marca, modelo, serial, sede..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative">
                        <FunnelIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="operativo">Operativo</option>
                            <option value="mantenimiento">Mantenimiento</option>
                            <option value="baja">Baja</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                    <ComputerDesktopIcon className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron equipos</h3>
                    <p className="text-sm text-gray-400">
                        {searchTerm || filterEstado !== 'todos'
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza agregando un nuevo equipo'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item) => {
                        const Icon = TipoIcon(item.tipo_equipo);
                        const estado = estadoConfig[item.estado] || estadoConfig.mantenimiento;
                        return (
                            <div
                                key={item.id}
                                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                            >
                                {/* Top Color Accent */}
                                <div className={`absolute top-0 left-0 right-0 h-1 ${estado.dot} opacity-80`}></div>

                                <div className="p-5">
                                    {/* Header: Icon + Type + Estado */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                                <Icon className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 capitalize leading-tight">
                                                    {item.tipo_equipo}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-0.5">{item.marca}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${estado.bg} ${estado.text} border ${estado.border}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${estado.dot}`}></span>
                                            {item.estado}
                                        </span>
                                    </div>

                                    {/* Model */}
                                    <p className="text-base font-semibold text-gray-800 mb-3 truncate" title={item.modelo}>
                                        {item.modelo || 'Sin modelo'}
                                    </p>

                                    {/* Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <CpuChipIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                            <span className="truncate">
                                                SN: <span className="font-medium text-gray-700">{item.serial}</span>
                                            </span>
                                        </div>
                                        {item.activo_fijo && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">
                                                    AF: <span className="font-medium text-gray-700">{item.activo_fijo}</span>
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPinIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                            <span className="truncate">
                                                {item.sede?.nombre || 'Sin Sede'}
                                                {item.area?.nombre ? ` · ${item.area.nombre}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => navigate(`/pc-equipos/hoja-de-vida/${item.id}`)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Hoja de Vida"
                                        >
                                            <DocumentTextIcon className="h-4 w-4" />
                                            <span className="hidden sm:inline">Hoja de Vida</span>
                                            <span className="sm:hidden">HV</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/pc-equipos/editar/${item.id}`)}
                                            className="inline-flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <PencilSquareIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="inline-flex items-center justify-center p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
