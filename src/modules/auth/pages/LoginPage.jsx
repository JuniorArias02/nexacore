import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    UserIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    InformationCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        usuario: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
    }, []);

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
        <div className="flex min-h-screen bg-slate-50 selection:bg-indigo-100 overflow-hidden font-sans">
            {/* Left Side - Visual Heritage/Future */}
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
                        <span className="text-2xl font-bold tracking-tight text-white">NexaCore <span className="text-indigo-400 font-light italic"></span></span>
                    </div>

                    <div className={`transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                            <SparklesIcon className="h-4 w-4" />
                            ECOSISTEMA NEXA 2026
                        </div>
                        <h1 className="text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
                            Transformando la <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
                                gestión operativa.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 font-light max-w-xl leading-relaxed">
                            Integración inteligente de Sistemas y Compras en una plataforma unificada, rápida y segura.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 border-t border-white/10 pt-8">
                        <div>
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Cloud-Native</div>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div>
                            <div className="text-2xl font-bold text-white">2.0.x</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Latest Alpha</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form Context */}
            <div className="w-full lg:w-2/5 flex flex-col relative bg-white lg:bg-slate-50">
                {/* Floating Navigation/Info */}
                <div className="absolute top-8 right-8 z-20">
                    <Link
                        to="/info-sistema"
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 hover:border-indigo-300 transition-all duration-300"
                    >
                        <InformationCircleIcon className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600">Info Sistema</span>
                    </Link>
                </div>

                <div className="flex-grow flex items-center justify-center p-8">
                    <div className={`w-full max-w-md space-y-10 transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                        {/* Logo for mobile */}
                        <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">N</div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">NexaCore</span>
                        </div>

                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Bienvenido</h2>
                            <p className="text-slate-500 mt-3 font-medium">Ingresa para administrar tu departamento.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl animate-shake">
                                <div className="flex gap-3">
                                    <ShieldCheckIcon className="h-5 w-5 text-red-500 shrink-0" />
                                    <p className="text-sm font-medium text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cédula o Usuario</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
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

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Contraseña</label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        ¿Nueva clave?
                                    </Link>
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="contrasena"
                                        required
                                        className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-300 font-medium"
                                        placeholder="••••••••"
                                        value={formData.contrasena}
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full overflow-hidden group py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>PROCESANDO...</span>
                                        </>
                                    ) : (
                                        <span>ACCEDER AL PANEL</span>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Brand */}
                <div className="p-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Powered by NexaCore Ecosystem &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
