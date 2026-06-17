import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/**
 * SearchableSelect with optional async search (onSearch callback).
 *
 * Props:
 *  - options: static options array [{id, nombre, ...}]
 *  - onSearch: optional async fn(query) => [{id, nombre}] — called when local
 *    filtering returns no results (e.g. to query backend → Kubapp fallback)
 *  - uppercase: if true, display names in uppercase
 */
export default function SearchableSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    onSearch,
    uppercase = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [asyncResults, setAsyncResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    const formatName = (name) => uppercase && name ? name.toUpperCase() : name;

    // Combine static options + async results (deduplicate by id)
    const allOptions = useCallback(() => {
        const map = new Map();
        options.forEach(o => map.set(String(o.id), o));
        asyncResults.forEach(o => map.set(String(o.id), o));
        return [...map.values()];
    }, [options, asyncResults]);

    // Filter from combined options (Smart filtering: checks that all words in query are present)
    const filteredOptions = query === ''
        ? allOptions()
        : allOptions().filter((option) => {
            const name = option.nombre?.toLowerCase() || '';
            const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);
            return searchTerms.every(term => name.includes(term));
        });

    // Match selected option from combined list
    const selectedOption = allOptions().find(p => String(p.id) === String(value));
    const selectedName = selectedOption ? formatName(selectedOption.nombre) : '';

    // Async search logic — triggered manually by button
    const handleExternalSearch = async () => {
        if (!onSearch || !query || query.length < 3) return;

        setSearching(true);
        try {
            const results = await onSearch(query, true); // true indicates external search
            setAsyncResults(Array.isArray(results) ? results : []);
        } catch (err) {
            console.error('Async search error:', err);
            setAsyncResults([]);
        } finally {
            setSearching(false);
        }
    };

    // Remove the automatic useEffect search
    useEffect(() => {
        if (!isOpen || !query) {
            setAsyncResults([]);
        }
    }, [query, isOpen]);

    // Handle clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Sync query with selected value when dropdown closes
    useEffect(() => {
        if (!isOpen && value) {
            setQuery(selectedName);
        } else if (!isOpen && !value) {
            setQuery('');
        }
    }, [isOpen, value, selectedName]);

    const showKubappBadge = asyncResults.length > 0 && filteredOptions.some(o =>
        asyncResults.find(ar => String(ar.id) === String(o.id))
    );

    return (
        <div className="relative group" ref={wrapperRef}>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label} *</label>
            <div className="relative">
                <input
                    type="text"
                    className={`w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 text-slate-700 font-medium placeholder:text-slate-400 ${uppercase ? 'uppercase' : ''}`}
                    placeholder={placeholder}
                    value={isOpen ? query : (selectedName || query)}
                    onChange={(event) => {
                        const val = uppercase ? event.target.value.toUpperCase() : event.target.value;
                        setQuery(val);
                        setIsOpen(true);
                        if (event.target.value === '') {
                            onChange('');
                        }
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setQuery('');
                    }}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
                    {searching && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                    )}
                    <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} aria-hidden="true" />
                </div>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-100 py-2 text-base shadow-[0_20px_60px_-10px_rgba(79,70,229,0.15)] focus:outline-none sm:text-sm flex flex-col gap-1">
                        {searching && (
                            <div className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 bg-indigo-50">
                                <MagnifyingGlassIcon className="h-4 w-4 animate-pulse" />
                                Buscando en Kubapp...
                            </div>
                        )}
                        {!searching && filteredOptions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                <div className="p-3 bg-slate-50 rounded-2xl mb-3">
                                    <MagnifyingGlassIcon className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mb-1">Personal no encontrado</p>
                                <p className="text-[10px] font-medium tracking-widest uppercase text-slate-400 mb-4">No se encuentra en la base de datos local.</p>
                                
                                {onSearch && query.length >= 3 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleExternalSearch();
                                        }}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-200"
                                    >
                                        <MagnifyingGlassIcon className="h-4 w-4" />
                                        Buscar en Servicios Externos
                                    </button>
                                )}
                                {onSearch && query.length > 0 && query.length < 3 && (
                                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                                        Escriba al menos 3 caracteres
                                    </p>
                                )}
                            </div>
                        ) : (
                            <>
                                {showKubappBadge && (
                                    <div className="mx-2 mb-1 px-4 py-2 text-[10px] font-black tracking-widest uppercase text-emerald-700 bg-emerald-50/80 rounded-xl border border-emerald-100 flex items-center gap-2">
                                        <MagnifyingGlassIcon className="h-3.5 w-3.5" />
                                        Resultados Externos
                                    </div>
                                )}
                                {filteredOptions.map((option) => {
                                    const isFromKubapp = asyncResults.find(ar => String(ar.id) === String(option.id));
                                    return (
                                        <div
                                            key={option.id}
                                            className={`relative cursor-pointer select-none py-3 px-4 mx-2 rounded-xl transition-all duration-200 group/item flex items-center justify-between ${String(value) === String(option.id)
                                                    ? 'bg-indigo-50/80 text-indigo-900 font-bold'
                                                    : 'text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-700'
                                                }`}
                                            onClick={() => {
                                                onChange(option.id);
                                                setQuery(formatName(option.nombre));
                                                setIsOpen(false);
                                            }}
                                        >
                                            <span className={`block truncate ${String(value) === String(option.id) ? 'font-extrabold' : 'font-medium group-hover/item:scale-[1.02] origin-left transition-transform duration-300'
                                                }`}>
                                                {formatName(option.nombre)}
                                                {option.cedula && (
                                                    <span className="ml-2 text-[10px] text-slate-400 font-black tracking-widest">
                                                        CC: {option.cedula}
                                                    </span>
                                                )}
                                            </span>
                                            {isFromKubapp && (
                                                <span className="text-[9px] font-black tracking-widest px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200/50 shadow-sm">
                                                    API
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
