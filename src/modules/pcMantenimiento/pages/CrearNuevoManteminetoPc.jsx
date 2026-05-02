import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcMantenimientoService from '../services/pcMantenimientoService';
import datosEmpresaService from '../services/datosEmpresaService';
import EquipoSearchSelect from '../../pcEntregas/components/EquipoSearchSelect';
import SignaturePad from '../../signatures/components/SignaturePad';
import { authService } from '../../auth/services/authService';
import {
    WrenchScrewdriverIcon,
    ArrowLeftIcon,
    ComputerDesktopIcon,
    CalendarDaysIcon,
    ChatBubbleBottomCenterTextIcon,
    BuildingOfficeIcon,
    PlusCircleIcon,
    CurrencyDollarIcon,
    CubeIcon,
    HashtagIcon,
    CheckCircleIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function CrearNuevoManteminetoPc() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    const [formData, setFormData] = useState({
        equipo_id: '',
        tipo_mantenimiento: 'preventivo',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        empresa_responsable_id: '',
        repuesto: false,
        cantidad_repuesto: 0,
        costo_repuesto: 0,
        nombre_repuesto: '',
        estado: 'completado',
        firma_personal_cargo: '',
        firma_sistemas: ''
    });

    const [useStoredSignature, setUseStoredSignature] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadEmpresas = async () => {
            try {
                const data = await datosEmpresaService.getAll();
                setEmpresas(data);
                // Si solo hay una empresa, seleccionarla automáticamente
                if (data.length === 1) {
                    setFormData(prev => ({ ...prev, empresa_responsable_id: data[0].id }));
                }
            } catch (error) {
                console.error("Error loading empresas", error);
            }
        };

        const loadCurrentUser = async () => {
            try {
                const response = await authService.me();
                const user = response.objeto || response;
                setCurrentUser(user);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };

        loadEmpresas();
        loadCurrentUser();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.equipo_id) {
            return Swal.fire('Error', 'Debe seleccionar un equipo', 'error');
        }

        if (!formData.firma_sistemas && !useStoredSignature) {
            return Swal.fire('Firma requerida', 'El técnico de sistemas debe firmar el registro o usar su firma guardada.', 'warning');
        }

        if (useStoredSignature && !currentUser?.firma_digital) {
            return Swal.fire('Error', 'No tiene una firma guardada en su perfil', 'error');
        }

        try {
            setLoading(true);
            
            // Preparar payload limpio
            const payload = { 
                ...formData,
                use_stored_signature_sistemas: useStoredSignature
            };
            if (useStoredSignature) {
                delete payload.firma_sistemas;
            }
            
            // Limpiar campos opcionales que pueden ser strings vacíos
            if (!payload.empresa_responsable_id) {
                delete payload.empresa_responsable_id;
            } else {
                payload.empresa_responsable_id = parseInt(payload.empresa_responsable_id);
            }

            if (!payload.nombre_repuesto) delete payload.nombre_repuesto;

            await pcMantenimientoService.create(payload);
            
            await Swal.fire({
                title: '¡Éxito!',
                text: 'El mantenimiento ha sido registrado correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2rem]' }
            });
            
            navigate('/pc-mantenimientos');
        } catch (error) {
            console.error('Error creating maintenance:', error);
            
            // Extraer mensaje detallado si es un error de validación (422)
            let errorMessage = error.response?.data?.mensaje || 'No se pudo registrar el mantenimiento';
            
            if (error.response?.status === 422 && error.response.data.errors) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            }

            Swal.fire({
                title: 'Error de Validación',
                text: errorMessage,
                icon: 'error',
                customClass: { popup: 'rounded-[2rem]' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in-up font-sans">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    to="/pc-mantenimientos"
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </div>
                    Volver al listado
                </Link>
                <div className="flex items-center gap-2 text-slate-300">
                    <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-50">
                {/* Visual Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-700 px-8 py-10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl ring-1 ring-white/20">
                                <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Nuevo Mantenimiento</h1>
                                <p className="text-indigo-100 text-sm font-medium opacity-80 mt-1">
                                    Registra los detalles técnicos y repuestos utilizados.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute -top-12 -right-12 h-48 w-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-12 -left-12 h-48 w-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                    {/* Section 1: Basic Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <ComputerDesktopIcon className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Información Principal</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <EquipoSearchSelect 
                                    label="Seleccionar Equipo *"
                                    value={formData.equipo_id}
                                    onChange={(item) => setFormData(prev => ({ ...prev, equipo_id: item?.id || '' }))}
                                    placeholder="Buscar por nombre, inventario o serial..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tipo de Intervención</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <PlusCircleIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <select
                                        name="tipo_mantenimiento"
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-900 appearance-none"
                                        value={formData.tipo_mantenimiento}
                                        onChange={handleChange}
                                    >
                                        <option value="preventivo">Preventivo</option>
                                        <option value="correctivo">Correctivo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fecha de Ejecución</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <CalendarDaysIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="date"
                                        name="fecha"
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-900"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Technical Description */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-4">
                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Descripción Técnica</h2>
                        </div>
                        <textarea
                            name="descripcion"
                            rows="4"
                            className="block w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-300 shadow-inner"
                            placeholder="Describe detalladamente las acciones realizadas durante el mantenimiento..."
                            value={formData.descripcion}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Section 3: Responsibility & Spare Parts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-slate-50">
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 mb-2">
                                <BuildingOfficeIcon className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Responsabilidad</h2>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Empresa Responsable</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <BuildingOfficeIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <select
                                        name="empresa_responsable_id"
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-900 appearance-none"
                                        value={formData.empresa_responsable_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sistemas (Interno)</option>
                                        {empresas.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <CubeIcon className="h-5 w-5 text-indigo-500" />
                                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Repuestos</h2>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        name="repuesto"
                                        className="sr-only peer" 
                                        checked={formData.repuesto}
                                        onChange={handleChange}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    <span className="ms-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">¿Requiere repuestos?</span>
                                </label>
                            </div>

                            {formData.repuesto && (
                                <div className="grid grid-cols-1 gap-6 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-1">Nombre del Repuesto</label>
                                        <input
                                            type="text"
                                            name="nombre_repuesto"
                                            className="block w-full px-4 py-3 bg-white border border-indigo-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-900"
                                            placeholder="Ej: Memoria RAM 8GB DDR4"
                                            value={formData.nombre_repuesto}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-1">Cantidad</label>
                                            <input
                                                type="number"
                                                name="cantidad_repuesto"
                                                className="block w-full px-4 py-3 bg-white border border-indigo-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-900"
                                                value={formData.cantidad_repuesto}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-1">Costo Unitario</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <CurrencyDollarIcon className="h-4 w-4 text-indigo-500" />
                                                </div>
                                                <input
                                                    type="number"
                                                    name="costo_repuesto"
                                                    className="block w-full pl-8 pr-4 py-3 bg-white border border-indigo-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-900"
                                                    value={formData.costo_repuesto}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 4: Signatures */}
                    <div className="pt-10 border-t border-slate-50 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Cierre y Validación</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Firma Personal a Cargo (Opcional)</label>
                                <SignaturePad 
                                    title="Firma del Funcionario / Delegado"
                                    onSave={(data) => setFormData(prev => ({ ...prev, firma_personal_cargo: data }))}
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Firma de Sistemas <span className="text-rose-500">*</span></label>
                                    <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-200">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {useStoredSignature ? 'Usando firma guardada' : 'Dibujar firma'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setUseStoredSignature(!useStoredSignature)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 shadow-sm ${useStoredSignature ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useStoredSignature ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                                
                                {useStoredSignature ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 min-h-[160px]">
                                        {currentUser?.firma_digital ? (
                                            <div className="text-center">
                                                <img
                                                    src={currentUser.firma_digital?.startsWith('http')
                                                        ? currentUser.firma_digital
                                                        : `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${currentUser.firma_digital}`
                                                    }
                                                    alt="Firma Guardada"
                                                    className="h-24 object-contain mx-auto mb-2 mix-blend-multiply"
                                                    onError={(e) => {
                                                        console.error('Error loading signature:', e.target.src);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <p className="text-sm text-green-600 font-medium">Firma guardada lista para usar</p>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <p className="mt-2 text-sm font-medium text-gray-900">No tienes una firma guardada</p>
                                                <p className="mt-1 text-sm text-gray-500">Por favor, dibuja tu firma o configura una en tu perfil.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <SignaturePad 
                                        title="Firma del Técnico de Sistemas"
                                        onSave={(data) => setFormData(prev => ({ ...prev, firma_sistemas: data }))}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full relative overflow-hidden group rounded-2xl bg-indigo-600 px-8 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        Finalizar y Guardar Registro
                                        <CheckCircleIcon className="h-5 w-5 stroke-[2.5]" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-8 text-center">
                
            </div>
        </div>
    );
}