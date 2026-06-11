import { useState } from 'react';
import { createPortal } from 'react-dom';
import SignaturePad from './SignaturePad';
import Swal from 'sweetalert2';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SignatureModal({ isOpen, onClose, onSave, title = "Firmar Documento" }) {
    const [currentSignature, setCurrentSignature] = useState(null);

    const handleSignatureChange = (dataUrl) => {
        setCurrentSignature(dataUrl);
    };

    const handleConfirm = () => {
        if (!currentSignature) {
            Swal.fire({
                title: 'Atención',
                text: 'Debe realizar una firma antes de aceptar',
                icon: 'warning',
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }
        onSave(currentSignature);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal panel */}
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-50 bg-white">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase tracking-[0.1em]">
                            {title}
                        </h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                            Validación de Identidad
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
                    </button>
                </div>

                {/* Body - Using Embedded SignaturePad */}
                <div className="p-6 sm:p-8 bg-white min-h-[350px]">
                    <SignaturePad
                        embedded={true}
                        onSave={handleSignatureChange}
                    />
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
                    <button
                        type="button"
                        className="flex-1 py-4 bg-white text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        onClick={handleConfirm}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Confirmar Firma
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
