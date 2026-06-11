import { useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowPathIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const Error500 = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center py-10 md:py-20 text-center overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 max-w-2xl w-full px-6">
                {/* 500 Number with Premium Gradient */}
                <div className="relative inline-block mb-4 md:mb-8">
                    <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter select-none">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-100">
                            500
                        </span>
                    </h1>
                    {/* Floating/Rotating Gear Icon */}
                    <div className="absolute -top-4 -left-2 md:-top-12 md:-left-4">
                        <div className="p-3 md:p-5 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 animate-[spin_8s_linear_infinite]">
                            <WrenchScrewdriverIcon className="h-6 w-6 md:h-10 md:w-10 text-rose-500" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-10">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                        ¡Error en el Núcleo!
                    </h2>
                    <p className="text-base md:text-xl font-bold text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Algo no salió bien en nuestros servidores o estamos realizando ajustes técnicos de alta precisión. Estamos trabajando para restaurar el orden.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="group flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm"
                    >
                        <ArrowPathIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
                        REINTENTAR
                    </button>
                    
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group flex items-center gap-2 px-8 py-4 bg-slate-900 rounded-2xl font-black text-white hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-200"
                    >
                        <HomeIcon className="h-5 w-5" />
                        IR AL DASHBOARD
                    </button>
                </div>

                {/* Hint */}
                <p className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    NEXACORE • SYSTEM_MAINTENANCE_500
                </p>
            </div>
            
            {/* Visual Flair: Animated particles */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-1.5 w-1.5 bg-rose-300 rounded-full animate-ping"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${2 + Math.random() * 4}s`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Error500;