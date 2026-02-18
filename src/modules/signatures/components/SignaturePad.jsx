import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Swal from 'sweetalert2';

export default function SignaturePad({ onSave, buttonText = "Firmar", title = "Firmar Documento" }) {
    const sigPadRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signatureData, setSignatureData] = useState(null);

    const handleClear = () => {
        if (sigPadRef.current) {
            sigPadRef.current.clear();
        }
    };

    const handleSave = () => {
        if (sigPadRef.current && sigPadRef.current.isEmpty()) {
            Swal.fire({
                title: 'Atención',
                text: 'Debe realizar una firma antes de guardar',
                icon: 'warning',
                confirmButtonColor: '#6366f1'
            });
            return;
        }

        const dataURL = sigPadRef.current.toDataURL('image/png');
        setSignatureData(dataURL);
        setIsModalOpen(false);
        if (onSave) onSave(dataURL);
    };

    const handleCancel = () => {
        handleClear();
        setIsModalOpen(false);
    };

    const handleRemoveSignature = () => {
        setSignatureData(null);
        if (onSave) onSave(null);
    };

    return (
        <>
            {/* Trigger Button or Signature Preview */}
            {!signatureData ? (
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    {buttonText}
                </button>
            ) : (
                <div className="inline-flex flex-col gap-2 p-3 bg-white border-2 border-green-200 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Firma capturada
                    </div>
                    <img src={signatureData} alt="Firma" className="h-24 border border-gray-200 rounded bg-white" />
                    <button
                        type="button"
                        onClick={handleRemoveSignature}
                        className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline"
                    >
                        Eliminar firma
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">

                        {/* Background overlay with animation */}
                        <div
                            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={handleCancel}
                        ></div>

                        {/* Modal panel */}
                        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2" id="modal-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        {title}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-6">
                                <p className="text-sm text-gray-600 mb-4">
                                    Por favor, firme en el recuadro a continuación usando su mouse o pantalla táctil.
                                </p>

                                {/* Signature Canvas */}
                                <div className="border-2 border-gray-300 rounded-lg bg-gray-50 p-2">
                                    <div className="bg-white rounded shadow-inner">
                                        <SignatureCanvas
                                            ref={sigPadRef}
                                            penColor="black"
                                            backgroundColor="rgb(255, 255, 255)"
                                            canvasProps={{
                                                width: 600,
                                                height: 300,
                                                className: 'cursor-crosshair rounded',
                                                style: { width: '100%', height: '300px' }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Clear button */}
                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                        Limpiar
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Aceptar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex justify-center items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
