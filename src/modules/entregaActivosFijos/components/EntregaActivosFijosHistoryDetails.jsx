import React, { useState } from 'react';
import { 
    UserIcon, 
    TableCellsIcon, 
    CubeIcon, 
    ChevronDownIcon, 
    ChevronUpIcon 
} from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/dateFormatter';

export default function EntregaActivosFijosHistoryDetails({ 
    entregas, 
    loading, 
    handleExportExcel, 
    exportingId 
}) {
    const [expandedEntregaId, setExpandedEntregaId] = useState(null);

    const toggleRow = (id) => {
        setExpandedEntregaId(expandedEntregaId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (entregas.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-slate-100">
                <p className="text-lg font-medium text-slate-500">No se encontraron actas para este coordinador.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-slate-100 animate-fade-in-up">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acta ID</th>
                            <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha</th>
                            <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable (Recibe)</th>
                            <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sede</th>
                            <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Items</th>
                            <th scope="col" className="relative px-6 py-5">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {entregas.map((entrega) => (
                            <React.Fragment key={entrega.id}>
                                <tr className="hover:bg-indigo-50/30 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleRow(entrega.id)}
                                            className="flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700"
                                        >
                                            #{entrega.id}
                                            {expandedEntregaId === entrega.id ? (
                                                <ChevronUpIcon className="h-4 w-4" />
                                            ) : (
                                                <ChevronDownIcon className="h-4 w-4" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                                        {formatDate(entrega.fecha_entrega)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                                                <UserIcon className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">
                                                {entrega.personal?.nombre || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600 ring-1 ring-inset ring-slate-200">
                                            {entrega.sede?.nombre || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                                            {entrega.items?.length || 0} items
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleExportExcel(entrega.id)}
                                            disabled={exportingId === entrega.id}
                                            className={`p-2 rounded-xl transition-all ${exportingId === entrega.id ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200'}`}
                                            title="Exportar a Excel"
                                        >
                                            {exportingId === entrega.id ? (
                                                <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <TableCellsIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                                {/* Expanded Details */}
                                {expandedEntregaId === entrega.id && (
                                    <tr className="bg-slate-50/30">
                                        <td colSpan="6" className="px-6 py-6">
                                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-fade-in-up">
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                                    <CubeIcon className="h-4 w-4 text-indigo-500" />
                                                    Detalle de Activos
                                                </h4>
                                                <div className="overflow-hidden rounded-2xl border border-slate-100">
                                                    <table className="min-w-full divide-y divide-slate-100">
                                                        <thead className="bg-slate-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Código</th>
                                                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Activo</th>
                                                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial</th>
                                                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Obs</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 bg-white">
                                                            {entrega.items?.map((item) => (
                                                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                                    <td className="px-4 py-3 text-xs font-black text-indigo-600">
                                                                        {item.inventario?.codigo || 'N/A'}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm font-bold text-slate-700">
                                                                        {item.inventario?.nombre || 'N/A'}
                                                                        <span className="block text-[10px] text-slate-400 font-medium">
                                                                            {item.inventario?.marca} {item.inventario?.modelo ? `/ ${item.inventario?.modelo}` : ''}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                                                                        {item.inventario?.serial || 'N/A'}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-xs">
                                                                        {item.es_accesorio ? (
                                                                            <span className="text-emerald-600 font-bold">Accesorio: {item.accesorio_descripcion}</span>
                                                                        ) : (
                                                                            <span className="text-slate-300">Sin obs</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Signatures Summary */}
                                                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-8 justify-around">
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Quien Entrega</p>
                                                        <div className="h-20 w-48 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100">
                                                            {entrega.firma_quien_entrega ? (
                                                                <img src={entrega.firma_quien_entrega} className="max-h-full mix-blend-multiply" alt="Firma" />
                                                            ) : <span className="text-[10px] font-bold text-slate-300">SIN FIRMA</span>}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Quien Recibe</p>
                                                        <div className="h-20 w-48 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100">
                                                            {entrega.firma_quien_recibe ? (
                                                                <img src={entrega.firma_quien_recibe} className="max-h-full mix-blend-multiply" alt="Firma" />
                                                            ) : <span className="text-[10px] font-bold text-slate-300">SIN FIRMA</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
