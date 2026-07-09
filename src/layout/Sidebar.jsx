import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import menuConfig from '../config/menuConfig';
import { useLocation, Link } from 'react-router-dom';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, collapsed, setCollapsed }) => {
    const location = useLocation();
    const { hasAnyPermission } = useAuth();
    const [expandedItems, setExpandedItems] = useState({});
    
    
    const [expandedGroups, setExpandedGroups] = useState(() => {
        const initial = {};
        menuConfig.forEach(group => {
            initial[group.title] = false;
        });
        return initial;
    });

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



    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container - Dark Mode */}
            <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:fixed h-full flex flex-col bg-[#1c212c] border-r border-slate-800/50
                ${collapsed ? 'lg:w-20' : 'lg:w-[280px]'}
            `}>
                {/* Header / Logo Section */}
                <div className="relative h-20 flex items-center px-6 mb-4 shrink-0 mt-4">
                    <Link to="/dashboard" className="flex items-center gap-3 group w-full">
                        <div className="relative flex-shrink-0">
                            {/* Logo Icon */}
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">N</span>
                            </div>
                        </div>
                        
                        <div className={`flex flex-col transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            <span className="text-xl font-bold text-white tracking-wide">
                                Nexa<span className="text-slate-300">Core</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex absolute -right-3 top-7 h-6 w-6 rounded-full bg-[#2a303d] border border-slate-700 text-slate-400 hover:text-white items-center justify-center transition-all duration-300 z-50 hover:scale-110"
                    >
                        {collapsed ? <ChevronRightIcon className="h-3 w-3" /> : <ChevronLeftIcon className="h-3 w-3" />}
                    </button>
                    
                    <button onClick={onClose} className="lg:hidden absolute right-4 text-slate-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar pb-8 space-y-6">
                    {filteredNavigation.map((group, groupIndex) => {
                        const isGroupExpanded = expandedGroups[group.title];
                        
                        return (
                            <div key={groupIndex} className="relative">
                                {/* Group Header */}
                                {group.title && (
                                    <div 
                                        className={`flex items-center mb-3 cursor-pointer transition-colors hover:text-slate-200 text-[#64748b] ${collapsed ? 'justify-center' : 'justify-between'}`}
                                        onClick={() => !collapsed && toggleExpandGroup(group.title)}
                                    >
                                        {!collapsed ? (
                                            <>
                                                <h3 className="text-[11px] font-bold uppercase tracking-wider">
                                                    {group.title}
                                                </h3>
                                                <ChevronDownIcon 
                                                    className={`h-3.5 w-3.5 transition-transform duration-300 ${isGroupExpanded ? 'rotate-180' : ''}`}
                                                />
                                            </>
                                        ) : (
                                            <div className="h-px w-8 bg-slate-700" />
                                        )}
                                    </div>
                                )}
                                
                                {/* Group Items */}
                                <div className={`grid transition-all duration-300 ease-in-out ${(!collapsed && !isGroupExpanded && group.title) ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                                    <ul className="space-y-1.5 overflow-hidden">
                                        {group.items.map((item) => {
                                            const active = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                                            const hasChildren = item.children && item.children.length > 0;
                                            const isExpanded = expandedItems[item.href] || (active && !collapsed);

                                            return (
                                                <li key={item.name} className="relative">
                                                    <div className="group/item flex items-center">
                                                        <Link
                                                            to={item.href}
                                                            className={`
                                                                relative flex-1 flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                                                                ${active ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/20' : 'text-[#94a3b8] hover:text-white hover:bg-[#2a303d]'}
                                                                ${collapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}
                                                            `}
                                                            title={collapsed ? item.name : ''}
                                                            onClick={(e) => {
                                                                if (hasChildren) {
                                                                    e.preventDefault();
                                                                    toggleExpandItem(e, item.href);
                                                                } else if (window.innerWidth < 1024) {
                                                                    onClose();
                                                                }
                                                            }}
                                                        >
                                                            <item.icon 
                                                                className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-white' : 'text-[#64748b] group-hover/item:text-white'}`} 
                                                            />
                                                            
                                                            {!collapsed && (
                                                                <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                                                    {item.name}
                                                                </span>
                                                            )}

                                                            {!collapsed && active && !hasChildren && (
                                                                <div className="w-2 h-2 rounded-full bg-white ml-2 opacity-80" />
                                                            )}

                                                            {hasChildren && !collapsed && (
                                                                <ChevronRightIcon 
                                                                    className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                                                                />
                                                            )}
                                                        </Link>
                                                    </div>

                                                    {/* Nested Items */}
                                                    {hasChildren && !collapsed && (
                                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                                                            <ul className="pl-12 space-y-1 overflow-hidden py-1">
                                                                {item.children.map((child) => {
                                                                    const childActive = location.pathname === child.href;
                                                                    return (
                                                                        <li key={child.href}>
                                                                            <Link
                                                                                to={child.href}
                                                                                className={`
                                                                                    relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200
                                                                                    ${childActive ? 'text-white' : 'text-[#94a3b8] hover:text-white hover:bg-[#2a303d]'}
                                                                                `}
                                                                                onClick={() => window.innerWidth < 1024 && onClose()}
                                                                            >
                                                                                <span className="relative z-10 tracking-wide">{child.name}</span>
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



