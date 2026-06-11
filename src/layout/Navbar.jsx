import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import {
    Bars3Icon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    UserIcon,
    ChevronDownIcon,
    ArrowPathIcon,
    BellIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { buzonSugerenciasService } from '../modules/BuzonSugerencias/services/buzonSugerenciasService';

const Navbar = ({ onOpenSidebar }) => {
    const { user, logout, refreshPermissions, sessionStatus, hasPermission } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadTickets, setUnreadTickets] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        
        const fetchUnread = async () => {
            try {
                const count = await buzonSugerenciasService.getNoLeidosCount();
                setUnreadCount(count);
                if (count > 0) {
                    const tickets = await buzonSugerenciasService.getTicketsNoLeidos();
                    setUnreadTickets(tickets || []);
                } else {
                    setUnreadTickets([]);
                }
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        };

        fetchUnread();
        
        // Conexión WebSockets para notificación instantánea
        import('../services/echo').then(({ default: echo }) => {
            if (echo) {
                const userChannel = echo.private(`usuario.${user.id}`);
                userChannel.listen('.App\\Modules\\BuzonSugerencias\\Domain\\Events\\NuevoMensajeNoLeido', () => {
                    fetchUnread(); // Refetch the exact count when notified
                });

                let agentChannel = null;
                if (hasPermission && hasPermission('buzon.agente')) {
                    agentChannel = echo.private('buzon.agentes');
                    agentChannel.listen('.App\\Modules\\BuzonSugerencias\\Domain\\Events\\NuevoMensajeNoLeido', () => {
                        fetchUnread();
                    });
                }
                
                return () => {
                    echo.leaveChannel(`usuario.${user.id}`);
                    if (agentChannel) echo.leaveChannel('buzon.agentes');
                };
            }
        });
        
    }, [user]);

    // Helper for status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'idle': return 'bg-amber-500';
            case 'expired': return 'bg-rose-500';
            default: return 'bg-slate-500';
        }
    };
    
    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Sesión Activa';
            case 'idle': return 'Sesión Inactiva';
            case 'expired': return 'Sesión Expirada';
            default: return 'Desconocido';
        }
    };
    
    const getStatusTextColor = (status) => {
        switch (status) {
            case 'active': return 'text-emerald-600';
            case 'idle': return 'text-amber-600';
            case 'expired': return 'text-rose-600';
            default: return 'text-slate-600';
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            const result = await refreshPermissions();
            if (result.success) {
                Swal.fire({
                    title: '¡Sincronizado!',
                    text: 'Tus permisos han sido actualizados correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
                    icon: 'error',
                    toast: true,
                    position: 'top-end'
                });
            }
        } finally {
            setSyncing(false);
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
            <div className="flex h-16 items-center justify-between px-6 lg:px-10">
                <button
                    type="button"
                    className="p-2 -ml-2 text-slate-400 lg:hidden hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    onClick={onOpenSidebar}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6 stroke-[2]" aria-hidden="true" />
                </button>

                <div className="flex flex-1 gap-x-6 justify-end items-center">
                    <div className="flex items-center gap-x-3">
                        {/* Global Dynamic Search */}
                        <div className="hidden sm:block">
                            <GlobalSearch />
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button 
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all group"
                            >
                                <BellIcon className="h-6 w-6 stroke-[1.5] group-hover:scale-110 transition-transform" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                                )}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 ring-1 ring-slate-900/5 transform transition-all">
                                    <div className="px-4 py-3 border-b border-slate-100/80 mb-2">
                                        <h3 className="text-sm font-bold text-slate-800">Notificaciones</h3>
                                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Mensajes No Leídos</p>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto space-y-1">
                                        {unreadTickets.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-xs text-slate-400 font-medium">
                                                No tienes mensajes nuevos.
                                            </div>
                                        ) : (
                                            unreadTickets.map(ticket => (
                                                <button
                                                    key={ticket.id}
                                                    onClick={() => {
                                                        setNotifOpen(false);
                                                        navigate(`/buzon/${ticket.codigo_ticket}`);
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-indigo-50/50 rounded-xl transition-colors group relative overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-black text-indigo-600 tracking-wide">{ticket.codigo_ticket}</span>
                                                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                                                            {ticket.unread_count} nuevos
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-indigo-900 transition-colors">
                                                        {ticket.asunto}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                                        Último mensaje: {new Date(ticket.ultimo_mensaje).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Global Sync Permissions Button */}
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className={`p-2 rounded-xl transition-all duration-500 ${
                                syncing 
                                ? 'bg-indigo-50 text-indigo-400 shadow-inner' 
                                : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 shadow-sm'
                            }`}
                            title="Sincronizar Permisos"
                        >
                            <ArrowPathIcon className={`h-6 w-6 stroke-[1.5] ${syncing ? 'animate-spin' : ''}`} />
                        </button>

                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* User Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`flex items-center gap-x-3 p-1.5 pr-4 rounded-2xl border transition-all duration-300 group ${
                                        dropdownOpen 
                                        ? 'bg-slate-50 border-indigo-100 ring-4 ring-indigo-500/5 shadow-inner' 
                                        : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="relative">
                                        {user?.foto_usuario ? (
                                            <img
                                                src={user.foto_usuario}
                                                alt="Perfil"
                                                className="h-8 w-8 rounded-xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                                <UserCircleIcon className="h-6 w-6 text-slate-400" />
                                            </div>
                                        )}
                                        {/* Status indicator */}
                                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(sessionStatus)} shadow-sm ${sessionStatus !== 'idle' ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span className="text-xs font-black text-slate-900 truncate max-w-[120px] uppercase tracking-tighter transition-colors">
                                            {user?.nombre_completo?.split(' ')[0] || 'Usuario'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">{user?.usuario}</span>
                                    </div>
                                    <ChevronDownIcon className={`h-3 w-3 text-slate-400 transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-72 origin-top-right rounded-[2rem] bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 focus:outline-none animate-in fade-in slide-in-from-top-4 duration-500 z-50 overflow-hidden">
                                        <div className="p-3">
                                            {/* Header with gradient subtle look */}
                                            <div className="relative overflow-hidden px-5 py-4 mb-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-100">
                                                <div className="relative z-10">
                                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2 ${getStatusTextColor(sessionStatus)}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(sessionStatus)} ${sessionStatus !== 'idle' ? 'animate-pulse' : ''}`} />
                                                        {getStatusText(sessionStatus)}
                                                    </p>
                                                    <p className="text-base font-black text-slate-900 truncate tracking-tight">{user?.nombre_completo || 'Usuario'}</p>
                                                    <p className="text-xs font-bold text-slate-400 mt-0.5">{user?.usuario}</p>
                                                </div>
                                                <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/40 blur-2xl pointer-events-none" />
                                            </div>

                                            <div className="space-y-1">
                                                {[
                                                    { to: '/profile', icon: UserIcon, label: 'Mi Perfil' },
                                                    { to: '/configuration', icon: Cog6ToothIcon, label: 'Configuración' },
                                                ].map((item) => (
                                                    <Link
                                                        key={item.to}
                                                        to={item.to}
                                                        className="group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <div className="mr-3 p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:rotate-12 transition-all duration-300">
                                                            <item.icon className="h-4 w-4" />
                                                        </div>
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="my-2 px-4">
                                                <div className="h-px bg-slate-100 w-full" />
                                            </div>

                                            <button
                                                onClick={handleLogout}
                                                className="group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
                                            >
                                                <div className="mr-3 p-2 rounded-xl bg-rose-50 text-rose-400 group-hover:bg-rose-100 group-hover:text-rose-600 group-hover:-translate-x-1 transition-all duration-300">
                                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                                </div>
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

