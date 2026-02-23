import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cpCentroCostoService } from '../services/cpCentroCostoService';
import Swal from 'sweetalert2';
import {
    TagIcon,
    IdentificationIcon,
    ArrowLeftIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function CpCentroCostoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        codigo: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            loadCentroCosto();
        }
    }, [id]);

    const loadCentroCosto = async () => {
        try {
            setLoading(true);
            const data = await cpCentroCostoService.getById(id);
            setFormData({
                nombre: data.nombre,
                codigo: data.codigo || ''
            });
        } catch (error) {
            console.error("Error loading centro de costo:", error);
            Swal.fire('Error', 'No se pudo cargar el centro de costo', 'error');
            navigate('/cp-centro-costos');
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

        if (!formData.nombre) {
            Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
            return;
        }

        try {
            setLoading(true);
            if (isEditing) {
                await cpCentroCostoService.update(id, formData);
                Swal.fire('Éxito', 'Centro de costo actualizado correctamente', 'success');
            } else {
                await cpCentroCostoService.create(formData);
                Swal.fire('Éxito', 'Centro de costo creado correctamente', 'success');
            }
            navigate('/cp-centro-costos');
        } catch (error) {
            console.error("Error saving centro de costo:", error);
            const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || 'Ocurrió un error al guardar';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && !formData.nombre) {
        return <div className="text-center p-4">Cargando...</div>;
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in font-sans">

            {/* Header Section - Matching CpPedidoForm Style */}
            <div className="bg-white shadow-lg rounded-3xl p-6 mb-8 border border-slate-100 flex items-center">
                <div className="p-3 bg-indigo-100 rounded-2xl mr-4 shadow-sm">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {isEditing ? 'Editar Centro de Costo' : 'Crear Centro de Costo'}
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Clasificación Presupuestaria NexaCore</p>
                </div>
            </div>

            {/* Sub-Header Navigation */}
            <div className="mb-8 flex items-center justify-between px-2">
                <Link
                    to="/cp-centro-costos"
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                >
                    <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 transition-all">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </div>
                    Volver al catálogo
                </Link>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-widest">Protocolo Maestros v2.0</span>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8">
                            {/* Código */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                    Identificador Numérico (Opcional)
                                </label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <IdentificationIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="number"
                                        name="codigo"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                                        placeholder="Ej. 1010"
                                    />
                                </div>
                            </div>

                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                    Nombre del Centro de Costo *
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
                                        placeholder="Ingrese el nombre descriptivo"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-grow relative overflow-hidden group py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:bg-slate-300 disabled:shadow-none"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
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
                                onClick={() => navigate('/cp-centro-costos')}
                                className="sm:w-1/3 py-4 bg-white text-slate-400 rounded-2xl font-black border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all"
                            >
                                CANCELAR
                            </button>
                        </div>
                    </form>
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
