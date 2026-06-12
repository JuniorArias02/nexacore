import React, { useState } from 'react';
import { LockClosedIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ProfileSecurity = ({ onSubmit, loading }) => {
    const [passData, setPassData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const toggleVisibility = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(passData, () => {
            // Reset form on success
            setPassData({ current_password: '', new_password: '', new_password_confirmation: '' });
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 mb-6 rounded-r-[1.5rem] rounded-l-sm shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <LockClosedIcon className="h-6 w-6 text-amber-500" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-semibold text-amber-800 tracking-tight">
                            Usa una contraseña segura de al menos 8 caracteres, incluyendo números y símbolos.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Contraseña Actual</label>
                <div className="relative rounded-[1.25rem] shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <KeyIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                        type={showPassword.current ? "text" : "password"}
                        name="current_password"
                        value={passData.current_password}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-[1.25rem] bg-slate-50 border-slate-100 pl-11 pr-12 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm py-3 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => toggleVisibility('current')}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
                    >
                        {showPassword.current ? (
                            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Nueva Contraseña</label>
                    <div className="relative rounded-[1.25rem] shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type={showPassword.new ? "text" : "password"}
                            name="new_password"
                            value={passData.new_password}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-[1.25rem] bg-slate-50 border-slate-100 pl-11 pr-12 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm py-3 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility('new')}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
                        >
                            {showPassword.new ? (
                                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Confirmar Nueva Contraseña</label>
                    <div className="relative rounded-[1.25rem] shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="new_password_confirmation"
                            value={passData.new_password_confirmation}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-[1.25rem] bg-slate-50 border-slate-100 pl-11 pr-12 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm py-3 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility('confirm')}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
                        >
                            {showPassword.confirm ? (
                                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-indigo-600 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_8px_16px_rgba(79,70,229,0.25)] hover:bg-indigo-700 hover:shadow-[0_12px_20px_rgba(79,70,229,0.3)] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                    {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                </button>
            </div>
        </form>
    );
};

export default ProfileSecurity;
