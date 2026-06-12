import React, { useState, useRef } from 'react';
import { CameraIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { profileService } from '../services/profileService';

const ProfilePhoto = ({ user, onUpdateUser, showMessage }) => {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const response = await profileService.uploadPhoto(file);
            if (response.objeto?.foto_url) {
                onUpdateUser({ ...user, foto_usuario: response.objeto.foto_url });
                if (showMessage) showMessage('success', 'Foto de perfil actualizada correctamente.');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            if (showMessage) showMessage('error', 'Error al subir la foto.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) return;

        setLoading(true);
        try {
            await profileService.deletePhoto();
            onUpdateUser({ ...user, foto_usuario: null });
            if (showMessage) showMessage('success', 'Foto de perfil eliminada correctamente.');
        } catch (error) {
            console.error('Error deleting photo:', error);
            if (showMessage) showMessage('error', 'Error al eliminar la foto.');
        } finally {
            setLoading(false);
        }
    };

    const userInitial = user?.nombre_completo?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="space-y-6 animate-fade-in-up font-sans">
            <div className="bg-slate-50/30 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-5">
                    <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <CameraIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Foto de Perfil</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Identidad visual de usuario</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Avatar Preview */}
                    <div className="relative group/avatar">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-slate-100 to-slate-200 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden relative transition-transform duration-500 group-hover/avatar:scale-105 border-4 border-white">
                            {user?.foto_usuario ? (
                                <img
                                    src={user.foto_usuario}
                                    alt="Foto de perfil"
                                    className="w-full h-full rounded-[2.25rem] object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-[2.25rem] bg-slate-100 flex items-center justify-center text-slate-300">
                                    <span className="text-6xl font-black">{userInitial}</span>
                                </div>
                            )}

                            {loading && (
                                <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-5 w-full md:w-auto flex-1">
                        <div className="space-y-1.5">
                            <h4 className="font-bold text-slate-800 tracking-tight">Tu fotografía oficial</h4>
                            <p className="text-xs font-medium text-slate-500 max-w-md">
                                Esta imagen se mostrará en tu perfil, en los registros de auditoría y en la barra de navegación del ecosistema NexaCore.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                            />

                            <button
                                onClick={handlePhotoClick}
                                disabled={loading}
                                className="inline-flex items-center px-6 py-3 border border-indigo-100 text-[10px] font-black uppercase tracking-widest rounded-2xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                <CameraIcon className="-ml-1 mr-2 h-4 w-4 stroke-[2.5] group-hover:scale-110 transition-transform" />
                                {user?.foto_usuario ? 'Cambiar Foto' : 'Subir Foto'}
                            </button>

                            {user?.foto_usuario && (
                                <button
                                    onClick={handleDeletePhoto}
                                    disabled={loading}
                                    className="inline-flex items-center px-6 py-3 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded-2xl text-rose-700 bg-rose-50 hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    <TrashIcon className="-ml-1 mr-2 h-4 w-4 stroke-[2.5] group-hover:scale-110 transition-transform" />
                                    Eliminar
                                </button>
                            )}
                        </div>

                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 border-t border-slate-100 pt-4">
                            Formatos: JPG, PNG, GIF. Máx: 2MB.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePhoto;
