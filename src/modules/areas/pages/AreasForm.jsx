import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { areasService } from '../services/areasService';
import { sedeService } from '../../users/services/sedeService';
import Swal from 'sweetalert2';

export default function AreasForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        sede_id: ''
    });
    const [sedes, setSedes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSedes();
        if (isEditing) {
            loadArea();
        }
    }, [id]);

    const loadSedes = async () => {
        try {
            const data = await sedeService.getAll();
            setSedes(data || []);
        } catch (error) {
            console.error("Error loading sedes:", error);
        }
    };

    const loadArea = async () => {
        try {
            setLoading(true);
            const data = await areasService.getById(id);
            setFormData({
                nombre: data.nombre,
                sede_id: data.sede_id
            });
        } catch (error) {
            console.error("Error loading area:", error);
            Swal.fire('Error', 'No se pudo cargar el área', 'error');
            navigate('/areas');
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

        if (!formData.nombre || !formData.sede_id) {
            Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
            return;
        }

        try {
            setLoading(true);
            if (isEditing) {
                await areasService.update(id, formData);
                Swal.fire('Éxito', 'Área actualizada correctamente', 'success');
            } else {
                await areasService.create(formData);
                Swal.fire('Éxito', 'Área creada correctamente', 'success');
            }
            navigate('/areas');
        } catch (error) {
            console.error("Error saving area:", error);
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
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEditing ? 'Editar Área' : 'Crear Área'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Nombre del Área *
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Ej: Recursos Humanos"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Sede *
                    </label>
                    <div className="mt-2">
                        <select
                            name="sede_id"
                            value={formData.sede_id}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                            <option value="">Seleccionar Sede...</option>
                            {sedes.map(sede => (
                                <option key={sede.id} value={sede.id}>
                                    {sede.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/areas')}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </div>
    );
}
