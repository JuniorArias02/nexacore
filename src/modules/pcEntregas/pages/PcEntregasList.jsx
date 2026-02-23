import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEntregasService from '../services/pcEntregasService';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    TruckIcon,
    UserIcon,
    CalendarIcon,
    CheckBadgeIcon,
    ClockIcon,
    SignalIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

export default function PcEntregasList() {
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadEntregas();
    }, []);

    const loadEntregas = async () => {
        try {
            setLoading(true);
            const data = await pcEntregasService.getAll();
            setEntregas(data || []);
        } catch (error) {
            console.error('PcEntregasList: Error loading entregas:', error);
            Swal.fire('Error', 'No se pudieron cargar las entregas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
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
                await pcEntregasService.delete(id);
                setEntregas(prev => prev.filter(item => item.id !== id));
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El registro de entrega ha sido eliminado.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } catch (error) {
                console.error('Error deleting entrega:', error);
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
            }
        }
    };

    const filteredItems = entregas.filter(item =>
        item.equipo?.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.funcionario?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.funcionario?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        CONTROL DE ACTIVOS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Entregas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Equipos</span>
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Registro y trazabilidad de hardware asignado al personal corporativo de NEXA.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            to="/pc-entregas/crear"
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5 stroke-[3]" />
                            Nueva Entrega
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-[100px] group-hover:bg-blue-400/30 transition-colors duration-700"></div>
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-[100px] group-hover:bg-indigo-400/30 transition-colors duration-700"></div>
                <TruckIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400 font-bold"
                        placeholder="Buscar por serial o funcionario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                    <SignalIcon className="h-5 w-5 animate-pulse text-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sincronizado con Inventario</span>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50 transition-all">
                <div className="overflow-x-auto border-b border-gray-100">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Referencia</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activo Fijo</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Funcionario</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estatus</th>
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
                                                <TruckIcon className="absolute inset-0 m-auto h-6 w-6 text-indigo-600 animate-pulse" />
                                            </div>
                                            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Consultando Registros...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="bg-slate-50 rounded-3xl p-8 mb-4 border border-dashed border-slate-300">
                                                <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-slate-300" />
                                            </div>
                                            <h3 className="text-slate-800 font-black uppercase tracking-tight">Sin Resultados</h3>
                                            <p className="text-slate-400 text-sm font-medium mt-1">No se encontraron entregas con los criterios de búsqueda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-400 tracking-widest uppercase">ID: TR-{item.id.toString().padStart(4, '0')}</span>
                                                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                                    <CalendarIcon className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-bold">{item.fecha_entrega}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                    <SignalIcon className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                                        {item.equipo?.serial || 'SIN SERIAL'}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase truncate max-w-[200px]">
                                                        {item.equipo ? `${item.equipo.marca} ${item.equipo.modelo}` : '---'}
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
                                                        {item.funcionario ? item.funcionario.nombre : '---'}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 tracking-widest">{item.funcionario?.cedula || '---'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.estado === 'entregado'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : item.estado === 'devuelto'
                                                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                                                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                {item.estado === 'entregado' ? (
                                                    <CheckBadgeIcon className="h-3 w-3 mr-1.5" />
                                                ) : (
                                                    <ClockIcon className="h-3 w-3 mr-1.5" />
                                                )}
                                                {item.estado || 'Procesando'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/pc-entregas/editar/${item.id}`}
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

            {/* Footer Branding */}
            <div className="mt-12 text-center pb-8 border-t border-slate-100 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    NexaCore Assets Governance &copy; 2026 | Hardware Lifecycle Management
                </p>
            </div>
        </div>
    );
}
