import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import actasDevolucionService from '../services/actasDevolucionService';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    ArrowUturnLeftIcon,
    UserIcon,
    CalendarIcon,
    ComputerDesktopIcon,
    HashtagIcon,
    SignalIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function ActasDevolucionListPage() {
    const [devueltos, setDevueltos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [exportingExcelIds, setExportingExcelIds] = useState([]);
    const [exportingPdfIds, setExportingPdfIds] = useState([]);

    useEffect(() => {
        loadDevueltos();
    }, []);

    const loadDevueltos = async () => {
        try {
            setLoading(true);
            const data = await actasDevolucionService.getAll();
            setDevueltos(data || []);
        } catch (error) {
            console.error('Error loading devueltos:', error);
            Swal.fire('Error', 'No se pudieron cargar las devoluciones', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async (id) => {
        try {
            setExportingExcelIds(prev => [...prev, id]);
            const response = await actasDevolucionService.exportExcel(id);
            if (response.success && response.data && response.data.file_url) {
                window.open(response.data.file_url, '_blank');
            } else {
                throw new Error(response.message || 'Error desconocido al exportar excel');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo generar el reporte en Excel.', 'error');
        } finally {
            setExportingExcelIds(prev => prev.filter(eId => eId !== id));
        }
    };

    const handleExportPdf = async (id) => {
        try {
            setExportingPdfIds(prev => [...prev, id]);
            const response = await actasDevolucionService.exportPdf(id);
            if (response.success && response.data && response.data.file_url) {
                window.open(response.data.file_url, '_blank');
            } else {
                throw new Error(response.message || 'Error desconocido al exportar pdf');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo generar el reporte en PDF.', 'error');
        } finally {
            setExportingPdfIds(prev => prev.filter(eId => eId !== id));
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará el registro de devolución permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        });

        if (result.isConfirmed) {
            try {
                await actasDevolucionService.delete(id);
                setDevueltos(prev => prev.filter(item => item.id !== id));
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'La devolución ha sido removida del historial.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } catch (error) {
                console.error('Error deleting devuelto:', error);
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
            }
        }
    };

    const filteredItems = devueltos.filter(item =>
        item.entrega?.equipo?.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.entrega?.funcionario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Actas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Devolución</span>
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Cierre de ciclo de vida de hardware corporativo y reintegración al inventario central.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            to="/gestion-sistemas/actas-devolucion/nuevo"
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5 stroke-[3]" />
                            Nueva Devolución
                        </Link>
                    </div>
                </div>

                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-[100px] group-hover:bg-blue-400/30 transition-colors duration-700"></div>
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-[100px] group-hover:bg-indigo-400/30 transition-colors duration-700"></div>
                <ArrowUturnLeftIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                        placeholder="Buscar por serial, funcionario o equipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50 transition-all">
                <div className="overflow-x-auto border-b border-gray-100">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Referencia</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hardware Devuelto</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha Proceso</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-24">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                                                <ArrowUturnLeftIcon className="absolute inset-0 m-auto h-6 w-6 text-indigo-600 animate-pulse" />
                                            </div>
                                            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Recuperando Historial...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="bg-slate-50 rounded-3xl p-8 mb-4 border border-dashed border-slate-300">
                                                <HashtagIcon className="h-12 w-12 mx-auto text-slate-300" />
                                            </div>
                                            <h3 className="text-slate-800 font-black uppercase tracking-tight">Sin Historial</h3>
                                            <p className="text-slate-400 text-sm font-medium mt-1">No hay registros de devolución que coincidan.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-400 tracking-widest uppercase">RET-{item.id.toString().padStart(4, '0')}</span>
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1 w-fit group-hover:bg-indigo-100 transition-colors tracking-tighter">REF: TR-ENT-{item.entrega_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                                                    <ComputerDesktopIcon className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                                        {item.entrega?.equipo?.nombre_equipo || 'EQUIPO NEXA'}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                                                        SN: {item.entrega?.equipo?.serial || '---'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <UserIcon className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700 uppercase">
                                                        {item.entrega?.funcionario?.nombre || '---'}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 tracking-widest">FUNC. ID: {item.entrega?.funcionario?.cedula || '---'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <CalendarIcon className="h-4 w-4 text-indigo-500" />
                                                <span className="text-xs font-bold">{new Date(item.fecha_devolucion).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleExportExcel(item.id)}
                                                    disabled={exportingExcelIds.includes(item.id)}
                                                    className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                                                        exportingExcelIds.includes(item.id)
                                                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                                                            : 'bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white border-slate-100 hover:border-emerald-600'
                                                    }`}
                                                    title="Descargar Excel"
                                                >
                                                    {exportingExcelIds.includes(item.id) ? (
                                                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <ArrowDownTrayIcon className="h-5 w-5 stroke-[2]" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleExportPdf(item.id)}
                                                    disabled={exportingPdfIds.includes(item.id)}
                                                    className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                                                        exportingPdfIds.includes(item.id)
                                                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                                                            : 'bg-slate-50 hover:bg-rose-600 text-slate-400 hover:text-white border-slate-100 hover:border-rose-600'
                                                    }`}
                                                    title="Descargar PDF"
                                                >
                                                    {exportingPdfIds.includes(item.id) ? (
                                                        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <DocumentTextIcon className="h-5 w-5 stroke-[2]" />
                                                    )}
                                                </button>
                                                <Link
                                                    to={`/gestion-sistemas/actas-devolucion/detalles/${item.id}`}
                                                    className="p-2.5 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-blue-600"
                                                >
                                                    <EyeIcon className="h-5 w-5 stroke-[2]" />
                                                </Link>
                                                <Link
                                                    to={`/gestion-sistemas/actas-devolucion/editar/${item.id}`}
                                                    className="p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-indigo-600"
                                                >
                                                    <PencilIcon className="h-5 w-5 stroke-[2]" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2.5 bg-slate-50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-red-600"
                                                >
                                                    <TrashIcon className="h-5 w-5 stroke-[2]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-12 text-center pb-8 border-t border-slate-100 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    NexaCore Inverse Logistics (DDD) &copy; 2026 | Assets Recovery Protocol
                </p>
            </div>
        </div>
    );
}
