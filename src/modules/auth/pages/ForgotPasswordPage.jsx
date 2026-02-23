import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import {
    EnvelopeIcon,
    ShieldCheckIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    SparklesIcon,
    KeyIcon
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
    const [mounted, setMounted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.sendResetCode(formData.usuario);
            setSuccess('Código enviado. Revisa tu correo Institucional.');
            setView('forgot_code');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al enviar código. Verifica el usuario.');
        }
        setLoading(false);
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.verifyResetCode(formData.usuario, formData.codigo);
            setSuccess('Código verificado correctamente.');
            setView('forgot_new_pass');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Código inválido o expirado.');
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.resetPassword(formData.usuario, formData.codigo, formData.password, formData.password_confirmation);
            setSuccess('Contraseña actualizada con éxito.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al actualizar contraseña. Intenta de nuevo.');
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 selection:bg-indigo-100 overflow-hidden font-sans">
            {/* Left Side - Visual Focus */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-slate-950">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -mr-96 -mt-96"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
                </div>

                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
                <div className="absolute inset-0 z-0 bg-grid-slate-800/[0.1] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

                <div className="relative z-10 w-full flex flex-col justify-between p-16 h-full">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                            <span className="text-2xl font-black text-white">N</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">NexaCore <span className="text-indigo-400 font-light italic">Recovery</span></span>
                    </div>

                    <div className={`transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                            <ShieldCheckIcon className="h-4 w-4" />
                            SEGURIDAD GARANTIZADA
                        </div>
                        <h1 className="text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
                            Recupera tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
                                acceso al panel.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 font-light max-w-xl leading-relaxed">
                            Sigue el proceso de verificación de 3 pasos para restablecer tus credenciales de forma segura.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl border transition-all duration-500 ${view === 'forgot_email' ? 'bg-white/10 border-white/20 scale-105' : 'bg-transparent border-white/5 opacity-40'}`}>
                            <div className="text-white font-bold text-sm mb-1">01</div>
                            <div className="text-xs text-slate-400">Identificación</div>
                        </div>
                        <div className="h-px w-8 bg-white/10"></div>
                        <div className={`p-4 rounded-2xl border transition-all duration-500 ${view === 'forgot_code' ? 'bg-white/10 border-white/20 scale-105' : 'bg-transparent border-white/5 opacity-40'}`}>
                            <div className="text-white font-bold text-sm mb-1">02</div>
                            <div className="text-xs text-slate-400">Verificación</div>
                        </div>
                        <div className="h-px w-8 bg-white/10"></div>
                        <div className={`p-4 rounded-2xl border transition-all duration-500 ${view === 'forgot_new_pass' ? 'bg-white/10 border-white/20 scale-105' : 'bg-transparent border-white/5 opacity-40'}`}>
                            <div className="text-white font-bold text-sm mb-1">03</div>
                            <div className="text-xs text-slate-400">Protección</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Step Forms */}
            <div className="w-full lg:w-2/5 flex flex-col relative bg-white lg:bg-slate-50">
                {/* Floating Navigation/Info */}
                <div className="absolute top-8 right-8 z-30">
                    <Link
                        to="/login"
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-slate-200 hover:border-indigo-400 transition-all duration-300 active:scale-95"
                    >
                        <ArrowLeftIcon className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-xs font-black text-slate-600 group-hover:text-indigo-600 uppercase tracking-tight">Volver al Login</span>
                    </Link>
                </div>

                <div className="flex-grow flex items-center justify-center p-8">
                    <div className={`w-full max-w-md transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                        {/* Status Messaging */}
                        {(error || success) && (
                            <div className={`mb-10 p-4 rounded-2xl border animate-shake ${error ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
                                <div className="flex gap-3">
                                    {error ? (
                                        <ShieldCheckIcon className="h-5 w-5 text-red-500 shrink-0" />
                                    ) : (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 shrink-0" />
                                    )}
                                    <p className={`text-sm font-medium ${error ? 'text-red-700' : 'text-green-700'}`}>
                                        {error || success}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* STEP 1: Identification */}
                        {view === 'forgot_email' && (
                            <div className="space-y-10 animate-fade-in-up">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Recuperación</h2>
                                    <p className="text-slate-500 mt-3 font-medium">Identifica tu cuenta para validar tu identidad.</p>
                                </div>

                                <form className="space-y-6" onSubmit={handleSendCode}>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Usuario o Correo</label>
                                        <div className="group relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <EnvelopeIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="usuario"
                                                required
                                                className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-300 font-medium"
                                                placeholder="Ej. usuario@house.com"
                                                value={formData.usuario}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="relative w-full overflow-hidden group py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:bg-slate-300 disabled:shadow-none"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO SEGURO'}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* STEP 2: Code Verification */}
                        {view === 'forgot_code' && (
                            <div className="space-y-10 animate-fade-in-up">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verificación</h2>
                                    <p className="text-slate-500 mt-3 font-medium">Ingresa el código que acabamos de enviarte.</p>
                                </div>

                                <form className="space-y-8" onSubmit={handleVerifyCode}>
                                    <div className="space-y-4">
                                        <div className="flex justify-center gap-2">
                                            <input
                                                type="text"
                                                name="codigo"
                                                required
                                                maxLength={6}
                                                className="block w-full text-center text-5xl font-black tracking-[0.5em] py-6 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-indigo-600 placeholder:text-slate-100"
                                                placeholder="000000"
                                                value={formData.codigo}
                                                onChange={handleChange}
                                                autoFocus
                                            />
                                        </div>
                                        <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">Código de 6 dígitos</p>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="relative w-full overflow-hidden group py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:bg-slate-300 disabled:shadow-none"
                                        >
                                            <div className="relative z-10">
                                                {loading ? 'VERIFICANDO...' : 'VALIDAR CÓDIGO'}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setView('forgot_email')}
                                            className="w-full py-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                                        >
                                            Solicitar otro código
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* STEP 3: New Password */}
                        {view === 'forgot_new_pass' && (
                            <div className="space-y-10 animate-fade-in-up">
                                <div>
                                    <KeyIcon className="h-10 w-10 text-indigo-600 mb-4" />
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Nueva Clave</h2>
                                    <p className="text-slate-500 mt-3 font-medium">Establece una contraseña más robusta.</p>
                                </div>

                                <form className="space-y-6" onSubmit={handleResetPassword}>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nueva Contraseña</label>
                                        <div className="group relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-300 font-medium"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 text-slate-400 hover:text-indigo-600 transition-colors" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-slate-400 hover:text-indigo-600 transition-colors" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirmar Contraseña</label>
                                        <div className="group relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="password_confirmation"
                                                required
                                                className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-300 font-medium"
                                                placeholder="••••••••"
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 text-slate-400 hover:text-indigo-600 transition-colors" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-slate-400 hover:text-indigo-600 transition-colors" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="relative w-full overflow-hidden group py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:bg-slate-300 disabled:shadow-none"
                                    >
                                        <div className="relative z-10">
                                            {loading ? 'ACTUALIZANDO...' : 'REESTABLECER CREDENCIALES'}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Brand */}
                <div className="p-8 text-center mt-auto">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        NexaCore Security Protocol &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
