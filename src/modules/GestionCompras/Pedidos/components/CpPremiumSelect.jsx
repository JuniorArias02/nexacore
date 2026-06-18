import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function CpPremiumSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Seleccione...",
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const selectedOption = options.find(o => String(o.id) === String(value));

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div className={`relative group ${disabled ? 'opacity-60 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}`} ref={wrapperRef}>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                {label} *
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 text-slate-700 font-medium text-left shadow-sm hover:bg-slate-100/50"
                >
                    <span className={`block truncate ${selectedOption ? 'text-slate-700' : 'text-slate-400'}`}>
                        {selectedOption ? selectedOption.nombre : placeholder}
                    </span>
                    <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-100 py-2 text-base shadow-[0_20px_60px_-10px_rgba(79,70,229,0.15)] focus:outline-none sm:text-sm flex flex-col gap-1">
                        {options.length === 0 ? (
                            <div className="py-4 px-4 text-center text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                                No hay opciones disponibles
                            </div>
                        ) : (
                            options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`relative select-none py-3 px-4 mx-2 rounded-xl transition-all duration-200 group/item flex items-center justify-between ${
                                        option.disabled
                                            ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400'
                                            : String(value) === String(option.id)
                                                ? 'bg-indigo-50/80 text-indigo-900 font-bold cursor-pointer'
                                                : 'text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-700 cursor-pointer'
                                        }`}
                                    onClick={() => {
                                        if (!option.disabled) {
                                            onChange(option.id);
                                            setIsOpen(false);
                                        }
                                    }}
                                >
                                    <span className={`block truncate ${String(value) === String(option.id) ? 'font-extrabold' : 'font-medium group-hover/item:scale-[1.02] origin-left transition-transform duration-300'}`}>
                                        {option.nombre}
                                        {option.disabled && <span className="ml-2 text-[10px] text-red-400 font-bold uppercase tracking-wider">(No permitido)</span>}
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
