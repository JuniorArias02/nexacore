import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcDevueltoService from '../services/pcDevueltoService';
import pcEntregasService from '../../pcEntregas/services/pcEntregasService';
import SignaturePad from '../../signatures/components/SignaturePad';
import {
    ArrowUturnLeftIcon,
    ArrowLeftIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    ClipboardDocumentListIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentMagnifyingGlassIcon,
    CubeIcon
} from '@heroicons/react/24/outline';

export default function PcDevueltoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        entrega_id: '',
        fecha_devolucion: new Date().toISOString().split('T')[0],
        observaciones: '',
        firma_entrega: '', // User returning
        firma_recibe: '' // Admin receiving
    });

    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Signatures
    const [firmaEntrega, setFirmaEntrega] = useState(null);
    const [firmaRecibe, setFirmaRecibe] = useState(null);
    const [existingFirmaEntrega, setExistingFirmaEntrega] = useState(null);
    const [existingFirmaRecibe, setExistingFirmaRecibe] = useState(null);

    useEffect(() => {
        loadEntregas();
        if (isEditMode) {
            loadDevuelto();
        }
    }, [id]);

    const loadEntregas = async () => {
        try {
            const data = await pcEntregasService.getAll();
            setEntregas(data || []);
        } catch (error) {
            console.error('Error loading entregas:', error);
        }
    };

    const loadDevuelto = async () => {
        try {
            setLoading(true);
            const data = await pcDevueltoService.getById(id);
            if (data) {
                setFormData({
                    entrega_id: data.entrega_id,
                    fecha_devolucion: data.fecha_devolucion ? data.fecha_devolucion.split('T')[0] : '',
                    observaciones: data.observaciones || '',
                });
                setExistingFirmaEntrega(data.firma_entrega);
                setExistingFirmaRecibe(data.firma_recibe);
            }
        } catch (error) {
            console.error('Error loading devuelto:', error);
            Swal.fire('Error', 'No se pudo cargar la devolución', 'error');
            navigate('/pc-devueltos');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.entrega_id) {
            Swal.fire('Error', 'Debe seleccionar una entrega', 'error');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };

            if (firmaEntrega) payload.firma_entrega = firmaEntrega;
            if (firmaRecibe) payload.firma_recibe = firmaRecibe;

            if (isEditMode) {
                await pcDevueltoService.update(id, payload);
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Acta de devolución actualizada correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } else {
                await pcDevueltoService.create(payload);
                Swal.fire({
                    title: '¡Registrado!',
                    text: 'Se ha procesado la devolución con éxito.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            }
            navigate('/pc-devueltos');
        } catch (error) {
            console.error('Error saving devuelto:', error);
            Swal.fire('Error', 'No se pudo guardar la devolución', 'error');
        } finally {
            setLoading(false);
        }
    };

    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in font-sans">
            {/* Header Card */}
            <div className="bg-white shadow-xl rounded-[2rem] p-6 mb-8 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-4 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mr-5 shadow-lg shadow-indigo-200">
                        <ArrowUturnLeftIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            {isEditMode ? 'Acta de Devolución' : 'Retorno de Activo'}
                        </h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Logística Inversa & Gestión de Bajas</p>
                    </div>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Recovery v2.0</span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Nodo Inv. Activo</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="mb-8 flex items-center justify-between px-2">
                <button
                    onClick={() => navigate('/pc-devueltos')}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                >
                    <div className="h-9 w-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:shadow-indigo-50 transition-all">
                        <ArrowLeftIcon className="h-4 w-4 stroke-[3]" />
                    </div>
                    Ver Historial de Retornos
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">NEXA RECOVERY ENGINE</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-8 md:p-14">
                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Section: Identificación */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <DocumentMagnifyingGlassIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">1. Identificación del Registro</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Vincular con Acta de Entrega *</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <CubeIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <select
                                            name="entrega_id"
                                            value={formData.entrega_id}
                                            onChange={handleChange}
                                            required
                                            disabled={isEditMode}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold appearance-none disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <option value="">Seleccione una entrega de equipo</option>
                                            {entregas.map(entrega => (
                                                <option key={entrega.id} value={entrega.id}>
                                                    📦 {entrega.equipo?.nombre_equipo} ({entrega.equipo?.serial}) - 👤 {entrega.funcionario?.nombre || '---'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fecha de Devolución *</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <CalendarDaysIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="date"
                                            name="fecha_devolucion"
                                            value={formData.fecha_devolucion}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Observaciones / Estado del Hardware</label>
                                    <div className="group relative">
                                        <div className="absolute top-4 left-4 pointer-events-none">
                                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <textarea
                                            name="observaciones"
                                            value={formData.observaciones}
                                            onChange={handleChange}
                                            rows="1"
                                            placeholder="Describa el estado físico al retornar..."
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Protocolo de Cierre (Signatures) */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <PencilSquareIcon className="h-5 w-5 text-violet-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">2. Cierre de Responsabilidad Jurídica</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group/sig">
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center">
                                            <UserCircleIcon className="h-4 w-4 mr-2" />
                                            Firma Funcionario (Devuelve)
                                        </h4>
                                        {existingFirmaEntrega && !firmaEntrega && (
                                            <div className="mb-6 animate-fade-in group/img">
                                                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-inner group-hover/img:scale-[1.02] transition-transform">
                                                    <img
                                                        src={`${apiUrl}/${existingFirmaEntrega}`}
                                                        alt="Firma Entrega Actual"
                                                        className="h-32 mx-auto grayscale group-hover/img:grayscale-0 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <SignaturePad
                                            onSave={setFirmaEntrega}
                                            buttonText={existingFirmaEntrega ? "Actualizar Firma" : "Registrar Firma Funcionario"}
                                            title="Bóveda de Devoluciones Nexa"
                                        />
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/sig:opacity-10 transition-opacity">
                                        <ArrowUturnLeftIcon className="h-24 w-24 text-indigo-600" />
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group/sig2">
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center">
                                            <UserCircleIcon className="h-4 w-4 mr-2" />
                                            Firma Sistemas (Recibe)
                                        </h4>
                                        {existingFirmaRecibe && !firmaRecibe && (
                                            <div className="mb-6 animate-fade-in group/img">
                                                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-inner group-hover/img:scale-[1.02] transition-transform">
                                                    <img
                                                        src={`${apiUrl}/${existingFirmaRecibe}`}
                                                        alt="Firma Recibe Actual"
                                                        className="h-32 mx-auto grayscale group-hover/img:grayscale-0 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <SignaturePad
                                            onSave={setFirmaRecibe}
                                            buttonText={existingFirmaRecibe ? "Actualizar Firma" : "Registrar Firma Recepción"}
                                            title="Validación de Activo"
                                        />
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/sig2:opacity-10 transition-opacity">
                                        <CheckCircleIcon className="h-24 w-24 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submission Actions */}
                        <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-grow relative overflow-hidden group py-5 bg-indigo-600 text-white rounded-3xl font-black tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:shadow-indigo-400 transition-all transform active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3 uppercase text-xs">
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Certificando...
                                        </>
                                    ) : (
                                        <>
                                            {isEditMode ? 'Actualizar Cierre de Ciclo' : 'Certificar Retorno de Activo'}
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/pc-devueltos')}
                                className="sm:w-1/3 py-5 bg-white text-slate-400 rounded-3xl font-black tracking-widest border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all uppercase text-xs shadow-sm"
                            >
                                Cancelar Proceso
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-12 text-center pb-8 border-t border-slate-100 pt-8 opacity-40">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">
                    NexaCore Assets Engine &copy; 2026 | Protocolo de Devolución de Hardware
                </p>
            </div>
        </div>
    );
}
