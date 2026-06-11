import { useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, SparklesIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center py-10 md:py-20 text-center overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 max-w-2xl w-full px-6">
                {/* Visual Icon Header */}
                <div className="relative inline-block mb-10">
                    <div className="h-40 w-40 md:h-56 md:w-56 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-[3rem] flex items-center justify-center border border-amber-200/50 shadow-2xl rotate-3 relative overflow-hidden group">
                        {/* Animated Inner Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        <PuzzlePieceIcon className="h-20 w-20 md:h-28 md:w-28 text-amber-500 animate-[bounce_3s_infinite]" />
                        
                        {/* Static Mini-Icons */}
                        <SparklesIcon className="absolute top-6 right-6 h-6 w-6 text-amber-400 animate-pulse" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-10">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
                        Casi <span className="text-amber-500">Listo</span>
                    </h2>
                    <p className="text-base md:text-xl font-bold text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Nuestras mentes maestras están puliendo este módulo para que tengas una experiencia impecable. ¡Falta muy poco para el despliegue!
                    </p>
                </div>

                {/* Modern Progress Indicator */}
                {/* <div className="max-w-xs mx-auto mb-12">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso de Obra</span>
                        <span className="text-[10px] font-black text-amber-600 uppercase">85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-[shimmer_2s_infinite]"
                            style={{ width: '85%' }}
                        />
                    </div>
                </div> */}

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
                    NEXACORE • MODULE_CONSTRUCTION_STATUS
                </p>
            </div>
            
            {/* Visual Flair: Grid Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none"
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
    );
};

export default ComingSoon;
