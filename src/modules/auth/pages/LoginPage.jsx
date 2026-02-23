import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    UserIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        usuario: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(formData.usuario, formData.contrasena);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Error al iniciar sesión');
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Visual (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 w-full flex flex-col justify-center px-16">
                    <div className="mb-8">
                        <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg mb-8 border border-white/20">
                            <span className="text-3xl font-bold">N</span>
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
                            NexaCore <span className="text-indigo-400">2026</span>
                        </h1>
                        <p className="text-xl text-gray-300 font-light max-w-md">
                            Gestión integral inteligente para el Departamento de Sistemas y Compras.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-12">
                        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <ShieldCheckIcon className="h-8 w-8 text-indigo-400 mb-2" />
                            <h3 className="font-semibold">Seguridad Avanzada</h3>
                            <p className="text-sm text-gray-400">Protección de datos empresariales.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <CheckCircleIcon className="h-8 w-8 text-purple-400 mb-2" />
                            <h3 className="font-semibold">Gestión Eficiente</h3>
                            <p className="text-sm text-gray-400">Optimización de recursos TI.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
                {/* Info Icon Link */}
                <div className="absolute top-8 right-8">
                    <Link
                        to="/info-sistema"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold border border-blue-100"
                    >
                        <InformationCircleIcon className="h-5 w-5" />
                        <span>Info Sistema</span>
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8">
                    {/* Header Mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">NexaCore</h2>
                        <p className="text-gray-500">Sistema de Gestión</p>
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ShieldCheckIcon className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="animate-fade-in-up">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h2>
                            <p className="text-sm text-gray-500 mt-2">Ingresa tus credenciales para acceder a tu panel de control.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario o Correo</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="usuario"
                                        required
                                        className="block w-full pl-10 pr-3 py-4 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                                        placeholder="Ej. junior_arias"
                                        value={formData.usuario}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="contrasena"
                                        required
                                        className="block w-full pl-10 pr-10 py-4 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                                        placeholder="••••••••"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-400 pt-8">
                        &copy; 2026 NexaCore Systems. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
