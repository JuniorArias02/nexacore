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
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl group mb-2">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative group/avatar cursor-pointer" onClick={handlePhotoClick}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,image/gif"
                    />

                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden transition-transform duration-500 group-hover/avatar:scale-105">
                        {user?.foto_usuario ? (
                            <img
                                src={user.foto_usuario}
                                alt={userName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                                <span className="text-4xl font-black">
                                    {userInitial}
                                </span>
                            </div>
                        )}

                        {/* Overlay when uploading or hovering */}
                        <div className={`absolute inset-1 rounded-full backdrop-blur-sm bg-black/40 flex items-center justify-center transition-opacity duration-300 ${uploading ? 'opacity-100' : 'opacity-0 group-hover/avatar:opacity-100'}`}>
                            {uploading ? (
                                <div className="w-8 h-8 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <CameraIcon className="w-10 h-10 text-white/90 scale-75 group-hover/avatar:scale-100 transition-transform duration-300" />
                            )}
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className={`absolute bottom-2 right-2 w-7 h-7 border-[3px] border-white rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse ${user?.estado === 1 ? 'bg-emerald-400' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}></div>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 mb-2">
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 backdrop-blur-md shadow-sm">
                            {roleName}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm mb-1">{userName}</h1>
                    <p className="text-indigo-100 text-lg font-medium opacity-90">{userEmail}</p>
                    <div className="flex items-center justify-center md:justify-start gap-5 pt-3 text-sm text-indigo-50/80 font-medium">
                        {/* Estado de la cuenta (activo / inactivo) */}
                        <span className="flex items-center gap-1.5">
                            {user?.estado === 1 ? (
                                <>
                                    <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Cuenta Activa
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    Cuenta Inactiva
                                </>
                            )}
                        </span>
                        
                        {/* Actividad / Online Status */}
                        <span className="flex items-center gap-1.5">
                            {user?.activity_status === 'active' ? (
                                <>
                                    <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    En Línea
                                </>
                            ) : user?.activity_status === 'away' ? (
                                <>
                                    <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Ausente
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    Desconectado
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
