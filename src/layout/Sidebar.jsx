import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import menuConfig from '../config/menuConfig';
import { useLocation, Link } from 'react-router-dom';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, collapsed, setCollapsed }) => {
    const location = useLocation();
    const { hasAnyPermission } = useAuth();
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (key) => {
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Filter menu items based on user permissions
    const filteredNavigation = menuConfig.reduce((acc, group) => {
        if (hasAnyPermission(group.permissions)) {
            const filteredItems = group.items.filter(item =>
                hasAnyPermission(item.permissions)
            ).map(item => {
                // Also filter children by permission
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
        }
        return acc;
    }, []);

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-200 ease-in-out transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:fixed lg:z-50 h-full flex flex-col border-r border-gray-200
                ${collapsed ? 'lg:w-20' : 'lg:w-72'}
            `}>
                <div className={`flex h-16 items-center justify-between px-4 border-b border-gray-100 transition-all duration-200 ease-in-out ${collapsed ? 'justify-center' : ''}`}>
                    <Link to="/dashboard" className={`flex items-center gap-2 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
                        <div className="h-8 w-8 min-w-[2rem] rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <span className={`text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out ${collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                            NexaCore
                        </span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    {/* Desktop Toggle Button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`hidden lg:flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-indigo-600 transition-colors absolute -right-3 top-5 border border-gray-200 shadow-sm`}
                    >
                        {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-y-7 px-3 py-6 overflow-y-auto overflow-x-hidden">
                    {filteredNavigation.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-2">
                            {group.title && group.title !== 'Principal' && (
                                <h3 className={`px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-all duration-200 ease-in-out ${collapsed ? 'text-center' : ''}`}>
                                    {collapsed ? '•' : group.title}
                                </h3>
                            )}
                            <ul role="list" className="-mx-2 space-y-1">
                                {group.items.map((item) => {
                                    const active = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                                    const hasChildren = item.children && item.children.length > 0;
                                    const isExpanded = expandedItems[item.href] || active;

                                    return (
                                        <li key={item.name}>
                                            <div className="flex items-center">
                                                <Link
                                                    to={item.href}
                                                    className={`
                                                        group flex-1 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200
                                                        ${active
                                                            ? 'bg-indigo-50 text-indigo-600'
                                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                                        }
                                                        ${collapsed ? 'justify-center' : ''}
                                                    `}
                                                    onClick={() => window.innerWidth < 1024 && !hasChildren && onClose()}
                                                    title={collapsed ? item.name : ''}
                                                >
                                                    <item.icon
                                                        className={`h-6 w-6 shrink-0 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`}
                                                        aria-hidden="true"
                                                    />
                                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out ${collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                                                        {item.name}
                                                    </span>
                                                </Link>
                                                {hasChildren && !collapsed && (
                                                    <button
                                                        onClick={() => toggleExpand(item.href)}
                                                        className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Sub-items */}
                                            {hasChildren && !collapsed && isExpanded && (
                                                <ul className="mt-1 ml-9 space-y-0.5">
                                                    {item.children.map((child) => {
                                                        const childActive = location.pathname === child.href;
                                                        return (
                                                            <li key={child.href}>
                                                                <Link
                                                                    to={child.href}
                                                                    className={`
                                                                        group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200
                                                                        ${childActive
                                                                            ? 'text-indigo-600 bg-indigo-50'
                                                                            : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                                                                        }
                                                                    `}
                                                                    onClick={() => window.innerWidth < 1024 && onClose()}
                                                                >
                                                                    {child.icon && (
                                                                        <child.icon className={`h-4 w-4 shrink-0 ${childActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                                                                    )}
                                                                    {child.name}
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
            </div>
        </>
    );
};

export default Sidebar;
