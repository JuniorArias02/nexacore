import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cpCentroCostoService } from '../services/cpCentroCostoService';
import Swal from 'sweetalert2';

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
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEditing ? 'Editar Centro de Costo (CP)' : 'Crear Centro de Costo (CP)'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Código (Opcional)
                    </label>
                    <div className="mt-2">
                        <input
                            type="number"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Nombre del Centro de Costo *
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/cp-centro-costos')}
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
