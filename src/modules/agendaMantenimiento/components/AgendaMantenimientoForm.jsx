import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { agendaMantenimientoService } from '../services/agendaMantenimientoService';
import Swal from 'sweetalert2';
import api from '../../../services/api';

export default function AgendaMantenimientoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        mantenimiento_id: '',
        titulo: '',
        descripcion: '',
        sede_id: '',
        fecha_inicio: '',
        fecha_fin: '',
    });
    const [loading, setLoading] = useState(false);
    const [sedes, setSedes] = useState([]);
    const [mantenimientos, setMantenimientos] = useState([]);

    useEffect(() => {
        loadSelects();
        if (isEditing) {
            loadAgenda();
        }
    }, [id]);

    const loadSelects = async () => {
        try {
            const [sedesRes, mantRes] = await Promise.all([
                api.get('/sedes'),
                api.get('/mantenimientos'),
            ]);
            setSedes(sedesRes.data?.objeto ?? []);
            setMantenimientos(mantRes.data?.objeto ?? []);
        } catch (error) {
            console.error('Error loading selects:', error);
        }
    };

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const loadAgenda = async () => {
        try {
            setLoading(true);
            const data = await agendaMantenimientoService.getById(id);
            setFormData({
                mantenimiento_id: data.mantenimiento_id ?? '',
                titulo: data.titulo || '',
                descripcion: data.descripcion || '',
                sede_id: data.sede_id ?? '',
                fecha_inicio: formatDateForInput(data.fecha_inicio),
                fecha_fin: formatDateForInput(data.fecha_fin),
            });
        } catch (error) {
            console.error('Error loading agenda:', error);
            Swal.fire('Error', 'No se pudo cargar la agenda', 'error');
            navigate('/agenda-mantenimientos');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            mantenimiento_id: formData.mantenimiento_id || null,
            sede_id: formData.sede_id || null,
            fecha_inicio: formData.fecha_inicio || null,
            fecha_fin: formData.fecha_fin || null,
        };

        try {
            setLoading(true);
            if (isEditing) {
                await agendaMantenimientoService.update(id, payload);
                Swal.fire('Éxito', 'Agenda actualizada correctamente', 'success');
            } else {
                await agendaMantenimientoService.create(payload);
                Swal.fire('Éxito', 'Agenda creada correctamente', 'success');
            }
            navigate('/agenda-mantenimientos');
        } catch (error) {
            console.error('Error saving agenda:', error);
            const errorMessage =
                error.response?.data?.mensaje ||
                error.response?.data?.message ||
                'Ocurrió un error al guardar';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && !formData.titulo) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <span className="text-sm text-gray-500">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        {isEditing ? 'Editar Agenda' : 'Nueva Agenda de Mantenimiento'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {isEditing
                            ? 'Modifica los datos de la agenda seleccionada.'
                            : 'Programa una nueva fecha para un mantenimiento.'}
                    </p>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mantenimiento */}
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Mantenimiento Asociado
                            </label>
                            <div className="mt-2">
                                <select
                                    name="mantenimiento_id"
                                    value={formData.mantenimiento_id}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Seleccionar mantenimiento...</option>
                                    {mantenimientos.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.titulo} {m.codigo ? `(${m.codigo})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Título
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Ej: Revisión trimestral servidores"
                                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Sede */}
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Sede
                            </label>
                            <div className="mt-2">
                                <select
                                    name="sede_id"
                                    value={formData.sede_id}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Seleccionar sede...</option>
                                    {sedes.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Fecha Inicio
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="datetime-local"
                                        name="fecha_inicio"
                                        value={formData.fecha_inicio}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Fecha Fin
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="datetime-local"
                                        name="fecha_fin"
                                        value={formData.fecha_fin}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Descripción
                            </label>
                            <div className="mt-2">
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Detalla las actividades programadas..."
                                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-x-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/agenda-mantenimientos')}
                                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
