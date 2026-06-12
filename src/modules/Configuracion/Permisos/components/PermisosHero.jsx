import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function PermisosHero({ stats }) {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        <ShieldCheckIcon className="mr-1.5 h-3.5 w-3.5" />
                        SEGURIDAD
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Gestión de Permisos
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Configura el control de acceso basado en roles (RBAC) para la plataforma NexaCore.
                    </p>
                </div>
                {/* Stats */}
                <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-center min-w-[110px] shadow-lg">
                        <div className="text-4xl font-black">{stats.permisos}</div>
                        <div className="text-[10px] font-black text-indigo-100 uppercase tracking-widest opacity-80 mt-2">Permisos</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-center min-w-[110px] shadow-lg">
                        <div className="text-4xl font-black">{stats.roles}</div>
                        <div className="text-[10px] font-black text-indigo-100 uppercase tracking-widest opacity-80 mt-2">Roles</div>
                    </div>
                </div>
            </div>
            {/* Decorative Icon */}
            <ShieldCheckIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>
    );
}
