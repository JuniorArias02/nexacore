import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import {
    EnvelopeIcon,
    ShieldCheckIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';

const ForgotPasswordPage = () => {
    const [view, setView] = useState('forgot_email'); // forgot_email, forgot_code, forgot_new_pass
    const [formData, setFormData] = useState({
        usuario: '',
        codigo: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.sendResetCode(formData.usuario);
            setSuccess('Código enviado. Revisa tu correo (o logs).');
            setView('forgot_code');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al enviar código');
        }
        setLoading(false);
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.verifyResetCode(formData.usuario, formData.codigo);
            setSuccess('Código verificado correctamente.');
            setView('forgot_new_pass');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Código inválido');
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.resetPassword(formData.usuario, formData.codigo, formData.password, formData.password_confirmation);
            setSuccess('Contraseña actualizada. Inicia sesión.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al actualizar contraseña');
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
                            Recuperar <span className="text-indigo-400">Acceso</span>
                        </h1>
                        <p className="text-xl text-gray-300 font-light max-w-md">
                            Sigue los pasos para restablecer tu contraseña de forma segura.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Header Mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">NexaCore</h2>
                        <p className="text-gray-500">Recuperación</p>
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
                    {success && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: FORGOT EMAIL */}
                    {view === 'forgot_email' && (
                        <div className="animate-fade-in-up">
                            <div className="mb-8">
                                <Link to="/login" className="mb-4 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
                                    <ArrowLeftIcon className="h-4 w-4" /> Volver al login
                                </Link>
                                <h2 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h2>
                                <p className="text-sm text-gray-500 mt-2">Ingresa tu usuario o correo para recibir un código.</p>
                            </div>
                            <form className="space-y-6" onSubmit={handleSendCode}>
                                <div>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="usuario"
                                            required
                                            className="block w-full pl-10 pr-3 py-4 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                                            placeholder="Usuario o Correo"
                                            value={formData.usuario}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-[1.02]"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Código'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: FORGOT CODE */}
                    {view === 'forgot_code' && (
                        <div className="animate-fade-in-up">
                            <div className="mb-8">
                                <button onClick={() => setView('forgot_email')} className="mb-4 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
                                    <ArrowLeftIcon className="h-4 w-4" /> Volver
                                </button>
                                <h2 className="text-3xl font-bold text-gray-900">Verificar Código</h2>
                                <p className="text-sm text-gray-500 mt-2">Ingresa el código de 6 dígitos enviado.</p>
                            </div>
                            <form className="space-y-6" onSubmit={handleVerifyCode}>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        name="codigo"
                                        required
                                        maxLength={6}
                                        className="block w-full text-center text-4xl tracking-widest py-4 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                        placeholder="000000"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-[1.02]"
                                >
                                    {loading ? 'Verificando...' : 'Verificar Código'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: FORGOT NEW PASS */}
                    {view === 'forgot_new_pass' && (
                        <div className="animate-fade-in-up">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">Nueva Contraseña</h2>
                                <p className="text-sm text-gray-500 mt-2">Crea una contraseña segura.</p>
                            </div>
                            <form className="space-y-6" onSubmit={handleResetPassword}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            className="block w-full pl-10 pr-10 py-4 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                                            placeholder="••••••••"
                                            value={formData.password}
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            required
                                            className="block w-full pl-10 pr-10 py-4 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                                            placeholder="••••••••"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-[1.02]"
                                >
                                    {loading ? 'Guardando...' : 'Cambiar Contraseña'}
                                </button>
                            </form>
                        </div>
                    )}

                    <p className="text-center text-xs text-gray-400 pt-8">
                        &copy; 2026 NexaCore Systems. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
