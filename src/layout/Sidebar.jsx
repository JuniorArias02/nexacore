import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Crear Inventario', href: '/inventario', icon: ClipboardDocumentListIcon },
    ];



    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 transform lg:translate-x-0 lg:fixed lg:z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">NexaCore</span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-y-7 px-6 py-6 overflow-y-auto">
                    <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                            const active = location.pathname.startsWith(item.href);
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className={`
                                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200
                                            ${active
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                            }
                                        `}
                                        onClick={() => window.innerWidth < 1024 && onClose()}
                                    >
                                        <item.icon
                                            className={`h-6 w-6 shrink-0 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
