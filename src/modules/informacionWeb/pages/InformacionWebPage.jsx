import { Link } from 'react-router-dom';
import {
    InformationCircleIcon,
    ArrowLeftIcon,
    SparklesIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const InformacionWebPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-blue-100/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-purple-100/50 rounded-full blur-[120px]"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white font-bold text-xl">N</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                NexaCore <span className="text-blue-600 font-extrabold">2.0</span>
                            </span>
                        </div>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            Regresar al Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6 border border-blue-100 animate-fade-in">
                        <SparklesIcon className="h-4 w-4" />
                        NUEVO ECOSISTEMA NEXA 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight">
                        La evolución formal de <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                            nuestra gestión digital.
                        </span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed font-light">
                        El antiguo sistema IPS ha cumplido su ciclo. NexaCore nace como una plataforma
                        integral, rápida y robusta diseñada para centralizar los procesos del
                        Departamento de Sistemas y Compras.
                    </p>
                </div>

                {/* Comparison Card */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white/40 backdrop-blur-lg p-8 rounded-[2.5rem] border border-gray-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 text-gray-200 opacity-20 group-hover:opacity-40 transition-opacity">
                            <ExclamationTriangleIcon className="h-24 w-24" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-500 mb-2 uppercase tracking-widest text-sm">Legado</h3>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Antiguo Sistema IPS</h2>
                        <ul className="space-y-4 text-gray-500 mb-8">
                            <li className="flex items-center gap-2">✕ Tecnología obsoleta</li>
                            <li className="flex items-center gap-2">✕ Fallas recurrentes</li>
                            <li className="flex items-center gap-2">✕ Inconsistencia de datos</li>
                            <li className="flex items-center gap-2">✕ Interfaz limitada</li>
                        </ul>
                        <a
                            href="https://departamento-sistemasips.vercel.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 text-sm hover:underline"
                        >
                            Ver sistema anterior (Obsoleto)
                        </a>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden group transform hover:scale-[1.02] transition-all duration-500">
                        <div className="absolute -bottom-10 -right-10 p-8 text-white/10 group-hover:scale-110 transition-transform duration-700">
                            <RocketLaunchIcon className="h-64 w-64" />
                        </div>
                        <h3 className="text-xl font-bold text-blue-200 mb-2 uppercase tracking-widest text-sm">Actual</h3>
                        <h2 className="text-4xl font-black text-white mb-6">NexaCore <span className="font-light italic">v2</span></h2>
                        <ul className="space-y-4 text-blue-50 text-lg">
                            <li className="flex items-center gap-3 font-medium">
                                <div className="h-2 w-2 bg-blue-300 rounded-full animate-pulse"></div>
                                Arquitectura Moderna y Ultra-rápida
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <div className="h-2 w-2 bg-blue-300 rounded-full animate-pulse"></div>
                                Gestión de Compras Inteligente
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <div className="h-2 w-2 bg-blue-300 rounded-full animate-pulse"></div>
                                Control de Inventario & Hojas de Vida
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <div className="h-2 w-2 bg-blue-300 rounded-full animate-pulse"></div>
                                Soporte Multisede & Permisos CRUD
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid sm:grid-cols-3 gap-6 mb-20">
                    <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <ShieldCheckIcon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Seguridad</h3>
                        <p className="text-gray-500 leading-relaxed font-light">
                            Tus datos están protegidos por encriptación avanzada y un riguroso sistema de autenticación JWT.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                        <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                            <ChatBubbleLeftRightIcon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reportar Fallas</h3>
                        <p className="text-gray-500 leading-relaxed font-light">
                            NexaCore es reciente. Si encuentras algún inconveniente, por favor repórtalo inmediatamente al Departamento de Sistemas.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                        <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                            <InformationCircleIcon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h3>
                        <p className="text-gray-500 leading-relaxed font-light">
                            Usa tu panel de control para gestionar pedidos, inventario o personal según tu rol asignado.
                        </p>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="text-center py-12 border-t border-gray-200">
                    <p className="text-gray-400 text-sm">
                        &copy; 2026 Ecosistema NEXA. Construido para el mañana.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default InformacionWebPage;
