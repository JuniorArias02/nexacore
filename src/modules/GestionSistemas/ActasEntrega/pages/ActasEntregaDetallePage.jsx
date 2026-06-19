import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import actasEntregaService from '../services/actasEntregaService';
import {
    DocumentTextIcon,
    ArrowLeftIcon,
    UserIcon,
    ComputerDesktopIcon,
    CubeIcon,
    CalendarIcon,
    CheckBadgeIcon,
    PrinterIcon
} from '@heroicons/react/24/outline';

export default function ActasEntregaDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [acta, setActa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadActa = async () => {
            try {
                setLoading(true);
                const data = await actasEntregaService.getById(id);
                setActa(data);
            } catch (error) {
                console.error('Error loading acta details:', error);
                Swal.fire('Error', 'No se pudieron cargar los detalles del acta', 'error');
                navigate('/gestion-sistemas/actas-entrega');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadActa();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="h-16 w-16 mx-auto rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                <span className="mt-4 block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Cargando Detalles...</span>
            </div>
        );
    }

    if (!acta) return null;

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in font-sans pb-20">
            {/* Header */}
            <div className="bg-white shadow-xl rounded-[2rem] p-6 mb-8 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mr-5 shadow-lg shadow-indigo-200">
                        <DocumentTextIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            Detalles del Acta #{acta.id}
                        </h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Visor de Documento</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="mb-8 flex items-center px-2">
                <button
                    onClick={() => navigate('/gestion-sistemas/actas-entrega')}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                >
                    <div className="h-9 w-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 transition-all">
                        <ArrowLeftIcon className="h-4 w-4 stroke-[3]" />
                    </div>
                    Volver al Listado
                </button>
            </div>

            {/* Document Content - This div can be used for printing specifically if styled */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                <div className="p-8 md:p-14">
                    
                    {/* Status Ribbon */}
                    <div className="flex justify-end mb-8">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${acta.devuelto ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            <CheckBadgeIcon className="h-4 w-4 mr-2" />
                            {acta.devuelto ? 'Devuelto el ' + acta.devuelto : (acta.estado || 'Activo / Entregado')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Funcionario Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                    <UserIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.1em] text-slate-800">Funcionario Receptor</h3>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</p>
                                    <p className="text-lg font-black text-slate-800">{acta.funcionario?.nombre || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cédula</p>
                                        <p className="text-sm font-bold text-slate-700">{acta.funcionario?.cedula || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cargo</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">
                                            {typeof acta.funcionario?.cargo === 'object' ? acta.funcionario?.cargo?.nombre : (acta.funcionario?.cargo || 'N/A')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Equipo Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.1em] text-slate-800">Equipo Principal</h3>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Serial</p>
                                    <p className="text-lg font-black text-slate-800">{acta.equipo?.serial || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marca</p>
                                        <p className="text-sm font-bold text-slate-700">{acta.equipo?.marca || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modelo</p>
                                        <p className="text-sm font-bold text-slate-700">{acta.equipo?.modelo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Periféricos */}
                    <div className="mt-12">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                            <div className="h-10 w-10 rounded-full bg-violet-50 flex items-center justify-center">
                                <CubeIcon className="h-5 w-5 text-violet-600" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.1em] text-slate-800">Periféricos Asignados</h3>
                        </div>
                        
                        {acta.perifericos && acta.perifericos.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead>
                                        <tr>
                                            <th className="py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Código</th>
                                            <th className="py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nombre / Detalle</th>
                                            <th className="py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Observaciones</th>
                                            <th className="py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {acta.perifericos.map(p => (
                                            <tr key={p.id}>
                                                <td className="py-4 text-sm font-bold text-slate-700">{p.inventario?.codigo || p.inventario_id}</td>
                                                <td className="py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800">{p.inventario?.nombre || 'Desconocido'}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{p.inventario?.marca} {p.inventario?.modelo}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-xs font-medium text-slate-600">{p.observaciones || '---'}</td>
                                                <td className="py-4 text-right font-black text-slate-800">{p.cantidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-sm font-bold text-slate-400">No se entregaron periféricos adicionales.</p>
                            </div>
                        )}
                    </div>

                    {/* Fecha y Firmas */}
                    <div className="mt-16 pt-10 border-t-2 border-dashed border-slate-200">
                        <div className="mb-8 text-center">
                            <span className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-xs font-black text-slate-600 tracking-widest uppercase">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                Fecha de Entrega: {acta.fecha_entrega}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 px-8">
                            {/* Firma Quien Entrega */}
                            <div className="text-center flex flex-col items-center">
                                <div className="h-32 w-full flex items-end justify-center border-b-2 border-slate-300 pb-2 mb-4">
                                    {acta.firma_entrega ? (
                                        <img src={acta.firma_entrega} alt="Firma de quien entrega" className="max-h-28 grayscale opacity-90 mix-blend-multiply" />
                                    ) : (
                                        <span className="text-xs text-slate-300 uppercase tracking-widest font-bold">Sin firma digital</span>
                                    )}
                                </div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Depto. de Sistemas</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Entrega</p>
                            </div>

                            {/* Firma Quien Recibe */}
                            <div className="text-center flex flex-col items-center">
                                <div className="h-32 w-full flex items-end justify-center border-b-2 border-slate-300 pb-2 mb-4">
                                    {acta.firma_recibe ? (
                                        <img src={acta.firma_recibe} alt="Firma del funcionario" className="max-h-28 grayscale opacity-90 mix-blend-multiply" />
                                    ) : (
                                        <span className="text-xs text-slate-300 uppercase tracking-widest font-bold">Sin firma digital</span>
                                    )}
                                </div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{acta.funcionario?.nombre || 'Funcionario'}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Recibe a satisfacción</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
