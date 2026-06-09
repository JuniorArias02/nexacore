import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../../../services/api'; // Or use a specific service for this

export default function InventarioSearchSelect({ onSelect, error, initialValue = null, initialLabel = '' }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const wrapperRef = useRef(null);

    // Initial setup if we are editing
    useEffect(() => {
        if (initialValue && initialLabel) {
            setSelected({ id: initialValue, nombre: initialLabel });
            setQuery(initialLabel);
        }
    }, [initialValue, initialLabel]);

    // Handle clicks outside to close the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search function
    useEffect(() => {
        const searchInventario = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            if (selected && query === `${selected.codigo} - ${selected.nombre}`) {
                return; // Don't search if the query is just the selected item's label
            }

            try {
                setLoading(true);
                const response = await api.get(`/gestion-compras/inventario/buscar?q=${query}`);
                setResults(response.data.data || []);
                setIsOpen(true);
            } catch (err) {
                console.error("Error searching inventario:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchInventario, 300);
        return () => clearTimeout(timer);
    }, [query, selected]);

    const handleSelect = (item) => {
        setSelected(item);
        setQuery(`${item.codigo} - ${item.nombre}`);
        setIsOpen(false);
        onSelect(item);
    };

    const handleClear = () => {
        setSelected(null);
        setQuery('');
        setResults([]);
        onSelect(null);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                    type="text"
                    className={`block w-full pl-11 pr-10 py-3 bg-white border ${error ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-600'} rounded-xl outline-none transition-all text-slate-900 font-bold placeholder:font-normal placeholder:text-slate-400`}
                    placeholder="Buscar por código o nombre..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
                
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (query.length >= 2) && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-60 overflow-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm font-bold text-slate-400">
                            Buscando...
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex flex-col gap-1 border-b border-slate-50 last:border-0"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-900">{item.codigo}</span>
                                    </div>
                                    <span className="text-sm text-slate-600">{item.nombre}</span>
                                    {(item.marca || item.modelo) && (
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                            {item.marca} {item.modelo} {item.serial ? `| S/N: ${item.serial}` : ''}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm font-bold text-slate-400">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
