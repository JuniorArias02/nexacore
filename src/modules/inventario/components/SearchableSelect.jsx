import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchableSelect({ 
    label, 
    options = [], 
    value, 
    onChange, 
    onSearch,
    onExternalSearch,
    placeholder = "Seleccionar...",
    displayKey = "nombre",
    valueKey = "id",
    returnObject = false,
    secondaryKey = null
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [internalOptions, setInternalOptions] = useState(options);
    const [isLoading, setIsLoading] = useState(false);
    const [isExternalLoading, setIsExternalLoading] = useState(false);
    const wrapperRef = useRef(null);

    const handleExternalSearch = async () => {
        if (!onExternalSearch || !query) return;
        
        setIsExternalLoading(true);
        try {
            const results = await onExternalSearch(query);
            setInternalOptions(results || []);
            
            // Si hay resultados externos, seleccionar el primero automáticamente como pide la UX
            if (results && results.length > 0) {
                const first = results[0];
                onChange(returnObject ? first : first[valueKey]);
                setQuery(first[displayKey]);
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Error on external search:', error);
        } finally {
            setIsExternalLoading(false);
        }
    };

    // Sync options prop to internal options if changed
    useEffect(() => {
        if (!onSearch) {
            setInternalOptions(options);
        } else if (options.length > 0 && query === '') {
            setInternalOptions(options);
        }
    }, [options, onSearch, query]);

    // Handle onSearch effect with debounce
    useEffect(() => {
        if (!onSearch) return;

        const timer = setTimeout(async () => {
            if (query && query.length >= 2 && isOpen) {
                setIsLoading(true);
                try {
                    const results = await onSearch(query);
                    setInternalOptions(results || []);
                } catch (error) {
                    console.error('Error on search:', error);
                    setInternalOptions([]);
                } finally {
                    setIsLoading(false);
                }
            } else if (!query) {
                setInternalOptions(options);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query, onSearch, isOpen, options]);

    // Smart filtering for local options
    const filteredOptions = onSearch
        ? internalOptions
        : (query === ''
            ? internalOptions
            : internalOptions.filter((item) => {
                const name = item[displayKey]?.toString().toLowerCase() || '';
                return name.includes(query.toLowerCase());
            }));

    // Find selected name for display
    const selectedOption = internalOptions.find(p => String(p[valueKey]) === String(value)) || options.find(p => String(p[valueKey]) === String(value));
    const selectedName = selectedOption ? selectedOption[displayKey] : '';

    // Handle clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen && value) {
            setQuery(selectedName);
        } else if (!isOpen && !value) {
            setQuery('');
        }
    }, [isOpen, value, selectedName]);

    return (
        <div className="relative group" ref={wrapperRef}>
            {label && <label className="block text-xs font-medium text-gray-500 mb-1 ml-1 uppercase tracking-wider">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    className="block w-full rounded-2xl border-0 py-3 pl-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white"
                    placeholder={placeholder}
                    value={isOpen ? query : (selectedName || query)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                        if (event.target.value === '') {
                            onChange(returnObject ? {} : '');
                        }
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setQuery('');
                    }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                    {value && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(returnObject ? {} : '');
                                setQuery('');
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Limpiar"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}
                    <div className="pointer-events-none">
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        )}
                    </div>
                </div>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                        {isLoading ? (
                            <div className="flex items-center gap-2 px-4 py-3 text-sm text-indigo-600 bg-indigo-50">
                                <MagnifyingGlassIcon className="h-4 w-4 animate-pulse" />
                                Buscando...
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="p-4 text-center">
                                <p className="text-xs text-gray-500 italic mb-3">
                                    No se encontraron resultados en la base de datos local.
                                </p>
                                {onExternalSearch && (
                                    <button
                                        type="button"
                                        disabled={isExternalLoading}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleExternalSearch();
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                                    >
                                        {isExternalLoading ? (
                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <MagnifyingGlassIcon className="h-3.5 w-3.5" />
                                        )}
                                        {isExternalLoading ? 'Buscando...' : 'Buscar por servicio externo'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredOptions.map((item, index) => (
                                <div
                                    key={item[valueKey] || index}
                                    className={`relative cursor-default select-none py-2.5 pl-4 pr-9 transition-colors ${String(value) === String(item[valueKey]) 
                                        ? 'bg-indigo-50 text-indigo-900 font-semibold' 
                                        : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                                    }`}
                                    onClick={() => {
                                        onChange(returnObject ? item : item[valueKey]);
                                        setQuery(item[displayKey]);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="block truncate">
                                        {secondaryKey && item[secondaryKey] && (
                                            <span className="mr-2 text-xs font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase leading-none">
                                                {item[secondaryKey]}
                                            </span>
                                        )}
                                        {item[displayKey]}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
