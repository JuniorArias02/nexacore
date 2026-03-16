import { useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center py-10 md:py-20 text-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-700" />
            
            <div className="relative z-10 max-w-2xl w-full px-6">
                {/* 404 Number with Premium Gradient */}
                <div className="relative inline-block mb-4 md:mb-8">
                    <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter select-none">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-100">
                            404
                        </span>
                    </h1>
                    {/* Floating Icon or Element */}
                    <div className="absolute -top-4 -right-2 md:-top-12 md:-right-4 animate-bounce duration-[3000ms]">
                        <div className="p-3 md:p-5 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 rotate-12 scale-90 md:scale-100">
                            <RocketLaunchIcon className="h-6 w-6 md:h-10 md:w-10 text-indigo-600" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-10">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                        ¡Perdidisimo en el espacio!
                    </h2>
                    <p className="text-base md:text-xl font-bold text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Parece que la página que buscas se ha ido a otra dimensión o nunca existió en este servidor. No te preocupes, te ayudamos a volver.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        VOLVER ATRÁS
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
                    NEXACORE • ERROR_CODE_SH_404
                </p>
            </div>
            
            {/* Visual Flair: Moving Stars/Dots */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-1 bg-slate-400 rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Error404;
