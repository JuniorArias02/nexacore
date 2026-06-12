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
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Nombre Completo</label>
                    <div className="relative rounded-[1.25rem] shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <UserIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="nombre_completo"
                            value={formData.nombre_completo}
                            onChange={handleChange}
                            className="block w-full rounded-[1.25rem] bg-slate-50 border-slate-100 pl-11 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm py-3 transition-all"
                            placeholder="Tu nombre completo"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Correo Electrónico</label>
                    <div className="relative rounded-[1.25rem] shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <EnvelopeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full rounded-[1.25rem] bg-slate-50 border-slate-100 pl-11 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm py-3 transition-all"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Teléfono</label>
                    <div className="relative rounded-[1.25rem] shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <PhoneIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="block w-full rounded-[1.25rem] bg-slate-50 border-slate-100 pl-11 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm py-3 transition-all"
                            placeholder="+57 300 123 4567"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-indigo-600 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_8px_16px_rgba(79,70,229,0.25)] hover:bg-indigo-700 hover:shadow-[0_12px_20px_rgba(79,70,229,0.3)] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            GUARDANDO...
                        </>
                    ) : 'GUARDAR CAMBIOS'}
                </button>
            </div>
        </form>
    );
};

export default ProfileInfoForm;
