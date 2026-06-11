import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, InboxIcon } from '@heroicons/react/24/outline';
import { buzonSugerenciasService } from '../services/buzonSugerenciasService';

export default function BuzonSugerenciasList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await buzonSugerenciasService.getMias();
            setItems(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError('No se pudo cargar la información.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Abierto': return 'bg-emerald-100 text-emerald-800 ring-emerald-600/20';
            case 'En Proceso': return 'bg-amber-100 text-amber-800 ring-amber-600/20';
            case 'Resuelto': return 'bg-blue-100 text-blue-800 ring-blue-600/20';
            case 'Cerrado': return 'bg-slate-100 text-slate-800 ring-slate-600/20';
            default: return 'bg-gray-100 text-gray-800 ring-gray-600/20';
        }
    };

    const getPrioridadColor = (prioridad) => {
        switch (prioridad) {
            case 'Alta': return 'text-red-600 bg-red-50 ring-red-500/10';
            case 'Media': return 'text-amber-600 bg-amber-50 ring-amber-500/10';
            case 'Baja': return 'text-emerald-600 bg-emerald-50 ring-emerald-500/10';
            default: return 'text-gray-600 bg-gray-50 ring-gray-500/10';
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        MI BUZÓN
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Mis Sugerencias
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Visualiza el estado de los tickets que has reportado o crea una nueva sugerencia.
                    </p>
                    <div className="mt-8">
                        <Link to="/buzon/nuevo"
                            className="inline-flex items-center rounded-2xl bg-white px-6 py-3 text-sm font-black tracking-widest text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg shadow-indigo-200/50">
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            NUEVA SUGERENCIA
                        </Link>
                    </div>
                </div>
                <InboxIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            <div className="bg-white shadow-xl rounded-3xl overflow-hidden ring-1 ring-gray-900/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="py-4 pl-6 pr-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ticket</th>
                                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asunto</th>
                                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Prioridad</th>
                                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Estado</th>
                                <th className="px-3 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Fecha</th>
                                <th className="relative py-4 pl-3 pr-6"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                                        No has reportado ninguna sugerencia aún.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="py-4 pl-6 pr-3 text-sm font-bold text-slate-900">
                                            {item.codigo_ticket}
                                        </td>
                                        <td className="px-3 py-4 text-sm font-medium text-slate-900">{item.asunto}</td>
                                        <td className="px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ring-1 ring-inset ${getPrioridadColor(item.prioridad)}`}>
                                                {item.prioridad}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ring-1 ring-inset ${getStatusColor(item.estado?.nombre)}`}>
                                                {item.estado?.nombre}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-sm text-slate-500">
                                            {new Date(item.fecha_creacion).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 pl-3 pr-6 text-right">
                                            <button onClick={() => navigate(`/buzon/${item.codigo_ticket}`)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors bg-indigo-50 hover:bg-indigo-100 rounded-full p-2">
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
