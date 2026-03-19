import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchableSelect({ 
    label, 
    options = [], 
    value, 
    onChange, 
    onSearch,
    placeholder = "Seleccionar...",
    displayKey = "nombre",
    valueKey = "id"
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef(null);

    // Smart filtering
    const filteredOptions = query === ''
        ? options
        : options.filter((item) => {
            const name = item[displayKey]?.toString().toLowerCase() || '';
            return name.includes(query.toLowerCase());
        });

    // Find selected name for display
    const selectedOption = options.find(p => String(p[valueKey]) === String(value));
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
                            onChange('');
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
                                onChange('');
                                setQuery('');
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Limpiar"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}
                    <div className="pointer-events-none">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                </div>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredOptions.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-xs text-gray-500 italic">
                                No se encontraron resultados.
                            </div>
                        ) : (
                            filteredOptions.map((item) => (
                                <div
                                    key={item[valueKey]}
                                    className={`relative cursor-default select-none py-2.5 pl-4 pr-9 transition-colors ${String(value) === String(item[valueKey]) 
                                        ? 'bg-indigo-50 text-indigo-900 font-semibold' 
                                        : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                                    }`}
                                    onClick={() => {
                                        onChange(item[valueKey]);
                                        setQuery(item[displayKey]);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="block truncate">
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
