import { useState, useEffect } from 'react';
import { 
    XMarkIcon, 
    UserIcon, 
    MagnifyingGlassIcon,
    ArrowRightCircleIcon,
    ArrowsRightLeftIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { personalService } from '../../personal/services/personalService';
import Swal from 'sweetalert2';

export default function TransferenciaActaModal({ isOpen, onClose, onConfirm, acta, mode = 'individual' }) {
    const [searchTermCoord, setSearchTermCoord] = useState('');
    const [resultsCoord, setResultsCoord] = useState([]);
    const [selectedCoord, setSelectedCoord] = useState(null);
    const [isSearchingCoord, setIsSearchingCoord] = useState(false);

    const [searchTermPers, setSearchTermPers] = useState('');
    const [resultsPers, setResultsPers] = useState([]);
    const [selectedPers, setSelectedPers] = useState(null);
    const [isSearchingPers, setIsSearchingPers] = useState(false);

    // Search Coordinator
    useEffect(() => {
        if (searchTermCoord.length > 2 && !selectedCoord) {
            const delayDebounceFn = setTimeout(() => {
                searchPersonal(searchTermCoord, setResultsCoord, setIsSearchingCoord);
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else if (searchTermCoord.length <= 2) {
            setResultsCoord([]);
        }
    }, [searchTermCoord, selectedCoord]);

    // Search Personal (only for individual mode)
    useEffect(() => {
        if (mode === 'individual' && searchTermPers.length > 2 && !selectedPers) {
            const delayDebounceFn = setTimeout(() => {
                searchPersonal(searchTermPers, setResultsPers, setIsSearchingPers);
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else if (searchTermPers.length <= 2) {
            setResultsPers([]);
        }
    }, [searchTermPers, selectedPers, mode]);

    const searchPersonal = async (query, setResults, setSearching) => {
        setSearching(true);
        try {
            const data = await personalService.search(query, false, { estado: 1 });
            setResults(data || []);
        } catch (error) {

            console.error('Error searching personal:', error);
        } finally {
            setSearching(false);
        }
    };

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!selectedCoord) {
            Swal.fire('Atención', 'Por favor selecciona un nuevo coordinador', 'warning');
            return;
        }

        if (mode === 'individual') {
            onConfirm(selectedCoord.id, selectedPers?.id || null);
        } else {
            onConfirm(selectedCoord.id);
        }
    };

    const isBulk = mode === 'bulk';

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                    onClick={onClose}
                ></div>

                {/* Modal Container */}
                <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl animate-fade-in-up">
                    <div className="absolute right-6 top-6">
                        <button 
                            onClick={onClose}
                            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mb-8">
                        <div className={`inline-flex items-center justify-center rounded-2xl p-4 mb-4 ${isBulk ? 'bg-orange-50' : 'bg-indigo-50'}`}>
                            {isBulk ? (
                                <UserGroupIcon className="h-8 w-8 text-orange-600" />
                            ) : (
                                <ArrowsRightLeftIcon className="h-8 w-8 text-indigo-600" />
                            )}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                            {isBulk ? 'Transferencia Masiva de Actas' : 'Transferir Acta Individual'}
                        </h3>
                        <p className="text-slate-500 mt-2 font-medium leading-relaxed">
                            {isBulk 
                                ? `Se transferirán TODAS las actas del coordinador actual al nuevo seleccionado.`
                                : `Se creará una nueva versión de esta acta. Puedes cambiar el coordinador, el responsable o ambos.`}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Current Coordinator Info */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                                    <UserIcon className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coordinador Origen</p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {isBulk ? acta?.nombre : acta?.coordinador?.nombre || 'Desconocido'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-3 py-1 bg-white rounded-lg border border-slate-100">
                                ID #{isBulk ? acta?.id : acta?.coordinador?.id}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* New Coordinator Selection */}
                            <div className={isBulk ? 'md:col-span-2' : ''}>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Nuevo Coordinador
                                </label>
                                <div className="relative group">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <MagnifyingGlassIcon className={`h-5 w-5 ${isSearchingCoord ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all shadow-sm"
                                        placeholder="Buscar coordinador..."
                                        value={searchTermCoord}
                                        onChange={(e) => {
                                            setSearchTermCoord(e.target.value);
                                            setSelectedCoord(null);
                                        }}
                                    />
                                    {/* Coordinator Results */}
                                    {resultsCoord.length > 0 && !selectedCoord && (
                                        <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black ring-opacity-5">
                                            {resultsCoord.map((person) => (
                                                <div
                                                    key={person.id}
                                                    onClick={() => {
                                                        setSelectedCoord(person);
                                                        setSearchTermCoord(person.nombre);
                                                    }}
                                                    className="cursor-pointer px-4 py-3 hover:bg-slate-50 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                                                            <UserIcon className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-900">{person.nombre}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {selectedCoord && (
                                    <div className="mt-3 flex items-center p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-fade-in">
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
                                            <UserIcon className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="text-xs font-black text-indigo-900 flex-1 truncate">{selectedCoord.nombre}</p>
                                        <button onClick={() => { setSelectedCoord(null); setSearchTermCoord(''); }} className="text-indigo-400 hover:text-indigo-600"><XMarkIcon className="h-4 w-4" /></button>
                                    </div>
                                )}
                            </div>

                            {/* New Personal Selection (Individual Mode Only) */}
                            {!isBulk && (
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                        Nuevo Responsable <span className="text-[8px] font-bold text-slate-300 ml-1">(Opcional)</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <MagnifyingGlassIcon className={`h-5 w-5 ${isSearchingPers ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm transition-all shadow-sm"
                                            placeholder="Responsable actual por defecto..."
                                            value={searchTermPers}
                                            onChange={(e) => {
                                                setSearchTermPers(e.target.value);
                                                setSelectedPers(null);
                                            }}
                                        />
                                        {/* Personal Results */}
                                        {resultsPers.length > 0 && !selectedPers && (
                                            <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black ring-opacity-5">
                                                {resultsPers.map((person) => (
                                                    <div
                                                        key={person.id}
                                                        onClick={() => {
                                                            setSelectedPers(person);
                                                            setSearchTermPers(person.nombre);
                                                        }}
                                                        className="cursor-pointer px-4 py-3 hover:bg-slate-50 flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                                                                <UserIcon className="h-4 w-4 text-emerald-600" />
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-900">{person.nombre}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {selectedPers && (
                                        <div className="mt-3 flex items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 animate-fade-in">
                                            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center mr-3">
                                                <UserIcon className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-black text-emerald-900 flex-1 truncate">{selectedPers.nombre}</p>
                                            <button onClick={() => { setSelectedPers(null); setSearchTermPers(''); }} className="text-emerald-400 hover:text-emerald-600"><XMarkIcon className="h-4 w-4" /></button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className={`flex-1 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-xl transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                                isBulk 
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 shadow-orange-200 hover:shadow-orange-300 border-orange-800' 
                                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-200 hover:shadow-indigo-300 border-indigo-800'
                            }`}
                        >
                            {isBulk ? 'Realizar Transferencia Masiva' : 'Confirmar Transferencia'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
