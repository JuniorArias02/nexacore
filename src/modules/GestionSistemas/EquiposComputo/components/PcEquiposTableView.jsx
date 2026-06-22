import {
    MapPinIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export default function PcEquiposTableView({
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
        <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50 transition-all">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equipo / Tipo</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificadores</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ubicación</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filtered.map((item) => {
                            const Icon = TipoIcon(item.tipo_equipo);
                            const estado = estadoConfig[item.estado] || estadoConfig.mantenimiento;
                            return (
                                <tr key={item.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
                                                    {item.marca} {item.modelo || ''}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                                                    {item.tipo_equipo}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Serial:</span>
                                                <span className="text-xs font-bold text-slate-700 truncate">{item.serial}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">Activo:</span>
                                                <span className="text-xs font-bold text-slate-700 truncate">{item.activo_fijo || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-50/50 flex items-center justify-center border border-indigo-100/50">
                                                <MapPinIcon className="h-4 w-4 text-indigo-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-indigo-900 truncate uppercase leading-none mb-1">
                                                    {item.sede?.nombre || 'Sin Sede'}
                                                </span>
                                                <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase truncate">
                                                    {item.area?.nombre || 'Sin Área'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${estado.bg} ${estado.text} border ${estado.border} shadow-sm`}>
                                            <span className={`w-2 h-2 rounded-full ${estado.dot} ${item.estado === 'operativo' ? '' : 'animate-pulse'}`}></span>
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            <button
                                                onClick={() => navigate(`/gestion-sistemas/pc-equipos/hoja-de-vida/${item.id}`)}
                                                className="p-2.5 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-blue-600 hover:-translate-y-0.5"
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
                                                        : 'bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white border-slate-100 hover:border-emerald-600 hover:-translate-y-0.5'
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
                                                        : 'bg-slate-50 hover:bg-rose-600 text-slate-400 hover:text-white border-slate-100 hover:border-rose-600 hover:-translate-y-0.5'
                                                }`}
                                                title="Descargar PDF"
                                            >
                                                {exportingPdfIds.includes(item.id) ? (
                                                    <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <DocumentTextIcon className="stroke-[2] w-5 h-5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/gestion-sistemas/pc-equipos/editar/${item.id}`)}
                                                className="p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-indigo-600 hover:-translate-y-0.5"
                                                title="Editar"
                                            >
                                                <PencilSquareIcon className="h-4.5 w-4.5 stroke-[2] w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2.5 bg-slate-50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 hover:border-red-600 hover:-translate-y-0.5"
                                                title="Eliminar"
                                            >
                                                <TrashIcon className="h-4.5 w-4.5 stroke-[2] w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
