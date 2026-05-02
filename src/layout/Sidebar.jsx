import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import menuConfig from '../config/menuConfig';
import { useLocation, Link } from 'react-router-dom';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, collapsed, setCollapsed }) => {
    const location = useLocation();
    const { hasAnyPermission } = useAuth();
    const [expandedItems, setExpandedItems] = useState({});
    
    // Auto-expand groups based on active route, or just expand all by default
    const [expandedGroups, setExpandedGroups] = useState(() => {
        const initial = {};
        menuConfig.forEach(group => {
            initial[group.title] = true; // Todo expandido por defecto
        });
        return initial;
    });

    // Option to auto-expand group if it contains the active item
    useEffect(() => {
        menuConfig.forEach(group => {
            const hasActiveItem = group.items.some(item => {
                if (location.pathname === item.href || location.pathname.startsWith(item.href + '/')) return true;
                if (item.children) {
                    return item.children.some(child => location.pathname === child.href);
                }
                return false;
            });
            if (hasActiveItem) {
                setExpandedGroups(prev => ({ ...prev, [group.title]: true }));
            }
        });
    }, [location.pathname]);

    const toggleExpandItem = (e, key) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleExpandGroup = (title) => {
        setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
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
                <div className="relative h-24 flex items-center px-6 mb-2 shrink-0">
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
                        className="hidden lg:flex absolute -right-3 top-9 h-6 w-6 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 items-center justify-center shadow-sm transition-all z-50 hover:scale-110"
                    >
                        {collapsed ? <ChevronRightIcon className="h-3 w-3" /> : <ChevronLeftIcon className="h-3 w-3" />}
                    </button>
                    
                    <button onClick={onClose} className="lg:hidden absolute right-4 text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-8 space-y-4">
                    {filteredNavigation.map((group, groupIndex) => {
                        const isGroupExpanded = expandedGroups[group.title];
                        
                        return (
                            <div key={groupIndex} className={`relative rounded-2xl p-2 transition-colors duration-300 ${group.groupBg || 'bg-slate-50/50'}`}>
                                {/* Group Header */}
                                <div 
                                    className={`flex items-center mb-1 px-2 transition-all duration-300 ${collapsed ? 'justify-center' : 'cursor-pointer hover:bg-white/60 rounded-xl py-2'}`}
                                    onClick={() => !collapsed && toggleExpandGroup(group.title)}
                                >
                                    {!collapsed ? (
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                {group.icon && (
                                                    <div className={`p-1.5 rounded-lg shadow-sm ${group.iconBg || 'bg-slate-100/50'} ${group.iconColor || 'text-slate-500'}`}>
                                                        <group.icon className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                                                    {group.title}
                                                </h3>
                                            </div>
                                            <ChevronDownIcon 
                                                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${isGroupExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative flex justify-center w-full py-2 group/tooltip">
                                            {group.icon ? (
                                                <div className={`p-2 rounded-xl shadow-sm ${group.iconBg || 'bg-slate-50'} ${group.iconColor || 'text-slate-400'}`}>
                                                    <group.icon className="h-5 w-5" />
                                                </div>
                                            ) : (
                                                <div className="h-px w-8 bg-slate-200" />
                                            )}
                                            {/* Tooltip for collapsed state */}
                                            <div className="absolute left-14 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap z-50 shadow-lg">
                                                {group.title}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Group Items */}
                                <div className={`grid transition-all duration-300 ease-in-out ${(!collapsed && !isGroupExpanded) ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                                    <ul className="space-y-1.5 overflow-hidden">
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
                                                                relative flex-1 flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300
                                                                ${active 
                                                                    ? 'bg-white text-indigo-700 shadow-sm border border-white/50' 
                                                                    : 'text-slate-600 hover:bg-white/60 hover:text-indigo-600'
                                                                }
                                                                ${collapsed ? 'justify-center px-0 h-12 w-12 mx-auto rounded-2xl' : ''}
                                                            `}
                                                            title={collapsed ? item.name : ''}
                                                            onClick={() => window.innerWidth < 1024 && !hasChildren && onClose()}
                                                        >
                                                            {/* Indicador de activo lateral */}
                                                            {active && !collapsed && (
                                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                                                            )}

                                                            <item.icon className={`h-5 w-5 shrink-0 transition-all duration-300 ${active ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-indigo-500 group-hover:scale-110'}`} />
                                                            
                                                            {!collapsed && (
                                                                <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                                                    {item.name}
                                                                </span>
                                                            )}

                                                            {hasChildren && !collapsed && (
                                                                <ChevronDownIcon 
                                                                    onClick={(e) => toggleExpandItem(e, item.href)}
                                                                    className={`h-4 w-4 transition-transform duration-300 hover:bg-slate-200/50 rounded-full p-0.5 ${isExpanded ? 'rotate-180' : ''} ${active ? 'text-indigo-600' : 'text-slate-400'}`} 
                                                                />
                                                            )}
                                                        </Link>
                                                    </div>

                                                    {/* Nested Items */}
                                                    {hasChildren && !collapsed && (
                                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                                                            <ul className="ml-10 pl-3 border-l border-slate-200 space-y-1 overflow-hidden py-1">
                                                                {item.children.map((child) => {
                                                                    const childActive = location.pathname === child.href;
                                                                    return (
                                                                        <li key={child.href}>
                                                                            <Link
                                                                                to={child.href}
                                                                                className={`
                                                                                    group/child relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200
                                                                                    ${childActive
                                                                                        ? 'text-indigo-700 bg-white/80 shadow-sm'
                                                                                        : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
                                                                                    }
                                                                                `}
                                                                                onClick={() => window.innerWidth < 1024 && onClose()}
                                                                            >
                                                                                {/* Active Indicator line pointing to item */}
                                                                                <div className={`absolute -left-[13px] top-1/2 h-px w-3 bg-slate-200 transition-colors ${childActive ? 'bg-indigo-300' : 'group-hover/child:bg-indigo-200'}`} />
                                                                                
                                                                                <div className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${childActive ? 'bg-indigo-600 shadow-[0_0_0_2px_rgba(79,70,229,0.2)]' : 'bg-slate-300 group-hover/child:bg-indigo-400'}`} />
                                                                                <span className="tracking-wide">{child.name}</span>
                                                                            </Link>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;


