import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';
import {
    CalendarDaysIcon,
    ArrowPathIcon,
    WrenchScrewdriverIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    ComputerDesktopIcon,
    InformationCircleIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

export default function PcMantenimientoCronograma() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/pc-cronograma-mantenimientos');
            setData(response.data.objeto || []);
        } catch (error) {
            console.error("Error loading cronograma", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item => {
        const matchesSearch = 
            item.nombre_equipo?.toLowerCase().includes(search.toLowerCase()) ||
            item.serial?.toLowerCase().includes(search.toLowerCase()) ||
            item.numero_inventario?.toLowerCase().includes(search.toLowerCase()) ||
            item.responsable?.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || item.mantenimiento.estado_manto === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'vencido':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'proximo':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'al_dia':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'vencido': return 'VENCIDO';
            case 'proximo': return 'PRÓXIMO';
            case 'al_dia': return 'AL DÍA';
            default: return 'SIN REGISTRO';
        }
    };

    return (
        <div className="mx-auto max-w-full px-4 py-8 animate-fade-in font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                            <CalendarDaysIcon className="h-8 w-8 text-white" />
                        </div>
                        Cronograma de Mantenimientos
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Ciclos de mantenimiento preventivo para equipos de cómputo.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={loadData}
                        disabled={loading}
                        className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ArrowPathIcon className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <Link
                        to="/pc-mantenimientos/nuevo"
                        className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
                    >
                        Nuevo Registro
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por equipo, serial, inventario o responsable..."
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-300 shadow-inner"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-72">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FunnelIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <select
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">TODOS LOS ESTADOS</option>
                            <option value="vencido">VENCIDO</option>
                            <option value="proximo">PRÓXIMO</option>
                            <option value="al_dia">AL DÍA</option>
                            <option value="sin_registro">SIN REGISTRO</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Equipo</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sede / Área</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Responsable</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Último Manto.</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Próximo Manto.</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Estado</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array(7).fill(0).map((_, j) => (
                                            <td key={j} className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-lg"></div></td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                    <ComputerDesktopIcon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm">{item.nombre_equipo}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">SN: {item.serial || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <p className="font-bold text-slate-700">{item.sede || '—'}</p>
                                            <p className="text-xs text-slate-400">{item.area || '—'}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600">{item.responsable || 'Sin asignar'}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-black text-slate-700">{item.mantenimiento.fecha_ultimo_mantenimiento || '—'}</span>
                                                {item.mantenimiento.base_calculo === 'fecha_ingreso' && (
                                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-1">BASADO EN INGRESO</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-black text-slate-800">{item.mantenimiento.fecha_proximo_mantenimiento || '—'}</span>
                                                {item.mantenimiento.dias_restantes !== null && (
                                                    <span className={`text-[10px] font-bold mt-1 ${item.mantenimiento.dias_restantes <= 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                                        {item.mantenimiento.dias_restantes <= 0 
                                                            ? `Vencido hace ${Math.abs(item.mantenimiento.dias_restantes)} días` 
                                                            : `Faltan ${item.mantenimiento.dias_restantes} días`}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-[0.1em] ${getStatusStyles(item.mantenimiento.estado_manto)}`}>
                                                {getStatusText(item.mantenimiento.estado_manto)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/pc-equipos/hoja-de-vida/${item.id}`}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100"
                                                    title="Ver Hoja de Vida"
                                                >
                                                    <InformationCircleIcon className="h-5 w-5" />
                                                </Link>
                                                <Link
                                                    to="/pc-mantenimientos/nuevo"
                                                    state={{ equipo_id: item.id }}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                    title="Realizar Mantenimiento"
                                                >
                                                    <WrenchScrewdriverIcon className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <WrenchScrewdriverIcon className="h-12 w-12 text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold">No se encontraron equipos registrados.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend / Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <InformationCircleIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Ciclo de Mantenimiento</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Se calcula sumando los días configurados a la fecha del último mantenimiento completado.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                        <InformationCircleIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Frecuencia Estándar</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            El sistema utiliza por defecto 180 días (6 meses) si no existe una configuración específica.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <InformationCircleIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Sin Mantenimientos</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Si el equipo no tiene historial, el cálculo se realiza basándose en su fecha de ingreso.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
