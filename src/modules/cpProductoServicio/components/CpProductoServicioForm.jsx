import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cpProductoServicioService } from '../services/cpProductoServicioService';
import Swal from 'sweetalert2';
import {
    TagIcon,
    IdentificationIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function CpProductoServicioForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        codigo_producto: ''
    });
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditing) {
            loadProductoServicio();
        }
    }, [id]);

    const loadProductoServicio = async () => {
        try {
            setLoading(true);
            const data = await cpProductoServicioService.getById(id);
            setFormData({
                nombre: data.nombre,
                codigo_producto: data.codigo_producto || ''
            });
        } catch (error) {
            console.error("Error loading producto servicio:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar el producto servicio',
                customClass: { popup: 'rounded-3xl' }
            });
            navigate('/cp-productos-servicios');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.codigo_producto) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor complete todos los campos marcados con *',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }

        try {
            setIsSaving(true);
            if (isEditing) {
                await cpProductoServicioService.update(id, formData);
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'El registro se ha actualizado correctamente.',
                    customClass: { popup: 'rounded-3xl' }
                });
            } else {
                await cpProductoServicioService.create(formData);
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: 'El nuevo producto/servicio ha sido registrado.',
                    customClass: { popup: 'rounded-3xl' }
                });
            }
            navigate('/cp-productos-servicios');
        } catch (error) {
            console.error("Error saving producto servicio:", error);
            const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || 'Ocurrió un error al guardar';
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: errorMessage,
                customClass: { popup: 'rounded-3xl' }
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Sincronizando datos...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in font-sans">

            {/* Header Navigation */}
            <div className="mb-8 flex items-center justify-between">
                <Link
                    to="/cp-productos-servicios"
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                >
                    <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 transition-all">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </div>
                    Volver al catálogo
                </Link>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo Maestros v2.0</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: Info Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <RocketLaunchIcon className="h-10 w-10 mb-4 opacity-80" />
                            <h2 className="text-2xl font-black tracking-tight mb-2">
                                {isEditing ? 'Actualizar Registro' : 'Nueva Alta'}
                            </h2>
                            <p className="text-indigo-50 text-sm font-medium leading-relaxed opacity-80">
                                {isEditing
                                    ? 'Modifica los atributos del catálogo maestro para reflejar los cambios actuales.'
                                    : 'Registra un nuevo producto o servicio para que esté disponible en el sistema de presupuestos.'}
                            </p>
                        </div>
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Requisitos del Sistema</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-xs font-bold text-slate-600">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
                                <span>El código debe ser único en el catálogo.</span>
                            </li>
                            <li className="flex items-start gap-2 text-xs font-bold text-slate-600">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
                                <span>No usar símbolos especiales en el nombre.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-8">

                                    {/* Código Producto */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                            Identificador Maestro *
                                        </label>
                                        <div className="group relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <IdentificationIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="codigo_producto"
                                                value={formData.codigo_producto}
                                                onChange={handleChange}
                                                required
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                                                placeholder="Ej. CP-PROD-001"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic ml-1 font-medium">Este código se usa para trazabilidad en compras.</p>
                                    </div>

                                    {/* Nombre */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                            Nombre del Bien o Servicio *
                                        </label>
                                        <div className="group relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <TagIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                                                placeholder="Ej. Servicio de Mantenimiento Preventivo"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t border-slate-50">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-grow relative overflow-hidden group py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:bg-slate-300 disabled:shadow-none"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {isSaving ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                    PROCESANDO...
                                                </>
                                            ) : (
                                                <>
                                                    {isEditing ? 'ACTUALIZAR REGISTRO' : 'CONFIRMAR REGISTRO'}
                                                </>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/cp-productos-servicios')}
                                        className="sm:w-1/3 py-4 bg-white text-slate-400 rounded-2xl font-black border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all"
                                    >
                                        CANCELAR
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Brand */}
            <div className="mt-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                    NexaCore Maestro Engine &copy; 2026
                </p>
            </div>
        </div>
    );
}
