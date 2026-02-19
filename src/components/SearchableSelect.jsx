import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function SearchableSelect({ label, options, value, onChange, placeholder = "Seleccionar..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef(null);

    // Filter options based on query
    const filteredOptions = query === ''
        ? options
        : options.filter((option) =>
            option.nombre.toLowerCase().includes(query.toLowerCase())
        );

    // Match selected option
    const selectedName = options.find(p => String(p.id) === String(value))?.nombre || '';

    useEffect(() => {
        console.log(`SearchableSelect [${label}]:`, { value, optionsCount: options.length, foundName: selectedName });
    }, [value, options.length, selectedName]);

    // Handle clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        if (!isOpen && value) {
            setQuery(selectedName);
        } else if (!isOpen && !value) {
            setQuery('');
        }
    }, [isOpen, value, selectedName]);

    return (
        <div className="relative group" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
            <div className="relative">
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOptions.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                No se encontraron resultados.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`relative cursor-default select-none py-2 pl-4 pr-9 ${String(value) === String(option.id) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900 hover:bg-gray-100'
                                        }`}
                                    onClick={() => {
                                        onChange(option.id);
                                        setQuery(option.nombre);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className={`block truncate ${String(value) === String(option.id) ? 'font-semibold' : 'font-normal'}`}>
                                        {option.nombre}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
