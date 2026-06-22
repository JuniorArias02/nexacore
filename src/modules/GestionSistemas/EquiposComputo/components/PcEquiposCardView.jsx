import {
    MapPinIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export default function PcEquiposCardView({
    filtered,
    estadoConfig,
    TipoIcon,
    navigate,
    exportingExcelIds,
    handleExportExcel,
    exportingPdfIds,
    handleExportPdf,
    handleDelete
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
            {filtered.map((item) => {
                const Icon = TipoIcon(item.tipo_equipo);
                const estado = estadoConfig[item.estado] || estadoConfig.mantenimiento;

                return (
                    <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <Icon className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-black text-slate-900 uppercase">
                                        {item.marca} {item.modelo || ''}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                                        {item.tipo_equipo}
                                    </div>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${estado.bg} ${estado.text} border ${estado.border} shadow-sm`}>
                                <span className={`w-2 h-2 rounded-full ${estado.dot} ${item.estado === 'operativo' ? '' : 'animate-pulse'}`}></span>
                                {item.estado}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Serial</span>
                                <span className="text-xs font-bold text-slate-700 truncate">{item.serial}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Activo Fijo</span>
                                <span className="text-xs font-bold text-slate-700 truncate">{item.activo_fijo || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50/80 flex items-center justify-center border border-indigo-100/50">
                                <MapPinIcon className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-indigo-900 truncate uppercase leading-none mb-1.5">
                                    {item.sede?.nombre || 'Sin Sede'}
                                </span>
                                <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase truncate">
                                    {item.area?.nombre || 'Sin Área'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto flex justify-between gap-2 border-t border-slate-100 pt-5">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/gestion-sistemas/pc-equipos/hoja-de-vida/${item.id}`)}
                                    className="p-2.5 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-blue-600"
                                    title="Ver Hoja de Vida"
                                >
                                    <EyeIcon className="stroke-[2] w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleExportExcel(item.id)}
                                    disabled={exportingExcelIds.includes(item.id)}
                                    className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                                        exportingExcelIds.includes(item.id)
                                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                                            : 'bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white border-slate-100 hover:border-emerald-600'
                                    }`}
                                    title="Descargar Excel"
                                >
                                    {exportingExcelIds.includes(item.id) ? (
                                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ArrowDownTrayIcon className="stroke-[2] w-5 h-5" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleExportPdf(item.id)}
                                    disabled={exportingPdfIds.includes(item.id)}
                                    className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                                        exportingPdfIds.includes(item.id)
                                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                                            : 'bg-slate-50 hover:bg-rose-600 text-slate-400 hover:text-white border-slate-100 hover:border-rose-600'
                                    }`}
                                    title="Descargar PDF"
                                >
                                    {exportingPdfIds.includes(item.id) ? (
                                        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <DocumentTextIcon className="stroke-[2] w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/gestion-sistemas/pc-equipos/editar/${item.id}`)}
                                    className="p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-indigo-600"
                                    title="Editar"
                                >
                                    <PencilSquareIcon className="h-4.5 w-4.5 stroke-[2] w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2.5 bg-slate-50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-red-600"
                                    title="Eliminar"
                                >
                                    <TrashIcon className="h-4.5 w-4.5 stroke-[2] w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
