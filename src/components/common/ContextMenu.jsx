import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Reusable Context Menu Component
 * @param {Array} items - List of menu items [{ label, icon: Icon, onClick, permission, className }]
 * @param {Object} position - { x, y } coordinates
 * @param {Function} onClose - Function to close the menu
 */
const ContextMenu = ({ items, position, onClose }) => {
    const menuRef = useRef(null);
    const { hasPermission } = useAuth();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Prevent default context menu on the menu itself
    const handleContextMenu = (e) => {
        e.preventDefault();
    };

    // Filter items based on permissions
    const visibleItems = items.filter(item => {
        if (!item.permission) return true;
        return hasPermission(item.permission);
    });

    if (visibleItems.length === 0) return null;

    return (
        <div
            ref={menuRef}
            className="fixed z-[100] min-w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 py-2 animate-in fade-in zoom-in duration-100"
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
            }}
            onContextMenu={handleContextMenu}
        >
            <div className="flex flex-col">
                {visibleItems.map((item, index) => (
                    <button
                        key={index}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 text-slate-700 ${item.className || ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            item.onClick();
                            onClose();
                        }}
                    >
                        {item.icon && <item.icon className="h-4 w-4 opacity-70" />}
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ContextMenu;
