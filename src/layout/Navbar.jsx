import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    UserIcon,
    ChevronDownIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const Navbar = ({ onOpenSidebar }) => {
    const { user, logout, refreshPermissions } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:text-indigo-600 transition-colors"
                    onClick={onOpenSidebar}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
                    <div className="flex items-center gap-x-4">
                        {/* Global Sync Permissions Button */}
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className={`p-2 rounded-xl transition-all duration-200 ${syncing ? 'bg-indigo-50 text-indigo-400' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                            title="Sincronizar Permisos"
                        >
                            <ArrowPathIcon className={`h-6 w-6 ${syncing ? 'animate-spin' : ''}`} />
                        </button>

                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* User Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-x-3 pl-4 lg:pl-6 border-l border-gray-200 focus:outline-none group"
                                >
                                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                                        <span className="text-sm font-semibold leading-6 text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {user?.nombre_completo || 'Usuario'}
                                        </span>
                                        <span className="text-xs text-gray-500">{user?.usuario}</span>
                                    </div>
                                    {user?.foto_usuario ? (
                                        <img
                                            src={user.foto_usuario}
                                            alt="Perfil"
                                            className="h-8 w-8 rounded-full object-cover border border-gray-200 group-hover:border-indigo-500 transition-colors"
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-8 w-8 text-gray-300 bg-gray-50 rounded-full group-hover:text-indigo-500 transition-colors" />
                                    )}
                                    <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-64 origin-top-right rounded-2xl bg-white shadow-2xl border border-gray-100 focus:outline-none animate-fade-in-up z-50">
                                        <div className="p-2">
                                            <div className="px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">Conectado como</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{user?.usuario}</p>
                                            </div>

                                            {[
                                                { to: '/profile', icon: UserIcon, label: 'Mi Perfil' },
                                                { to: '/configuration', icon: Cog6ToothIcon, label: 'Configuración' },
                                            ].map((item) => (
                                                <Link
                                                    key={item.to}
                                                    to={item.to}
                                                    className="group flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <div className="mr-3 p-1.5 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                        <item.icon className="h-4 w-4" />
                                                    </div>
                                                    {item.label}
                                                </Link>
                                            ))}

                                            <div className="border-t border-gray-100 my-2"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="group flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                                            >
                                                <div className="mr-3 p-1.5 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
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
