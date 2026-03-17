import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { DocumentMagnifyingGlassIcon, CubeIcon } from '@heroicons/react/24/outline';

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
            fetchItemById(value);
        } else if (!value) {
            setSelectedItem(null);
            setSearchTerm('');
        }
    }, [value, selectedItem]);

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
            onChange(item);
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2">
                    {label}
                </label>
            )}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DocumentMagnifyingGlassIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        if (searchTerm.length >= 2) setShowResults(true);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold placeholder:text-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
                />
                {loading && (
                    <div className="absolute right-4 top-4">
                        <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-[100] w-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                        {results.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl transition-colors group/item"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                                        <CubeIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">{item.serial}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                                            {item.marca} {item.modelo}
                                        </p>
                                        {(item.sede || item.area) && (
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter mt-1">
                                                {item.sede?.nombre} {item.area ? `/ ${item.area.nombre}` : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showResults && results.length === 0 && searchTerm.length >= 2 && !loading && (
                <div className="absolute z-[100] w-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 text-center animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <DocumentMagnifyingGlassIcon className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sin coincidencias encontradas</p>
                </div>
            )}
        </div>
    );
};

export default EquipoSearchSelect;
