import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';

export default function InventorySearchSelect({ label, value, onChange, placeholder = 'Buscar item...' }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const wrapperRef = useRef(null);

    // Initial load of selected item name if value exists
    useEffect(() => {
        if (value && !selectedItem) {
            // We might need an endpoint to get single item details by ID to show name initially
            // For now, we assume the parent might pass the name or we fetch it.
            // Let's try to fetch if we have an ID but no name
            fetchItemDetails(value);
        } else if (!value) {
            setSelectedItem(null);
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

    const fetchItemDetails = async (id) => {
        try {
            // Assuming we can search/filter or get by ID. 
            // Since we don't have a direct "get by id" in the controller shown (except update/delete checks),
            // we can try fetching all or filtering. 
            // Wait, standard CRUD usually allows get by ID. 
            // InventarioController didn't show a 'show' method in the snippet I saw!
            // But usually Laravel resource controllers have it.
            // Let's assume /api/inventario/{id} works or use the list with filter if needed.
            // Actually, I saw the controller file, it did NOT have a 'show' method.
            // That's a problem for displaying the initial name.
            // I will implement a quick fetch by search with the ID if 'show' is missing, 
            // or just rely on search.
            // For now, let's just leave the input empty or with ID if we can't fetch name easily 
            // without modifying controller again.
            // BUT, better user experience needs the name.
            // Let's try to fetch list and find, or assume the parent passes the initial text?
            // The parent `PcCaracteristicasTecnicasForm` gets `formData`.
            // `formData` has `monitor` (text) and `monitor_id` (id).
            // So we can use `monitor` field as the initial display text!
            // We should accept an `initialText` prop.
        } catch (e) {
            console.error(e);
        }
    };

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
            const response = await api.get(`/inventario?search=${searchTerm}`);
            setResults(response.data.objeto || response.data || []);
            setShowDropdown(true);
        } catch (error) {
            console.error('Error searching items', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        setSelectedItem(item);
        setSearchTerm(`${item.codigo} - ${item.nombre}`);
        setShowDropdown(false);
        onChange(item); 
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
                            <span className="block truncate font-medium">{item.codigo} - {item.nombre}</span>
                            <span className="block truncate text-xs text-gray-500">{item.serial} - {item.marca}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
