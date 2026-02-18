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
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-4 border-gray-100">
                    Foto de Perfil
                </h3>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar Preview */}
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full bg-gray-100 p-1 shadow-md overflow-hidden relative">
                            {user?.foto_usuario ? (
                                <img
                                    src={user.foto_usuario}
                                    alt="Foto de perfil"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    <UserCircleIcon className="w-24 h-24" />
                                </div>
                            )}

                            {loading && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 w-full md:w-auto">
                        <div className="space-y-1">
                            <h4 className="font-medium text-gray-900">Tu foto</h4>
                            <p className="text-sm text-gray-500">
                                Esta foto se mostrará en tu perfil y en la barra de navegación.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
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
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <CameraIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                                {user?.foto_usuario ? 'Cambiar Foto' : 'Subir Foto'}
                            </button>

                            {user?.foto_usuario && (
                                <button
                                    onClick={handleDeletePhoto}
                                    disabled={loading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                                    Eliminar
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                            Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 2MB.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePhoto;
