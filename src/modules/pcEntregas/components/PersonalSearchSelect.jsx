import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';

export default function PersonalSearchSelect({ label, value, onChange, placeholder = 'Buscar funcionario...' }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Effect to handle initial value (assuming value is ID, we might not have name initially unless passed)
    // For now, simpler approach: if value is empty, clear search term.
    useEffect(() => {
        if (!value) {
            setSearchTerm('');
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length > 1) {
                searchItems();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchItems = async () => {
        setLoading(true);
        try {
            // Personal controller uses 'q' or we check PersonalService
            // PersonalController index: return ApiResponse::success($this->service->getAll($request->get('q')), ...);
            const response = await api.get(`/personal?q=${searchTerm}`);
            setResults(response.data.objeto || []);
            setShowDropdown(true);
        } catch (error) {
            console.error('Error searching personal', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        setSearchTerm(`${item.nombre} - ${item.cedula || 'S/C'}`);
        setShowDropdown(false);
        onChange(item); // Pass full item
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!e.target.value) {
                        onChange(null);
                    }
                }}
                onFocus={() => {
                    if (results.length > 0) setShowDropdown(true);
                }}
            />
            {loading && (
                <div className="absolute right-3 top-9">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {showDropdown && results.length > 0 && (
                <ul className="absolute z-10 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm mt-1">
                    {results.map((item) => (
                        <li
                            key={item.id}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 text-gray-900"
                            onClick={() => handleSelect(item)}
                        >
                            <span className="block truncate font-medium">{item.nombre}</span>
                            <span className="block truncate text-xs text-gray-500">CC: {item.cedula} - Cargo: {item.cargo?.nombre || 'N/A'}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
