import React, { useState, useEffect } from 'react';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const ProfileInfoForm = ({ user, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        telefono: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nombre_completo: user.nombre_completo || '',
                email: user.correo || '',
                telefono: user.telefono || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="nombre_completo"
                            value={formData.nombre_completo}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                            placeholder="Tu nombre completo"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                            placeholder="+57 300 123 4567"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </>
                    ) : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
};

export default ProfileInfoForm;
