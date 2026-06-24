import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CpHorarioPedido() {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            
            <div className="flex items-center mb-6 relative z-10">
                <div className="bg-indigo-100 p-3 rounded-2xl mr-4 shadow-sm border border-indigo-200">
                    <ClockIcon className="h-6 w-6 text-indigo-700" />
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Horarios de Creación de Pedidos</h3>
                    <p className="text-sm text-slate-500 font-medium">Información sobre la disponibilidad del sistema para pedidos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center mb-4 border-b border-slate-100 pb-3">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                            Pedidos Recurrentes
                        </span>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="bg-indigo-100 rounded-full p-1 mt-0.5 mr-3 shrink-0">
                                <ClockIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                                <strong className="block text-sm text-slate-800">Lunes a Viernes</strong>
                                <span className="text-sm text-slate-600 font-medium">7:30 AM - 8:30 AM  <span className="text-slate-300 mx-1">|</span>  2:00 PM - 3:00 PM</span>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="bg-indigo-100 rounded-full p-1 mt-0.5 mr-3 shrink-0">
                                <ClockIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                                <strong className="block text-sm text-slate-800">Sábados</strong>
                                <span className="text-sm text-slate-600 font-medium">8:00 AM - 9:00 PM</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center mb-4 border-b border-emerald-50 pb-3">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                            Pedidos Prioritarios
                        </span>
                    </div>
                    <div className="flex items-start mt-2">
                        <div className="bg-emerald-100 rounded-full p-1 mt-0.5 mr-3 shrink-0">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            Los pedidos de tipo prioritario están habilitados para realizarse <strong className="text-emerald-700">en cualquier momento</strong>, sin restricciones de horario.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
