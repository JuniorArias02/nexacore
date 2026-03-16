import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import menuConfig from '../config/menuConfig';
import { useLocation, Link } from 'react-router-dom';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, collapsed, setCollapsed }) => {
    const location = useLocation();
    const { hasAnyPermission } = useAuth();
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (e, key) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Filter menu items based on user permissions
    const filteredNavigation = useMemo(() => {
        return menuConfig.reduce((acc, group) => {
            const filteredItems = group.items.filter(item =>
                hasAnyPermission(item.permissions)
            ).map(item => {
                if (item.children) {
                    const filteredChildren = item.children.filter(child =>
                        hasAnyPermission(child.permissions)
                    );
                    return { ...item, children: filteredChildren.length > 0 ? filteredChildren : undefined };
                }
                return item;
            });

            if (filteredItems.length > 0) {
                acc.push({ ...group, items: filteredItems });
            }
            return acc;
        }, []);
    }, [hasAnyPermission]);

    return (
        <>
            {/* Mobile backdrop with premium blur */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-md transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:fixed h-full flex flex-col border-r border-slate-100 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.03)]
                ${collapsed ? 'lg:w-24' : 'lg:w-80'}
            `}>
                {/* Header / Logo Section */}
                <div className="relative h-24 flex items-center px-6 mb-2">
                    <Link to="/dashboard" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                <span className="text-white font-black text-2xl relative z-10">N</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {/* Status Indicator */}
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                        </div>
                        
                        <div className={`flex flex-col transition-all duration-500 ${collapsed ? 'opacity-0 scale-95 pointer-events-none w-0' : 'opacity-100 scale-100'}`}>
                            <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                                NEXA<span className="text-indigo-600">CORE</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Toggle - Minimalist style */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex absolute -right-3 top-9 h-6 w-6 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 items-center justify-center shadow-sm transition-all z-50"
                    >
                        {collapsed ? <ChevronRightIcon className="h-3 w-3" /> : <ChevronLeftIcon className="h-3 w-3" />}
                    </button>
                    
                    <button onClick={onClose} className="lg:hidden absolute right-4 text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar pb-8">
                    {filteredNavigation.map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-8">
                            <div className={`flex items-center mb-4 px-2 ${collapsed ? 'justify-center' : ''}`}>
                                {!collapsed ? (
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                        {group.title}
                                    </h3>
                                ) : (
                                    <div className="h-px w-6 bg-slate-100" />
                                )}
                            </div>
                            
                            <ul className="space-y-1.5">
                                {group.items.map((item) => {
                                    const active = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                                    const hasChildren = item.children && item.children.length > 0;
                                    const isExpanded = expandedItems[item.href] || (active && !collapsed);

                                    return (
                                        <li key={item.name} className="relative">
                                            <div className="group flex items-center">
                                                <Link
                                                    to={item.href}
                                                    className={`
                                                        relative flex-1 flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300
                                                        ${active 
                                                            ? 'bg-gradient-to-r from-violet-600/90 to-indigo-600/90 text-white shadow-lg shadow-indigo-100' 
                                                            : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1'
                                                        }
                                                        ${collapsed ? 'justify-center px-0 h-12 w-12 mx-auto' : ''}
                                                    `}
                                                    title={collapsed ? item.name : ''}
                                                    onClick={() => window.innerWidth < 1024 && !hasChildren && onClose()}
                                                >
                                                    <item.icon className={`h-6 w-6 shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                                    
                                                    {!collapsed && (
                                                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {item.name}
                                                        </span>
                                                    )}

                                                    {hasChildren && !collapsed && (
                                                        <ChevronDownIcon 
                                                            onClick={(e) => toggleExpand(e, item.href)}
                                                            className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${active ? 'text-white' : 'text-slate-400'}`} 
                                                        />
                                                    )}
                                                </Link>
                                            </div>

                                            {/* Nested Items with Luxury Vertical Guide */}
                                            {hasChildren && !collapsed && isExpanded && (
                                                <ul className="mt-2 ml-7 pl-4 border-l-2 border-slate-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {item.children.map((child) => {
                                                        const childActive = location.pathname === child.href;
                                                        return (
                                                            <li key={child.href}>
                                                                <Link
                                                                    to={child.href}
                                                                    className={`
                                                                        flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-black transition-all duration-200
                                                                        ${childActive
                                                                            ? 'text-indigo-600 bg-indigo-50/50'
                                                                            : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                                                                        }
                                                                    `}
                                                                    onClick={() => window.innerWidth < 1024 && onClose()}
                                                                >
                                                                    <div className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${childActive ? 'bg-indigo-600 scale-125' : 'bg-slate-200'}`} />
                                                                    <span className="uppercase tracking-widest">{child.name}</span>
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer / Profile Section */}
                {/* <div className="p-4 border-t border-slate-50">
                    <div className={`flex items-center gap-3 p-2 rounded-2xl bg-slate-50/50 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="h-10 w-10 rounded-xl bg-slate-200 flex-shrink-0" />
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tighter">Usuario Premium</p>
                                <p className="text-[10px] font-medium text-slate-500 truncate">Administrador</p>
                            </div>
                        )}
                    </div>
                </div> */}
            </aside>
        </>
    );
};

export default Sidebar;


