import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import menuConfig from '../config/menuConfig';
import { useAuth } from '../context/AuthContext';

const GlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { hasAnyPermission } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Flatten menu to searchable items
    const searchableItems = useMemo(() => {
        const flatList = [];
        menuConfig.forEach(group => {
            group.items.forEach(item => {
                if (hasAnyPermission(item.permissions)) {
                    flatList.push({
                        ...item,
                        category: group.title
                    });
                    
                    if (item.children) {
                        item.children.forEach(child => {
                            if (hasAnyPermission(child.permissions)) {
                                flatList.push({
                                    ...child,
                                    category: `${group.title} / ${item.name}`,
                                    parentHref: item.href
                                });
                            }
                        });
                    }
                }
            });
        });
        return flatList;
    }, [hasAnyPermission]);

    const results = useMemo(() => {
        if (query.length < 2) return [];
        return searchableItems.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8); // Limit results
    }, [query, searchableItems]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check for K key regardless of case
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen(true);
                // Use setTimeout to ensure the focus happens after the state update has rendered the expanded input
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 10);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
                inputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);



    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (href) => {
        navigate(href);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className={`
                flex items-center bg-slate-50 border transition-all duration-300 rounded-2xl px-3 py-1.5
                ${isOpen ? 'ring-4 ring-indigo-500/10 border-indigo-200 bg-white w-64 md:w-80 shadow-lg' : 'border-slate-100 w-40 md:w-56'}
            `}>
                <MagnifyingGlassIcon className={`h-4 w-4 transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-400'}`} />
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Buscar (Cmd + K)" 
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs font-bold text-slate-600 placeholder:text-slate-300 w-full ml-2 uppercase tracking-tighter" 
                />
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-3">
                        <div className="px-4 py-2 border-b border-slate-50 mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {results.length > 0 ? `Resultados para "${query}"` : 'No se encontraron coincidencias'}
                            </span>
                        </div>
                        
                        <div className="space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {results.map((item, index) => (
                                <button
                                    key={`${item.href}-${index}`}
                                    onClick={() => handleSelect(item.href)}
                                    className="w-full flex items-center gap-3 p-3 rounded-[1.25rem] hover:bg-slate-50 group transition-all"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {item.icon ? <item.icon className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 uppercase tracking-tighter">
                                            {item.name}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            {item.category}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {results.length > 0 && (
                            <div className="mt-3 p-3 bg-slate-50/50 rounded-2xl flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Navegación Rápida</span>
                                <div className="flex gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[8px] font-black text-slate-400">ESC</kbd>
                                    <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[8px] font-black text-slate-400">ENTER</kbd>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
