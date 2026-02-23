import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEntregasService from '../services/pcEntregasService';
import PersonalSearchSelect from '../components/PersonalSearchSelect';
import EquipoSearchSelect from '../components/EquipoSearchSelect';
import SignaturePad from '../../signatures/components/SignaturePad';
import {
    TruckIcon,
    ArrowLeftIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    CubeIcon,
    ClipboardDocumentCheckIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function PcEntregasForm({ equipoId: propEquipoId, onCancel: propOnCancel, onSuccess: propOnSuccess }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        equipo_id: propEquipoId || '',
        funcionario_id: '',
        funcionario_nombre: '', // For display
        fecha_entrega: new Date().toISOString().split('T')[0],
        devuelto: '',
        estado: 'entregado',
    });
    const [loading, setLoading] = useState(false);

    // Signature State
    const [firmaEntrega, setFirmaEntrega] = useState(null); // New signature
    const [firmaRecibe, setFirmaRecibe] = useState(null); // New signature
    const [existingFirmaEntrega, setExistingFirmaEntrega] = useState(null); // URL from DB
    const [existingFirmaRecibe, setExistingFirmaRecibe] = useState(null); // URL from DB

    useEffect(() => {
        if (isEditMode) {
            loadEntrega();
        }
    }, [id]);

    const loadEntrega = async () => {
        try {
            setLoading(true);
            const data = await pcEntregasService.getById(id);
            if (data) {
                setFormData({
                    equipo_id: data.equipo_id,
                    funcionario_id: data.funcionario_id,
                    funcionario_nombre: data.funcionario ? data.funcionario.nombre : '',
                    fecha_entrega: data.fecha_entrega,
                    devuelto: data.devuelto || '',
                    estado: data.estado,
                });

                // Set existing signatures
                setExistingFirmaEntrega(data.firma_entrega);
                setExistingFirmaRecibe(data.firma_recibe);
            }
        } catch (error) {
            console.error('Error loading entrega', error);
            Swal.fire('Error', 'No se pudo cargar la entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEquipoSelect = (item) => {
        if (item) {
            setFormData(prev => ({
                ...prev,
                equipo_id: item.id
            }));
        } else {
            setFormData(prev => ({ ...prev, equipo_id: '' }));
        }
    };

    const handlePersonalSelect = (item) => {
        setFormData(prev => ({
            ...prev,
            funcionario_id: item ? item.id : '',
            funcionario_nombre: item ? item.nombre : ''
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.funcionario_id) {
            Swal.fire('Error', 'Debe seleccionar un funcionario', 'error');
            return;
        }

        if (!formData.equipo_id) {
            Swal.fire('Error', 'Debe seleccionar un equipo', 'error');
            return;
        }

        setLoading(true);
        try {
            // Only send signatures if they are new (not null)
            const payload = {
                ...formData,
            };

            if (firmaEntrega) {
                payload.firma_entrega = firmaEntrega;
            }

            if (firmaRecibe) {
                payload.firma_recibe = firmaRecibe;
            }

            if (isEditMode) {
                await pcEntregasService.update(id, payload);
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Acta de entrega actualizada correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } else {
                await pcEntregasService.create(payload);
                Swal.fire({
                    title: '¡Registrado!',
                    text: 'Se ha creado el acta de entrega con éxito.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            }

            if (propOnSuccess) {
                propOnSuccess();
            } else {
                navigate('/pc-entregas');
            }
        } catch (error) {
            console.error('Error saving entrega:', error);
            Swal.fire('Error', 'No se pudo guardar la entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onCancel = propOnCancel || (() => navigate('/pc-entregas'));
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

    if (loading && isEditMode && !formData.equipo_id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cargando Acta...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in font-sans">
            {/* Header Card */}
            <div className="bg-white shadow-xl rounded-[2rem] p-6 mb-8 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-4 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mr-5 shadow-lg shadow-indigo-200">
                        <TruckIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            {isEditMode ? 'Acta de Entrega' : 'Nueva Asignación'}
                        </h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control de Hardware & Activos</p>
                    </div>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Lifecycle v2.0</span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Sistema Activo</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="mb-8 flex items-center justify-between px-2">
                <button
                    onClick={onCancel}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                >
                    <div className="h-9 w-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:shadow-indigo-50 transition-all">
                        <ArrowLeftIcon className="h-4 w-4 stroke-[3]" />
                    </div>
                    Volver al Listado
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NEXA ASSETS ENGINE</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-8 md:p-14">
                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Section: Selección de Recursos */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <CubeIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">1. Recursos del Acta</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Seleccionar Equipo *</label>
                                    <EquipoSearchSelect
                                        value={formData.equipo_id}
                                        onChange={handleEquipoSelect}
                                        disabled={!!propEquipoId}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Funcionario que Recibe *</label>
                                    <PersonalSearchSelect
                                        value={formData.funcionario_id}
                                        onChange={handlePersonalSelect}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Logística */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <CalendarDaysIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">2. Detalles de Logística</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fecha de Entrega</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ClockIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="date"
                                            name="fecha_entrega"
                                            value={formData.fecha_entrega}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Estado del Proceso</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ClipboardDocumentCheckIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <select
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold appearance-none"
                                        >
                                            <option value="entregado">📦 Entregado</option>
                                            <option value="devuelto">🔄 Devuelto</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.estado === 'devuelto' && (
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fecha Devolución</label>
                                        <input
                                            type="date"
                                            name="devuelto"
                                            value={formData.devuelto}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section: Validaciones Jurídicas (Signatures) */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <PencilSquareIcon className="h-5 w-5 text-violet-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">3. Protocolo de Validación Jurídica</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group/sig">
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center">
                                            <UserCircleIcon className="h-4 w-4 mr-2" />
                                            Firma Sistemas (Emite)
                                        </h4>
                                        {existingFirmaEntrega && !firmaEntrega && (
                                            <div className="mb-6 animate-fade-in group/img">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Registro de Seguridad:</p>
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
                                            buttonText={existingFirmaEntrega ? "Actualizar Firma" : "Registrar Firma Emisor"}
                                            title="Bóveda de Firmas Nexa"
                                        />
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/sig:opacity-10 transition-opacity">
                                        <DocumentTextIcon className="h-24 w-24 text-indigo-600" />
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group/sig2">
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center">
                                            <UserCircleIcon className="h-4 w-4 mr-2" />
                                            Firma Funcionario (Recibe)
                                        </h4>
                                        {existingFirmaRecibe && !firmaRecibe && (
                                            <div className="mb-6 animate-fade-in group/img">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Certificado Digital:</p>
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
                                            buttonText={existingFirmaRecibe ? "Actualizar Firma" : "Registrar Firma Receptor"}
                                            title="Validación de Identidad"
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
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            {isEditMode ? 'Sincronizar Acta' : 'Generar Acta de Entrega'}
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="sm:w-1/3 py-5 bg-white text-slate-400 rounded-3xl font-black tracking-widest border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all uppercase text-xs shadow-sm"
                            >
                                Cancelar Registro
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-12 text-center pb-8 border-t border-slate-100 pt-8 opacity-40">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">
                    NexaCore Assets Engine &copy; 2026 | Protocolo de Control de Hardware
                </p>
            </div>
        </div>
    );
}
