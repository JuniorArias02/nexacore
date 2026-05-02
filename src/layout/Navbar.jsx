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

const Navbar = ({ onOpenSidebar }) => {
    const { user, logout, refreshPermissions, sessionStatus } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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
                        <GlobalSearch />

                        {/* Notifications */}
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all group">
                            <BellIcon className="h-6 w-6 stroke-[1.5] group-hover:scale-110 transition-transform" />
                            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                        </button>


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

