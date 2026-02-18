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
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <LockClosedIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Usa una contraseña segura de al menos 8 caracteres, incluyendo números y símbolos.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type={showPassword.current ? "text" : "password"}
                        name="current_password"
                        value={passData.current_password}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-lg border-gray-300 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                    />
                    <button
                        type="button"
                        onClick={() => toggleVisibility('current')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type={showPassword.new ? "text" : "password"}
                            name="new_password"
                            value={passData.new_password}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border-gray-300 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility('new')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="new_password_confirmation"
                            value={passData.new_password_confirmation}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border-gray-300 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility('confirm')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
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


            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
            </div>
        </form>
    );
};

export default ProfileSecurity;
