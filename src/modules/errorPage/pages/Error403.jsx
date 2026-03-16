import { useNavigate } from 'react-router-dom';
import { HomeIcon, ShieldExclamationIcon, LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';

const Error403 = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center py-10 md:py-20 text-center overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 max-w-2xl w-full px-6">
                {/* Visual Lock Header */}
                <div className="relative inline-block mb-10">
                    <div className="h-40 w-40 md:h-56 md:w-56 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] flex items-center justify-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] -rotate-3 relative group">
                        <LockClosedIcon className="h-20 w-20 md:h-28 md:w-28 text-rose-500 animate-pulse" />
                        
                        {/* Orbiting Keys */}
                        <div className="absolute -top-4 -right-4 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 rotate-12 animate-bounce">
                            <KeyIcon className="h-6 w-6 text-slate-400" />
                        </div>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute -bottom-4 right-0 px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-rose-200 uppercase tracking-widest animate-bounce">
                        Restringido
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-10">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
                        Acceso <span className="text-rose-500">Privado</span>
                    </h2>
                    <p className="text-base md:text-xl font-bold text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Lo sentimos, pero no cuentas con las credenciales o el nivel de autorización necesario para entrar en este sector de la plataforma.
                    </p>
                </div>

                {/* Secure Instructions */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-10 inline-flex items-center gap-3">
                    <ShieldExclamationIcon className="h-5 w-5 text-rose-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                        Contacta con soporte si crees que esto es un error.
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm"
                    >
                        REGRESAR
                    </button>
                    
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group flex items-center gap-2 px-8 py-4 bg-slate-900 rounded-2xl font-black text-white hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-200"
                    >
                        <HomeIcon className="h-5 w-5" />
                        IR AL DASHBOARD
                    </button>
                </div>

                {/* Technical Footnote */}
                <p className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    NEXACORE • SECURE_ZONE_AUTH_403
                </p>
            </div>
            
            {/* Visual Flair: Grid Dots */}
            <div className="absolute inset-0 pointer-events-none opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(circle, #f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );
};

export default Error403;
