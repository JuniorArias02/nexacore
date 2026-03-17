import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function PersonalSearchSelect({ label, value, onChange, placeholder = 'Buscar funcionario...' }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

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
            if (searchTerm.length > 1 && !searchTerm.includes(' - ')) {
                searchItems();
            } else if (searchTerm.length <= 1) {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchItems = async () => {
        setLoading(true);
        try {
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
        onChange(item);
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
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold placeholder:text-slate-300"
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
                    <div className="absolute right-4 top-4">
                        <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="absolute z-[100] w-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                        {results.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl transition-colors group/item"
                                onClick={() => handleSelect(item)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                                        <UserCircleIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm truncate">{item.nombre}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                                            CC: {item.cedula || '---'}
                                        </p>
                                        {item.cargo && (
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter mt-1">
                                                {item.cargo.nombre}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
