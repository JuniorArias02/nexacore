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
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative mt-1">
                <button
                    type="button"
                    className={`relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <span className="block truncate">
                        {selectedOption ? selectedOption[displayKey] : placeholder}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {onSearch && (
                            <div className="sticky top-0 bg-white p-2 border-b">
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Buscar..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        {loading ? (
                            <div className="p-2 text-gray-500 text-center">Cargando...</div>
                        ) : internalOptions.length === 0 ? (
                            <div className="p-2 text-gray-500 text-center">No se encontraron resultados</div>
                        ) : (
                            internalOptions.map((option) => (
                                <div
                                    key={option[valueKey]}
                                    className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white ${option[valueKey] == value ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                >
                                    <span className={`block truncate ${option[valueKey] == value ? 'font-semibold' : 'font-normal'}`}>
                                        {option[displayKey]}
                                    </span>
                                    {option[valueKey] == value && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
