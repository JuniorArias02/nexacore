import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const DefaultDashboard = () => {
    const { user } = useAuth();

    // Get time of day for greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in-up">

            {/* Animated Icon Container */}
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-4 max-w-2xl">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user?.nombre_completo?.split(' ')[0]}</span>
                </h2>
                <p className="text-xl text-gray-500 leading-relaxed">
                    Bienvenido al <span className="font-semibold text-gray-700">Ecosistema NEXA</span>.
                    <br />
                    Tu perfil de <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800 mx-1">{user?.rol?.nombre || 'Usuario'}</span>
                    está configurado y listo para operar.
                </p>
            </div>

            {/* Simple Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900">Estado del Sistema</h4>
                        <p className="text-sm text-green-600 font-medium">Operativo</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0h18M5.25 12h13.5h-13.5zm1 5.25h13.5h-13.5z" /></svg>
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900">Fecha Actual</h4>
                        <p className="text-sm text-gray-500 font-medium">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900">Notificaciones</h4>
                        <p className="text-sm text-gray-500 font-medium">0 Pendientes</p>
                    </div>
                </div>
            </div>

            <p className="text-gray-400 text-sm mt-8">
                Usa el menú lateral para acceder a las funcionalidades disponibles para tu rol.
            </p>
        </div>
    );
};

export default DefaultDashboard;
