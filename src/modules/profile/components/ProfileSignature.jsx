import React, { useState } from 'react';
import { CameraIcon, ArrowUpTrayIcon, TrashIcon, PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import SignaturePad from './SignaturePad';
import { resizeImageBlob } from '../utils/imageUtils';

// Helper to construct image URL
const getStorageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
};

const ProfileSignature = ({ user, onSubmit, loading }) => {
    const [activeTab, setActiveTab] = useState('draw'); // 'draw' | 'upload'
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [drawingBlob, setDrawingBlob] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Optional: Resize image to max 800x400 to ensure good signature size
                // This is a basic "adjustment" as requested
                const resizedBlob = await resizeImageBlob(file, 800, 400);
                setSignatureFile(resizedBlob);
                setSignaturePreview(URL.createObjectURL(resizedBlob));
            } catch (error) {
                console.error("Error resizing image:", error);
                // Fallback to original
                setSignatureFile(file);
                setSignaturePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleRemovePreview = () => {
        setSignatureFile(null);
        setSignaturePreview(null);
    };

    const handleDrawingSave = (blob) => {
        setDrawingBlob(blob);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let fileToUpload = null;
        if (activeTab === 'upload') {
            fileToUpload = signatureFile;
        } else if (activeTab === 'draw') {
            fileToUpload = drawingBlob;
        }

        if (fileToUpload) {
            onSubmit(fileToUpload, () => {
                // Reset on success
                setSignatureFile(null);
                setSignaturePreview(null);
                setDrawingBlob(null);
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Current Signature Display */}
            <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100">
                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 ring-4 ring-white text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                    </span>
                    Firma Digital Actual
                </h4>

                {user?.firma_digital ? (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                        <img
                            src={getStorageUrl(user.firma_digital)}
                            alt="Firma actual"
                            className="max-h-24 object-contain opacity-90"
                        />
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500 italic bg-white rounded-lg border border-gray-200 border-dashed">
                        No hay firma digital registrada.
                    </div>
                )}
            </div>

            {/* update Form */}
            <form onSubmit={handleSubmit} className="pt-4 border-t border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Actualizar Firma</label>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('draw')}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'draw'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Dibujar
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('upload')}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'upload'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <PhotoIcon className="w-4 h-4 mr-2" />
                            Subir Imagen
                        </button>
                    </div>

                    {/* Content */}
                    <div className="min-h-[250px]">
                        {activeTab === 'draw' ? (
                            <SignaturePad onSave={handleDrawingSave} />
                        ) : (
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:bg-gray-50 transition-colors relative group">
                                {signaturePreview ? (
                                    <div className="relative w-full flex justify-center">
                                        <img src={signaturePreview} alt="Preview" className="max-h-32 object-contain" />
                                        <button
                                            type="button"
                                            onClick={handleRemovePreview}
                                            className="absolute top-0 right-0 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <CameraIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>Sube un archivo</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="image/png, image/jpeg, image/gif"
                                                />
                                            </label>
                                            <p className="pl-1">o arrastra y suelta</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hasta 2MB</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading || (activeTab === 'draw' ? !drawingBlob : !signatureFile)}
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            'Guardando...'
                        ) : (
                            <>
                                <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                                Guardar Firma
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSignature;
