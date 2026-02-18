import { useState, useRef } from 'react';
import SignaturePad from './SignaturePad';
import Swal from 'sweetalert2';

export default function SignatureModal({ isOpen, onClose, onSave, title = "Firmar Documento" }) {
    const [currentSignature, setCurrentSignature] = useState(null);

    // We need a way to trigger the 'trim'/save from the parent modal button, 
    // or we modify SignaturePad to auto-save to state on end.
    // Let's modify SignaturePad wrapper to handle this, or just pass a callback.
    // Actually, SignaturePad has 'onSave' prop which is called when trimming.
    // But we want to trim only when clicking "Aceptar". 

    // Simplest approach: Use a ref to call a method on SignaturePad, 
    // BUT SignaturePad is a specific implementation.

    // Let's trust the SignaturePad 'onSave' prop which provides the dataURL.
    // We can have the SignaturePad update a local state in this modal, 
    // and "Aceptar" confirms that state.

    const handleSignatureChange = (dataUrl) => {
        setCurrentSignature(dataUrl);
    };

    const handleConfirm = () => {
        if (!currentSignature) {
            Swal.fire('Atención', 'Debe realizar una firma antes de aceptar', 'warning');
            return;
        }
        onSave(currentSignature);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                {/* Background overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div>
                        <div className="mt-3 text-center sm:mt-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {title}
                            </h3>
                            <div className="mt-4">
                                {/* Pass a dummy onSave to capture changes if needed, 
                                    but SignaturePad currently saves on 'trim' which is 'onEnd'. 
                                    So every stroke end triggers onSave. Perfect. */}
                                <SignaturePad
                                    onSave={handleSignatureChange}
                                    onClear={() => setCurrentSignature(null)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                            onClick={handleConfirm}
                        >
                            Aceptar
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
