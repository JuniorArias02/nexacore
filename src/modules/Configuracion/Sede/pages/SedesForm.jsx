import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { sedeService } from '../services/sedeService';
import Swal from 'sweetalert2';
import { BuildingOfficeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SedesForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nombre: ''
    });
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadSede();
        }
    }, [id]);

    const loadSede = async () => {
        try {
            const data = await sedeService.getById(id);
            setFormData({ nombre: data.nombre || '' });
        } catch (error) {
            console.error("Error loading sede:", error);
            Swal.fire('Error', 'No se pudo cargar la sede', 'error');
            navigate('/sedes');
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
        setSaving(true);

        try {
            if (isEditMode) {
                await sedeService.update(id, formData);
                Swal.fire('Éxito', 'Sede actualizada correctamente', 'success');
            } else {
                await sedeService.create(formData);
                Swal.fire('Éxito', 'Sede creada correctamente', 'success');
            }
            navigate('/sedes');
        } catch (error) {
            console.error("Error saving:", error);
            const errorMessage = error.response?.data?.mensaje || 'Error al guardar';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    to="/sedes"
                    className="p-2 rounded-xl bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm ring-1 ring-slate-100"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        {isEditMode ? 'Editar Sede' : 'Nueva Sede'}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {isEditMode ? 'Actualiza los datos de la sede' : 'Registra una nueva sede en el sistema'}
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-3xl overflow-hidden ring-1 ring-gray-900/5">
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-bold text-slate-700 mb-2">
                                Nombre de la Sede <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <BuildingOfficeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    required
                                    className="block w-full rounded-xl border-0 py-3 pl-11 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-medium bg-slate-50/50 transition-all"
                                    placeholder="Ej. Sede Principal"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                        <Link
                            to="/sedes"
                            className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                                    {isEditMode ? 'Guardar Cambios' : 'Crear Sede'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
