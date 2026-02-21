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

    // Filter from combined options
    const filteredOptions = query === ''
        ? allOptions()
        : allOptions().filter((option) =>
            option.nombre?.toLowerCase().includes(query.toLowerCase())
        );

    // Match selected option from combined list
    const selectedOption = allOptions().find(p => String(p.id) === String(value));
    const selectedName = selectedOption ? formatName(selectedOption.nombre) : '';

    // Async search with debounce — only when local results are empty
    useEffect(() => {
        if (!onSearch || !isOpen || !query || query.length < 3) {
            setAsyncResults([]);
            return;
        }

        // Check if there are local matches already
        const localMatches = options.filter(o =>
            o.nombre?.toLowerCase().includes(query.toLowerCase())
        );
        if (localMatches.length > 0) {
            setAsyncResults([]);
            return;
        }

        // Debounce the async search
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const results = await onSearch(query.toUpperCase());
                setAsyncResults(Array.isArray(results) ? results : []);
            } catch (err) {
                console.error('Async search error:', err);
                setAsyncResults([]);
            } finally {
                setSearching(false);
            }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [query, isOpen, onSearch, options]);

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
            <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
            <div className="relative">
                <input
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 ${uppercase ? 'uppercase' : ''}`}
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
                    {searching && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                    )}
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {searching && (
                            <div className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 bg-indigo-50">
                                <MagnifyingGlassIcon className="h-4 w-4 animate-pulse" />
                                Buscando en Kubapp...
                            </div>
                        )}
                        {!searching && filteredOptions.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                {query.length >= 3 && onSearch
                                    ? 'No se encontró en BD local ni en Kubapp.'
                                    : query.length > 0 && query.length < 3 && onSearch
                                        ? 'Escriba al menos 3 caracteres para buscar en Kubapp...'
                                        : 'No se encontraron resultados.'}
                            </div>
                        ) : (
                            <>
                                {showKubappBadge && (
                                    <div className="px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border-b border-emerald-100 flex items-center gap-1">
                                        <MagnifyingGlassIcon className="h-3.5 w-3.5" />
                                        Resultados desde Kubapp (se guardarán automáticamente)
                                    </div>
                                )}
                                {filteredOptions.map((option) => {
                                    const isFromKubapp = asyncResults.find(ar => String(ar.id) === String(option.id));
                                    return (
                                        <div
                                            key={option.id}
                                            className={`relative cursor-pointer select-none py-2 pl-4 pr-9 ${String(value) === String(option.id)
                                                    ? 'bg-indigo-50 text-indigo-900'
                                                    : 'text-gray-900 hover:bg-gray-100'
                                                }`}
                                            onClick={() => {
                                                onChange(option.id);
                                                setQuery(formatName(option.nombre));
                                                setIsOpen(false);
                                            }}
                                        >
                                            <span className={`block truncate ${String(value) === String(option.id) ? 'font-semibold' : 'font-normal'
                                                }`}>
                                                {formatName(option.nombre)}
                                                {option.cedula && (
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        CC: {option.cedula}
                                                    </span>
                                                )}
                                            </span>
                                            {isFromKubapp && (
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                                                    Kubapp
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
