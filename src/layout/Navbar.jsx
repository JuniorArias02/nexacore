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
                                className={`relative p-2.5 rounded-[1.25rem] border transition-all duration-300 group ${
                                    notifOpen
                                    ? 'bg-white/80 border-indigo-200 ring-4 ring-indigo-500/10 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.2)] text-indigo-600'
                                    : 'bg-slate-50/50 border-white/60 hover:bg-white/80 hover:border-indigo-100 hover:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.15)] text-slate-400 hover:text-indigo-600'
                                }`}
                            >
                                <BellIcon className="h-5 w-5 stroke-[2] group-hover:scale-110 transition-transform duration-300" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                                )}
                            </button>

                            {notifOpen && (
                                <div 
                                    className="absolute right-0 top-full mt-3 w-80 origin-top-right rounded-[2rem] focus:outline-none animate-in fade-in slide-in-from-top-4 duration-500 z-50 overflow-hidden"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        backdropFilter: 'blur(28px) saturate(180%)',
                                        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                                        border: '1px solid rgba(255, 255, 255, 0.9)',
                                        boxShadow: '0 20px 60px -10px rgba(79, 70, 229, 0.15), inset 0 1px 0 rgba(255,255,255,1)'
                                    }}
                                >
                                    <div className="px-5 py-4 border-b border-slate-100/50 bg-white/40">
                                        <h3 className="text-sm font-bold text-slate-800">Notificaciones</h3>
                                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Mensajes No Leídos</p>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto space-y-1 p-2 custom-scrollbar">
                                        {unreadTickets.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-xs text-slate-400 font-medium bg-white/40 rounded-xl m-2">
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
                                                    className="group/item relative w-full text-left px-4 py-3 rounded-2xl transition-all duration-300"
                                                >
                                                    {/* Neon Glow Hover Effect */}
                                                    <div 
                                                        className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none backdrop-blur-sm opacity-0 scale-[0.98] group-hover/item:opacity-100 group-hover/item:scale-100"
                                                        style={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                            boxShadow: '0 4px 24px -4px rgba(99, 102, 241, 0.25)',
                                                            border: '1px solid rgba(255,255,255,0.9)'
                                                        }}
                                                    />

                                                    <div className="relative z-10 flex justify-between items-start mb-1">
                                                        <span className="text-xs font-black text-indigo-600 tracking-wide">{ticket.codigo_ticket}</span>
                                                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full shadow-sm">
                                                            {ticket.unread_count} nuevos
                                                        </span>
                                                    </div>
                                                    <p className="relative z-10 text-sm font-semibold text-slate-700 truncate group-hover/item:text-indigo-900 transition-colors">
                                                        {ticket.asunto}
                                                    </p>
                                                    <p className="relative z-10 text-[10px] text-slate-400 mt-1 font-medium">
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
                            className={`relative p-2.5 rounded-[1.25rem] border transition-all duration-500 group ${
                                syncing 
                                ? 'bg-indigo-50 border-indigo-100 text-indigo-400 shadow-inner' 
                                : 'bg-slate-50/50 border-white/60 hover:bg-white/80 hover:border-indigo-100 hover:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.15)] text-slate-400 hover:text-indigo-600'
                            }`}
                            title="Sincronizar Permisos"
                        >
                            <ArrowPathIcon className={`h-5 w-5 stroke-[2] ${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        </button>

                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* User Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`flex items-center gap-x-3 p-1.5 pr-4 rounded-[1.5rem] border transition-all duration-300 group ${
                                        dropdownOpen 
                                        ? 'bg-white/80 border-indigo-200 ring-4 ring-indigo-500/10 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.2)]' 
                                        : 'bg-slate-50/50 border-white/60 hover:bg-white/80 hover:border-indigo-100 hover:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.15)]'
                                    }`}
                                >
                                    <div className="relative">
                                        {user?.foto_usuario ? (
                                            <img
                                                src={user.foto_usuario}
                                                alt="Perfil"
                                                className="h-9 w-9 rounded-[1.125rem] object-cover border-[1.5px] border-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-9 w-9 rounded-[1.125rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 flex items-center justify-center border-[1.5px] border-white shadow-[0_2px_8px_rgba(79,70,229,0.3)] transition-transform duration-300 group-hover:scale-105">
                                                <span className="text-white font-black text-sm uppercase">
                                                    {user?.nombre_completo?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        {/* Status indicator */}
                                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${getStatusColor(sessionStatus)} shadow-[0_0_8px_rgba(0,0,0,0.15)] ${sessionStatus !== 'idle' ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span className="text-xs font-black text-slate-800 truncate max-w-[120px] uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
                                            {user?.nombre_completo?.split(' ')[0] || 'Usuario'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5 group-hover:text-slate-500 transition-colors">{user?.usuario}</span>
                                    </div>
                                    <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-500 ${dropdownOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div 
                                        className="absolute right-0 mt-3 w-80 origin-top-right rounded-[2.5rem] focus:outline-none animate-in fade-in slide-in-from-top-4 duration-500 z-50 overflow-hidden"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.85)',
                                            backdropFilter: 'blur(28px) saturate(180%)',
                                            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                                            border: '1px solid rgba(255, 255, 255, 0.9)',
                                            boxShadow: '0 20px 60px -10px rgba(79, 70, 229, 0.15), inset 0 1px 0 rgba(255,255,255,1)'
                                        }}
                                    >
                                        <div className="p-3">
                                            {/* Header with glass/gradient premium look */}
                                            <div className="relative overflow-hidden px-5 py-5 mb-3 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 rounded-[2rem] shadow-[0_8px_16px_rgba(79,70,229,0.25)] border border-white/20">
                                                <div className="relative z-10">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2 text-white/90">
                                                        <span className={`h-2 w-2 rounded-full border border-white/50 ${getStatusColor(sessionStatus)} ${sessionStatus !== 'idle' ? 'animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
                                                        {getStatusText(sessionStatus)}
                                                    </p>
                                                    <p className="text-lg font-black text-white truncate tracking-tight drop-shadow-sm">{user?.nombre_completo || 'Usuario'}</p>
                                                    <p className="text-xs font-bold text-indigo-100/90 mt-0.5">{user?.usuario}</p>
                                                </div>
                                                <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                                            </div>

                                            <div className="space-y-1.5">
                                                {[
                                                    { to: '/profile', icon: UserIcon, label: 'Mi Perfil' },
                                                    { to: '/configuration', icon: Cog6ToothIcon, label: 'Configuración' },
                                                ].map((item) => (
                                                    <Link
                                                        key={item.to}
                                                        to={item.to}
                                                        className="group/item relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-all duration-300"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        {/* Glass + Neon Glow Background */}
                                                        <div 
                                                            className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none backdrop-blur-sm opacity-0 scale-[0.98] group-hover/item:opacity-100 group-hover/item:scale-100"
                                                            style={{
                                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                                boxShadow: '0 4px 24px -4px rgba(99, 102, 241, 0.25)',
                                                                border: '1px solid rgba(255,255,255,0.9)'
                                                            }}
                                                        />
                                                        
                                                        <item.icon className="relative z-10 h-5 w-5 shrink-0 text-slate-400 group-hover/item:scale-110 group-hover/item:text-indigo-600 transition-all duration-500" />
                                                        <span className="relative z-10 flex-1 whitespace-nowrap">{item.label}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="my-2 px-4">
                                                <div className="h-px bg-slate-100 w-full" />
                                            </div>

                                            <button
                                                onClick={handleLogout}
                                                className="group/item relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-all duration-300"
                                            >
                                                {/* Glass + Red Neon Glow Background */}
                                                <div 
                                                    className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none backdrop-blur-sm opacity-0 scale-[0.98] group-hover/item:opacity-100 group-hover/item:scale-100"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 241, 242, 0.7)',
                                                        boxShadow: '0 4px 24px -4px rgba(225, 29, 72, 0.25)',
                                                        border: '1px solid rgba(255,228,230,0.9)'
                                                    }}
                                                />
                                                
                                                <ArrowRightOnRectangleIcon className="relative z-10 h-5 w-5 shrink-0 text-rose-400 group-hover/item:-translate-x-1 group-hover/item:text-rose-600 transition-all duration-500" />
                                                <span className="relative z-10 flex-1 whitespace-nowrap">Cerrar Sesión</span>
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

