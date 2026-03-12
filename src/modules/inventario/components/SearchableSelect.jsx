import { useState, useEffect, useRef } from 'react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const defaultOptions = [];

export default function SearchableSelect({
    label,
    value,
    onChange,
    onSearch,
    options = defaultOptions,
    placeholder = "Seleccionar...",
    displayKey = "nombre",
    valueKey = "id",
    disabled = false,
    className = ""
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [internalOptions, setInternalOptions] = useState(options);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Update internal options when props change
    useEffect(() => {
        setInternalOptions(options);
    }, [options]);

    // Handle search with debounce
    useEffect(() => {
        if (!onSearch || !isOpen) return;

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await onSearch(query);
                if (results) setInternalOptions(results);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, onSearch, isOpen]);

    const selectedOption = internalOptions.find(opt => opt[valueKey] == value)
        || options.find(opt => opt[valueKey] == value);

    return (
        <div className={`w-full ${className}`} ref={wrapperRef}>
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    className={`
                        relative w-full cursor-default rounded-2xl border border-slate-100 
                        bg-slate-50/50 py-3 pl-4 pr-12 text-left transition-all duration-300
                        hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-100
                        focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200
                        sm:text-sm font-medium text-slate-700
                        ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}
                        ${isOpen ? 'bg-white shadow-xl shadow-indigo-500/10 border-indigo-200 ring-4 ring-indigo-500/5' : ''}
                    `}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <span className="block truncate">
                        {selectedOption ? selectedOption[displayKey] : (
                            <span className="text-slate-400 italic font-normal">{placeholder}</span>
                        )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className={`
                            p-1.5 rounded-xl transition-all duration-300
                            ${isOpen ? 'bg-indigo-600 text-white rotate-180' : 'bg-indigo-50 text-indigo-500'}
                        `}>
                            <ChevronUpDownIcon className="h-4 w-4" aria-hidden="true" />
                        </div>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-3 max-h-72 w-full overflow-hidden rounded-[1.5rem] bg-white text-base shadow-2xl ring-1 ring-slate-200 focus:outline-none sm:text-sm animate-fade-in-up">
                        {onSearch && (
                            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-3 border-b border-slate-50">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border-none rounded-xl py-2 pl-3 pr-10 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder:text-slate-400 transition-all"
                                        placeholder="Escribe para buscar..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        autoFocus
                                    />
                                    {loading && (
                                        <div className="absolute right-3 top-2.5">
                                            <div className="animate-spin h-3.5 w-3.5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="overflow-auto max-h-60 p-2 space-y-1">
                            {loading && internalOptions.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <div className="animate-pulse flex flex-col items-center">
                                        <div className="h-8 w-8 bg-indigo-50 rounded-full mb-2"></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Buscando...</p>
                                    </div>
                                </div>
                            ) : internalOptions.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sin resultados</p>
                                </div>
                            ) : (
                                internalOptions.map((option) => (
                                    <div
                                        key={option[valueKey]}
                                        className={`
                                            relative cursor-pointer select-none py-3 pl-4 pr-10 rounded-xl transition-all duration-200
                                            ${option[valueKey] == value 
                                                ? 'bg-indigo-50 text-indigo-700 font-bold' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:pl-6'}
                                        `}
                                        onClick={() => {
                                            onChange(option);
                                            setIsOpen(false);
                                            setQuery('');
                                        }}
                                    >
                                        <span className="block truncate text-sm">
                                            {option[displayKey]}
                                        </span>
                                        {option[valueKey] == value && (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <div className="bg-indigo-600 rounded-full p-0.5">
                                                    <CheckIcon className="h-3 w-3 text-white" aria-hidden="true" />
                                                </div>
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
