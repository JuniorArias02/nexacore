import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { profileService } from '../services/profileService';

const ProfileHeader = ({ user, onUpdateUser }) => {
    const roleName = user?.rol?.nombre || 'Usuario';
    const userName = user?.nombre_completo || 'Usuario';
    const userEmail = user?.usuario || user?.email || '';
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Determine gradient based on role (optional, using default for now to match dashboard hero)
    // could be extended if needed
    const gradientClass = "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500";

    // Fallback initial (just visual, real generic avatar handled by init)
    const userInitial = userName.charAt(0).toUpperCase();

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await profileService.uploadPhoto(file);
            // Verify structure of response, assume response.objeto.foto_url or response.foto_url
            // Controller returns: ApiResponse::success(['foto_url' => ...]) which puts data in 'objeto' usually?
            // Wait, ApiResponse::success($data, $message) -> 'objeto' => $data.
            // So response.objeto.foto_url should be correct if using standard ApiResponse.
            // Let's verify standard ApiResponse structure usage in previous steps.

            // Controller: ApiResponse::success(['foto_url' => asset(...)])
            // Standard Front: response.data (axios) -> { status, mensaje, objeto }
            // So we need response.objeto.foto_url. 
            // BUT profileService.js returns response.data directly.

            if (onUpdateUser && response.objeto?.foto_url) {
                // Update context with new photo URL
                onUpdateUser({ ...user, foto_usuario: response.objeto.foto_url });
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            // Optionally trigger a toast here if we had access to showMessage
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`relative overflow-hidden rounded-3xl ${gradientClass} p-8 text-white shadow-xl`}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,image/gif"
                    />

                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg relative overflow-hidden">
                        {user?.foto_usuario ? (
                            <img
                                src={user.foto_usuario}
                                alt={userName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <span className="text-3xl font-bold">
                                    {userInitial}
                                </span>
                            </div>
                        )}

                        {/* Overlay when uploading or hovering */}
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {uploading ? (
                                <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <CameraIcon className="w-8 h-8 text-white/90" />
                            )}
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">{userName}</h2>
                        <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md border border-white/10 uppercase tracking-wider">
                            {roleName}
                        </span>
                    </div>
                    <p className="text-indigo-100 font-medium">{userEmail}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2 text-sm text-white/80">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Unido recientemente
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Cuenta Activa
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
