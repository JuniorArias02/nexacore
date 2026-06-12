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

    const handleExternalDownload = async (e, url, name) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = name || url.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // Fallback
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.click();
        }
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

    // Función para obtener el color base para el efecto Glassmorphism y Neon Glow
    const getGlowColor = (colorClass, alpha = 0.2) => {
        if (!colorClass) return `rgba(99, 102, 241, ${alpha})`; // indigo-500 por defecto
        if (colorClass.includes('emerald')) return `rgba(16, 185, 129, ${alpha})`;
        if (colorClass.includes('amber')) return `rgba(245, 158, 11, ${alpha})`;
        if (colorClass.includes('rose')) return `rgba(225, 29, 72, ${alpha})`;
        if (colorClass.includes('fuchsia')) return `rgba(192, 38, 211, ${alpha})`;
        if (colorClass.includes('blue')) return `rgba(37, 99, 235, ${alpha})`;
        if (colorClass.includes('violet')) return `rgba(124, 58, 237, ${alpha})`;
        return `rgba(99, 102, 241, ${alpha})`;
    };

    return (
        <>
            {/* Mobile backdrop with premium blur */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-md transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container - Glassmorphism Style */}
            <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:fixed h-full flex flex-col
                ${collapsed ? 'lg:w-24' : 'lg:w-80'}
            `}
            style={{
                background: 'rgba(248, 250, 255, 0.55)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                borderRight: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: '6px 0 32px rgba(99, 102, 241, 0.06), inset -1px 0 0 rgba(255,255,255,0.5)'
            }}>
                {/* Header / Logo Section */}
                <div className="relative h-24 flex items-center px-6 mb-2 shrink-0">
                    <Link to="/dashboard" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.25)] border border-white/20 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                <span className="text-white font-black text-2xl relative z-10">N</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {/* Status Indicator */}
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                        </div>
                        
                        <div className={`flex flex-col transition-all duration-500 ${collapsed ? 'opacity-0 scale-95 pointer-events-none w-0' : 'opacity-100 scale-100'}`}>
                            <span className="text-xl font-black text-slate-800 tracking-tighter leading-none drop-shadow-sm">
                                NEXA<span className="text-indigo-600">CORE</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                                
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Toggle - Glassy style */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex absolute -right-3 top-9 h-6 w-6 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-500 hover:text-indigo-600 shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center justify-center transition-all duration-300 z-50 hover:scale-110"
                    >
                        {collapsed ? <ChevronRightIcon className="h-3 w-3" /> : <ChevronLeftIcon className="h-3 w-3" />}
                    </button>
                    
                    <button onClick={onClose} className="lg:hidden absolute right-4 text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-8 space-y-2">
                    {filteredNavigation.map((group, groupIndex) => {
                        const isGroupExpanded = expandedGroups[group.title];
                        
                        return (
                            <div key={groupIndex} className="relative p-2 mb-1">
                                {/* Group Header */}
                                <div 
                                    className={`relative flex items-center mb-2 px-2 transition-all duration-300 ${collapsed ? 'justify-center' : 'cursor-pointer hover:bg-white/40 rounded-xl py-2'}`}
                                    onClick={() => !collapsed && toggleExpandGroup(group.title)}
                                >
                                    {!collapsed ? (
                                        <div className="flex items-center justify-between w-full relative z-10">
                                            <div className="flex items-center gap-2">
                                                {group.icon && (
                                                    <div 
                                                        className={`p-1.5 rounded-lg ${group.iconColor || 'text-slate-500'}`}
                                                        style={{
                                                            backgroundColor: getGlowColor(group.iconColor, 0.12),
                                                            border: `1px solid ${getGlowColor(group.iconColor, 0.2)}`
                                                        }}
                                                    >
                                                        <group.icon className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <h3 
                                                    className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${group.iconColor || 'text-slate-500'}`}
                                                    style={{
                                                        backgroundColor: getGlowColor(group.iconColor, 0.1),
                                                    }}
                                                >
                                                    {group.title}
                                                </h3>
                                            </div>
                                            <ChevronDownIcon 
                                                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${isGroupExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative flex justify-center w-full py-2 group/tooltip z-10">
                                            {group.icon ? (
                                                <div className={`p-2 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] bg-white/60 backdrop-blur-md border border-white/60 ${group.iconColor || 'text-slate-500'}`}>
                                                    <group.icon className="h-5 w-5" />
                                                </div>
                                            ) : (
                                                <div className="h-px w-8 bg-slate-200" />
                                            )}
                                            {/* Tooltip for collapsed state */}
                                            <div className="absolute left-14 px-3 py-1.5 bg-white/90 backdrop-blur-md border border-white/50 text-slate-800 text-xs font-bold rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap z-50 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
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
                                                    <div className="group/item flex items-center">
                                                        {item.external ? (
                                                            <a
                                                                href={item.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download
                                                                className={`
                                                                    relative flex-1 flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300
                                                                    ${active ? 'text-slate-800' : 'text-slate-600 hover:text-slate-800'}
                                                                    ${collapsed ? 'justify-center px-0 h-12 w-12 mx-auto rounded-2xl' : ''}
                                                                `}
                                                                title={collapsed ? item.name : ''}
                                                                onClick={(e) => handleExternalDownload(e, item.href, item.name)}
                                                            >
                                                                {/* Glass + Neon Glow Background */}
                                                                <div 
                                                                    className={`absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none backdrop-blur-sm ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98] group-hover/item:opacity-100 group-hover/item:scale-100'}`}
                                                                    style={{
                                                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                                        boxShadow: `0 4px 24px -4px ${getGlowColor(group.iconColor, active ? 0.4 : 0.25)}`,
                                                                        border: '1px solid rgba(255,255,255,0.9)'
                                                                    }}
                                                                />

                                                                <item.icon 
                                                                    className={`relative z-10 h-5 w-5 shrink-0 transition-all duration-500 ${active ? 'scale-110 drop-shadow-sm' : 'text-slate-400 group-hover/item:scale-110 group-hover/item:text-slate-600'}`} 
                                                                    style={active ? { color: getGlowColor(group.iconColor, 1) } : {}} 
                                                                />
                                                                {!collapsed && (
                                                                    <span className="relative z-10 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                                                        {item.name}
                                                                    </span>
                                                                )}
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                to={item.href}
                                                                className={`
                                                                    relative flex-1 flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300
                                                                    ${active ? 'text-slate-800' : 'text-slate-600 hover:text-slate-800'}
                                                                    ${collapsed ? 'justify-center px-0 h-12 w-12 mx-auto rounded-2xl' : ''}
                                                                `}
                                                                title={collapsed ? item.name : ''}
                                                                onClick={() => window.innerWidth < 1024 && !hasChildren && onClose()}
                                                            >
                                                                {/* Glass + Neon Glow Background */}
                                                                <div 
                                                                    className={`absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none backdrop-blur-sm ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98] group-hover/item:opacity-100 group-hover/item:scale-100'}`}
                                                                    style={{
                                                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                                        boxShadow: `0 4px 24px -4px ${getGlowColor(group.iconColor, active ? 0.4 : 0.25)}`,
                                                                        border: '1px solid rgba(255,255,255,0.9)'
                                                                    }}
                                                                />

                                                                {/* Indicador de activo lateral con color del grupo */}
                                                                {active && !collapsed && (
                                                                    <div 
                                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full z-20 transition-all duration-500" 
                                                                        style={{ 
                                                                            backgroundColor: getGlowColor(group.iconColor, 1),
                                                                            boxShadow: `0 0 10px ${getGlowColor(group.iconColor, 0.8)}`
                                                                        }}
                                                                    />
                                                                )}

                                                                <item.icon 
                                                                    className={`relative z-10 h-5 w-5 shrink-0 transition-all duration-500 ${active ? 'scale-110 drop-shadow-sm' : 'text-slate-400 group-hover/item:scale-110 group-hover/item:text-slate-600'}`} 
                                                                    style={active ? { color: getGlowColor(group.iconColor, 1) } : {}} 
                                                                />
                                                                
                                                                {!collapsed && (
                                                                    <span className="relative z-10 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                                                        {item.name}
                                                                    </span>
                                                                )}

                                                                {hasChildren && !collapsed && (
                                                                    <ChevronDownIcon 
                                                                        onClick={(e) => toggleExpandItem(e, item.href)}
                                                                        className={`relative z-10 h-4 w-4 transition-transform duration-300 hover:bg-white/50 rounded-full p-0.5 ${isExpanded ? 'rotate-180' : ''} ${active ? '' : 'text-slate-400 group-hover/item:text-slate-600'}`} 
                                                                        style={active ? { color: getGlowColor(group.iconColor, 1) } : {}} 
                                                                    />
                                                                )}
                                                            </Link>
                                                        )}
                                                    </div>

                                                    {/* Nested Items */}
                                                    {hasChildren && !collapsed && (
                                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                                                            <ul className="ml-10 pl-3 border-l border-slate-200/50 space-y-1 overflow-hidden py-1">
                                                                {item.children.map((child) => {
                                                                    const childActive = location.pathname === child.href;
                                                                    return (
                                                                        <li key={child.href}>
                                                                            {child.external ? (
                                                                                <a
                                                                                    href={child.href}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    download
                                                                                    className={`
                                                                                        group/child relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300
                                                                                        ${childActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}
                                                                                    `}
                                                                                    onClick={(e) => handleExternalDownload(e, child.href, child.name)}
                                                                                >
                                                                                    {/* Sub-item Glass Background */}
                                                                                    <div 
                                                                                        className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none backdrop-blur-sm ${childActive ? 'opacity-100' : 'opacity-0 group-hover/child:opacity-100'}`}
                                                                                        style={{
                                                                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                                                            boxShadow: childActive ? `0 2px 12px -2px ${getGlowColor(group.iconColor, 0.2)}` : 'none',
                                                                                            border: '1px solid rgba(255,255,255,0.6)'
                                                                                        }}
                                                                                    />
                                                                                    
                                                                                    {/* Active Indicator line pointing to item */}
                                                                                    <div 
                                                                                        className="absolute -left-[13px] top-1/2 h-px w-3 transition-colors duration-300" 
                                                                                        style={{ backgroundColor: childActive ? getGlowColor(group.iconColor, 0.6) : 'rgba(203, 213, 225, 0.5)' }}
                                                                                    />
                                                                                    
                                                                                    <div 
                                                                                        className="relative z-10 h-1.5 w-1.5 rounded-full transition-all duration-300" 
                                                                                        style={{ 
                                                                                            backgroundColor: childActive ? getGlowColor(group.iconColor, 1) : 'rgba(203, 213, 225, 1)',
                                                                                            boxShadow: childActive ? `0 0 0 2px ${getGlowColor(group.iconColor, 0.2)}` : 'none'
                                                                                        }}
                                                                                    />
                                                                                    <span className="relative z-10 tracking-wide">{child.name}</span>
                                                                                </a>
                                                                            ) : (
                                                                                <Link
                                                                                    to={child.href}
                                                                                    className={`
                                                                                        group/child relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300
                                                                                        ${childActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}
                                                                                    `}
                                                                                    onClick={() => window.innerWidth < 1024 && onClose()}
                                                                                >
                                                                                    {/* Sub-item Glass Background */}
                                                                                    <div 
                                                                                        className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none backdrop-blur-sm ${childActive ? 'opacity-100' : 'opacity-0 group-hover/child:opacity-100'}`}
                                                                                        style={{
                                                                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                                                            boxShadow: childActive ? `0 2px 12px -2px ${getGlowColor(group.iconColor, 0.2)}` : 'none',
                                                                                            border: '1px solid rgba(255,255,255,0.6)'
                                                                                        }}
                                                                                    />
                                                                                    
                                                                                    {/* Active Indicator line pointing to item */}
                                                                                    <div 
                                                                                        className="absolute -left-[13px] top-1/2 h-px w-3 transition-colors duration-300" 
                                                                                        style={{ backgroundColor: childActive ? getGlowColor(group.iconColor, 0.6) : 'rgba(203, 213, 225, 0.5)' }}
                                                                                    />
                                                                                    
                                                                                    <div 
                                                                                        className="relative z-10 h-1.5 w-1.5 rounded-full transition-all duration-300" 
                                                                                        style={{ 
                                                                                            backgroundColor: childActive ? getGlowColor(group.iconColor, 1) : 'rgba(203, 213, 225, 1)',
                                                                                            boxShadow: childActive ? `0 0 0 2px ${getGlowColor(group.iconColor, 0.2)}` : 'none'
                                                                                        }}
                                                                                    />
                                                                                    <span className="relative z-10 tracking-wide">{child.name}</span>
                                                                                </Link>
                                                                            )}
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



