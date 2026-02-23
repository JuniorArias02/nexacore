import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import Swal from 'sweetalert2';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    UserIcon,
    UsersIcon,
    EnvelopeIcon,
    MapPinIcon,
    ShieldCheckIcon,
    SignalIcon
} from '@heroicons/react/24/outline';

export default function UserList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll();
            if (response && response.objeto) {
                setItems(response.objeto);
            } else if (Array.isArray(response)) {
                setItems(response);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Error loading users:", error);
            Swal.fire('Error', 'No se pudieron cargar los registros', 'error');
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
                await userService.delete(id);
                setItems(prev => prev.filter(item => item.id !== id));
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El usuario ha sido eliminado correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } catch (error) {
                console.error("Error deleting:", error);
                const errorMessage = error.response?.data?.mensaje || 'No se pudo eliminar el registro';
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };

    const filteredItems = items.filter(item =>
        item.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        MÓDULO DE SEGURIDAD
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Usuarios</span>
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Control centralizado de identidades, privilegios y accesos para el ecosistema NEXA v2.0.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            to="/usuarios/nuevo"
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5 stroke-[3]" />
                            Nuevo Usuario
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-[100px] group-hover:bg-blue-400/30 transition-colors duration-700"></div>
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-[100px] group-hover:bg-indigo-400/30 transition-colors duration-700"></div>
                <UsersIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
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
                        placeholder="Buscar por nombre o identificador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                    <SignalIcon className="h-5 w-5 animate-pulse text-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enlace Maestro Activo</span>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50 transition-all">
                <div className="overflow-x-auto border-b border-gray-100">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identidad</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Credenciales</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Privilegios</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Conexión</th>
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
                                                <UsersIcon className="absolute inset-0 m-auto h-6 w-6 text-indigo-600 animate-pulse" />
                                            </div>
                                            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sincronizando Usuarios...</span>
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
                                            <h3 className="text-slate-800 font-black uppercase tracking-tight">Sin Coincidencias</h3>
                                            <p className="text-slate-400 text-sm font-medium mt-1">No hay perfiles que coincidan con la búsqueda actual.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                                                        {item.foto_usuario ? (
                                                            <img
                                                                src={item.foto_usuario}
                                                                alt={item.usuario}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className={`h-full w-full items-center justify-center ${item.foto_usuario ? 'hidden' : 'flex'}`}>
                                                            {item.nombre_completo.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${item.is_online ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-300 shadow-sm'}`}></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
                                                        {item.nombre_completo}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-0.5">ID: #UX-{item.id.toString().padStart(4, '0')}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <UserIcon className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-bold font-mono">{item.usuario}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <EnvelopeIcon className="h-3.5 w-3.5 text-slate-300" />
                                                    <span className="text-[10px] font-bold truncate max-w-[150px]">{item.correo || 'SIN CORREO'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 rounded-lg w-fit border border-indigo-100">
                                                    <ShieldCheckIcon className="h-3.5 w-3.5 text-indigo-600" />
                                                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">
                                                        {item.rol ? item.rol.nombre : 'Sin Rol'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400 pl-1">
                                                    <MapPinIcon className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold uppercase">{item.sede ? item.sede.nombre : 'Ubicación Pendiente'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.is_online
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full mr-2 ${item.is_online ? 'bg-green-600' : 'bg-slate-400'}`}></span>
                                                {item.is_online ? 'Activo' : 'Desconectado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/usuarios/editar/${item.id}`}
                                                    className="p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-indigo-600 group/edit"
                                                >
                                                    <PencilIcon className="h-5 w-5 stroke-[2]" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2.5 bg-slate-50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-red-600 group/del"
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
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-1">
                    NexaCore <span className="text-indigo-400">Security Protocol</span> &copy; 2026
                </p>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Protocolo de Gestión Centralizada de Identidades</p>
            </div>
        </div>
    );
}
