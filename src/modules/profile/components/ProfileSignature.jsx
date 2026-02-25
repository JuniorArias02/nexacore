import React, { useState } from 'react';
import { CameraIcon, ArrowUpTrayIcon, TrashIcon, PencilIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SignaturePad from './SignaturePad';
import { resizeImageBlob } from '../utils/imageUtils';
import SignatureCropModal from '../../../components/common/SignatureCropModal';

// Helper to construct image URL
const getStorageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
};

const ProfileSignature = ({ user, onSubmit, loading }) => {
    const [activeTab, setActiveTab] = useState('draw'); 
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [drawingBlob, setDrawingBlob] = useState(null);

    // New cropping states
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [cropImage, setCropImage] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropImage(reader.result);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedBlob) => {
        setSignatureFile(croppedBlob);
        setSignaturePreview(URL.createObjectURL(croppedBlob));
        setIsCropModalOpen(false);
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
        <div className="space-y-8 animate-fade-in font-sans">
            {/* Context Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocolo de Identidad v2.0</span>
            </div>

            {/* Current Signature Display */}
            <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <PencilIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Firma Digital Autorizada</h4>
                    </div>

                    {user?.firma_digital ? (
                        <div className="relative flex flex-col items-center">
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 w-full max-w-md flex items-center justify-center group-hover:bg-white transition-all duration-500">
                                <img
                                    src={getStorageUrl(user.firma_digital)}
                                    alt="Firma actual"
                                    className="h-32 object-contain"
                                />
                            </div>
                            <div className="absolute -bottom-4 bg-white px-4 py-2 rounded-full shadow-lg border border-slate-50 text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                                Estatus: Encriptada y Activa
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                            <PhotoIcon className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sin registro biométrico de firma</p>
                        </div>
                    )}
                </div>
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-50 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Actualizar Credencial</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sincronización de firma digital</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1.5 bg-slate-50 rounded-2xl w-fit">
                            <button
                                type="button"
                                onClick={() => setActiveTab('draw')}
                                className={`flex items-center px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'draw'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <PencilIcon className="w-4 h-4 mr-2 stroke-[3]" />
                                Dibujar
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('upload')}
                                className={`flex items-center px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upload'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <PhotoIcon className="w-4 h-4 mr-2 stroke-[3]" />
                                Subir PNG
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px] flex items-center justify-center">
                        {activeTab === 'draw' ? (
                            <div className="w-full">
                                <SignaturePad onSave={handleDrawingSave} />
                            </div>
                        ) : (
                            <div className="w-full">
                                {signaturePreview ? (
                                    <div className="relative flex flex-col items-center animate-zoom-in">
                                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full flex items-center justify-center mb-8 relative group">
                                            <img src={signaturePreview} alt="Preview" className="h-40 object-contain" />
                                            <button
                                                type="button"
                                                onClick={handleRemovePreview}
                                                className="absolute -top-3 -right-3 p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg hover:rotate-90"
                                            >
                                                <XMarkIcon className="h-5 w-5 stroke-[3]" />
                                            </button>
                                        </div>
                                        <label
                                            htmlFor="file-upload"
                                            className="inline-flex items-center px-6 py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm border border-slate-100 hover:bg-slate-100 cursor-pointer transition-all gap-2"
                                        >
                                            <ArrowUpTrayIcon className="h-4 w-4" />
                                            Cambiar Archivo
                                        </label>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="file-upload"
                                        className="w-full h-80 flex flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all cursor-pointer group"
                                    >
                                        <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-sm">
                                            <ArrowUpTrayIcon className="h-10 w-10 text-slate-300 group-hover:text-indigo-600" />
                                        </div>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Cargar Imágen de Firma</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formatos: PNG, JPG (Máx 2MB)</p>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading || (activeTab === 'draw' ? !drawingBlob : !signatureFile)}
                        className="flex-grow relative overflow-hidden group py-5 bg-indigo-600 text-white rounded-[2rem] font-black tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:shadow-indigo-300 transition-all transform active:scale-95 disabled:bg-slate-200 disabled:shadow-none"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3 uppercase text-[10px]">
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Sincronizando...
                                </>
                            ) : (
                                <>
                                    <ArrowUpTrayIcon className="h-5 w-5 stroke-[2.5]" />
                                    Guardar Cambios de Firma
                                </>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                </div>
            </form>

            {/* Crop Modal */}
            <SignatureCropModal
                isOpen={isCropModalOpen}
                image={cropImage}
                onCropComplete={handleCropComplete}
                onCancel={() => setIsCropModalOpen(false)}
            />
        </div>
    );
};

export default ProfileSignature;
