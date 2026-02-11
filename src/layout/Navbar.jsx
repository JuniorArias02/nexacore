import { useAuth } from '../context/AuthContext';
import { Bars3Icon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = ({ onOpenSidebar }) => {
    const { user, logout } = useAuth();

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
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* User Profile Dropdown or static info */}
                        <div className="flex items-center gap-x-3 pl-4 lg:pl-6 border-l border-gray-200">
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                                <span className="text-sm font-semibold leading-6 text-gray-900">{user?.nombre_completo || 'Usuario'}</span>
                                <span className="text-xs text-gray-500">{user?.usuario}</span>
                            </div>
                            <UserCircleIcon className="h-8 w-8 text-gray-300 bg-gray-50 rounded-full" />

                            <button
                                onClick={logout}
                                className="ml-2 rounded-full p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                title="Cerrar Sesión"
                            >
                                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
