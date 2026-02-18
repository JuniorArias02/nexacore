import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';

const EquipoSearchSelect = ({ label, value, onChange, placeholder = "Buscar por serial, marca o modelo...", disabled = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const wrapperRef = useRef(null);

    // Initial load when value is provided (e.g. edit mode)
    useEffect(() => {
        if (value && !selectedItem) {
            // If value is passed but not selectedItem, we might need to fetch it to display name.
            // But usually value is just ID. If we don't have the object, we can't show name easily without fetching.
            // For now, let's try to fetch if value exists and we don't have display info.
            // Or assume parent handles initial data. 
            // Better: fetch specific item by ID.
            fetchItemById(value);
        } else if (!value) {
            setSelectedItem(null);
            setSearchTerm('');
        }
    }, [value]);

    const fetchItemById = async (id) => {
        try {
            const response = await api.get(`/pc-equipos/${id}`);
            const item = response.data.objeto || response.data;
            if (item) {
                setSelectedItem(item);
                setSearchTerm(`${item.serial} - ${item.marca} ${item.modelo}`);
            }
        } catch (error) {
            console.error("Error fetching equipo", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (term) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/pc-equipos?q=${term}`);
            let data = response.data.objeto || response.data || [];
            // Filter out if needed, but backend does it.
            setResults(data);
            setShowResults(true);
        } catch (error) {
            console.error("Error searching equipos", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        setSelectedItem(item);
        setSearchTerm(`${item.serial} - ${item.marca} ${item.modelo}`);
        setShowResults(false);
        if (onChange) {
            onChange(item); // Pass full item, parent can extract ID
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        if (searchTerm.length >= 2) setShowResults(true);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                {loading && (
                    <div className="absolute right-3 top-2.5">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0"
                        >
                            <div className="font-medium text-gray-800">{item.serial}</div>
                            <div className="text-sm text-gray-600">
                                {item.marca} {item.modelo}
                                {item.sede ? ` - ${item.sede.nombre}` : ''}
                                {item.area ? ` (${item.area.nombre})` : ''}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showResults && results.length === 0 && searchTerm.length >= 2 && !loading && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                    No se encontraron equipos.
                </div>
            )}
        </div>
    );
};

export default EquipoSearchSelect;
