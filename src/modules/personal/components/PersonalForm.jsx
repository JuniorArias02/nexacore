import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personalService } from '../services/personalService';
import { pCargoService } from '../../pCargo/services/pCargoService';
import Swal from 'sweetalert2';

export default function PersonalForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        cargo_id: ''
    });
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCargos();
        if (isEditing) {
            loadPersonal();
        }
    }, [id]);

    const loadCargos = async () => {
        try {
            const response = await pCargoService.getAll();
            if (response && response.objeto) {
                setCargos(response.objeto);
            } else if (Array.isArray(response)) {
                setCargos(response);
            }
        } catch (error) {
            console.error("Error loading cargos:", error);
            Swal.fire('Error', 'No se pudieron cargar los cargos', 'error');
        }
    };

    const loadPersonal = async () => {
        try {
            setLoading(true);
            const data = await personalService.getById(id);
            setFormData({
                nombre: data.nombre,
                cedula: data.cedula || '',
                telefono: data.telefono || '',
                cargo_id: data.cargo_id || ''
            });
        } catch (error) {
            console.error("Error loading personal:", error);
            Swal.fire('Error', 'No se pudo cargar el personal', 'error');
            navigate('/personal');
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

        if (!formData.nombre || !formData.cargo_id) {
            Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
            return;
        }

        try {
            setLoading(true);
            if (isEditing) {
                await personalService.update(id, formData);
                Swal.fire('Éxito', 'Personal actualizado correctamente', 'success');
            } else {
                await personalService.create(formData);
                Swal.fire('Éxito', 'Personal creado correctamente', 'success');
            }
            navigate('/personal');
        } catch (error) {
            console.error("Error saving personal:", error);
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
                {isEditing ? 'Editar Personal' : 'Crear Personal'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Nombre *
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

                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Cédula
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Teléfono
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Cargo *
                    </label>
                    <div className="mt-2">
                        <select
                            name="cargo_id"
                            value={formData.cargo_id}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                            <option value="">Seleccione un cargo</option>
                            {cargos.map((cargo) => (
                                <option key={cargo.id} value={cargo.id}>
                                    {cargo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/personal')}
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
