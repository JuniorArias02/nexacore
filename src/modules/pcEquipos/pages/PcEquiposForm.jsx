import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEquiposService from '../services/pcEquiposService';
import PcCaracteristicasTecnicasForm from '../components/PcCaracteristicasTecnicasForm';

import api from '../../../services/api';

export default function PcEquiposForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    // Image Upload State
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Dropdown Data
    const [sedes, setSedes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [personal, setPersonal] = useState([]);

    const [formData, setFormData] = useState({
        tipo: '',
        marca: '',
        modelo: '',
        serial: '',
        numero_inventario: '',
        sede_id: '',
        area_id: '',
        responsable_id: '', // Personal ID
        estado: 'operativo'
    });

    useEffect(() => {
        loadCatalogs();
        if (isEditMode) {
            loadEquipo(id);
        }
    }, [id]);

    const loadCatalogs = async () => {
        try {
            // Fetch Sedes
            const sedesRes = await api.get('/sedes');
            setSedes(sedesRes.data.objeto || sedesRes.data || []);

            // Fetch Personal (for responsable)
            // Assuming endpoint /personal exists
            try {
                const personalRes = await api.get('/personal');
                setPersonal(personalRes.data.objeto || personalRes.data || []);
            } catch (e) { console.warn('Could not load personal', e); }

        } catch (error) {
            console.error('Error loading catalogs', error);
        }
    };

    const loadEquipo = async (equipoId) => {
        try {
            setInitialLoading(true);
            const response = await pcEquiposService.getById(equipoId);
            if (response && response.objeto) {
                // Map backend fields to form fields if needed, but they should match now
                setFormData(response.objeto);
                // Trigger area load if sede is selected
                if (response.objeto.sede_id) {
                    loadAreas(response.objeto.sede_id);
                }

                if (response.objeto.imagen_url) {
                    // Check if it's a full URL or relative
                    if (response.objeto.imagen_url.startsWith('http')) {
                        setPreviewUrl(response.objeto.imagen_url);
                    } else {
                        // Assuming public folder access via base URL
                        setPreviewUrl(`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${response.objeto.imagen_url}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading equipo:', error);
            const errorMsg = error.response?.data?.mensaje || error.response?.data?.message || 'No se pudo cargar el equipo';
            Swal.fire('Error', errorMsg, 'error').then(() => {
                navigate('/pc-equipos');
            });
        } finally {
            setInitialLoading(false);
        }
    };

    const loadAreas = async (sedeId) => {
        if (!sedeId) {
            setAreas([]);
            return;
        }
        try {
            // Assuming endpoint exists for areas by sede or just filter all areas
            // Let's try standard endpoint. If dependent, maybe /areas?sede_id=...
            // Or /dependencias like in previous tasks?
            // User schema mentioned `areas` table.
            // Let's try fetching all areas for now or specific endpoint.
            const response = await api.get('/areas');
            const allAreas = response.data.objeto || response.data || [];
            // Client side filter if needed, or if API supports it
            setAreas(allAreas);
        } catch (error) {
            console.error('Error loading areas', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'sede_id') {
            loadAreas(value);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            Swal.fire('Atención', 'Selecciona una imagen primero', 'warning');
            return;
        }

        const data = new FormData();
        data.append('imagen', imageFile);
        data.append('_method', 'PUT'); // For Laravel partial update via POST/PUT with method spoofing if needed, but here we can stick to api.put if we send FormData properly, but usually axios put with formData works differently in Laravel sometimes.
        // Actually, for file uploads in Laravel with PUT/PATCH, it's safer to use POST with _method=PUT.
        // But let's try calling update service.
        // Wait, pcEquiposService.update sends JSON by default in axios if we pass object? 
        // We need to modify the service call or call API directly here for FormData.

        // Let's call api directly for image upload to be safe and specific.
        try {
            const uploadData = new FormData();
            uploadData.append('imagen', imageFile);
            uploadData.append('_method', 'PUT'); // Trick for Laravel PUT file upload

            // We also need to send other required fields if validation is strict?
            // Validation said 'sometimes', so we should be good sending just image?
            // Controller validation: unique serial...
            // If we don't send serial, it might fail if 'sometimes' rules trigger or if 'required' rules trigger.
            // But validation says: 'serial' => 'sometimes|string...'.
            // So if we don't send 'serial', it won't check it?

            setLoading(true);
            const response = await api.post(`/pc-equipos/${id}`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire('Éxito', 'Imagen actualizada correctamente', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.mensaje || 'No se pudo subir la imagen';
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await pcEquiposService.update(id, formData);
                Swal.fire('Actualizado', 'Equipo actualizado correctamente', 'success');
            } else {
                const response = await pcEquiposService.create(formData);
                const newId = response.objeto?.id || response.id;
                Swal.fire({
                    title: 'Creado',
                    text: 'Equipo creado. Ahora puedes agregar las características técnicas.',
                    icon: 'success',
                    confirmButtonText: 'Ir a Características'
                }).then(() => {
                    navigate(`/pc-equipos/editar/${newId}`);
                    setActiveTab('caracteristicas');
                });
            }
        } catch (error) {
            console.error('Error saving equipo:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.mensaje || 'No se pudo guardar el equipo';
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isEditMode ? 'Editar Equipo' : 'Nuevo Equipo'}
            </h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`${activeTab === 'general'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Información General
                    </button>
                    <button
                        onClick={() => {
                            if (!isEditMode) {
                                Swal.fire('Atención', 'Debes guardar la información general primero', 'warning');
                                return;
                            }
                            setActiveTab('caracteristicas');
                        }}
                        className={`${activeTab === 'caracteristicas'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Características Técnicas
                    </button>
                    <button
                        onClick={() => {
                            if (!isEditMode) {
                                Swal.fire('Atención', 'Debes guardar la información general primero', 'warning');
                                return;
                            }
                            setActiveTab('imagen');
                        }}
                        className={`${activeTab === 'imagen'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Imagen del Equipo
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'general' && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo</label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="desktop">Desktop</option>
                                <option value="laptop">Laptop</option>
                                <option value="servidor">Servidor</option>
                                <option value="todo_en_uno">Todo en Uno</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                            <input
                                type="text"
                                name="marca"
                                value={formData.marca}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                            <input
                                type="text"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
                            <input
                                type="text"
                                name="serial"
                                value={formData.serial}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Activo Fijo</label>
                            <input
                                type="text"
                                name="numero_inventario"
                                value={formData.numero_inventario}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="operativo">Operativo</option>
                                <option value="en_reparacion">En Reparación</option>
                                <option value="baja">Baja</option>
                                <option value="asignado">Asignado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                            <select
                                name="sede_id"
                                value={formData.sede_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Seleccione Sede...</option>
                                {sedes.map(sede => (
                                    <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                            <select
                                name="area_id"
                                value={formData.area_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Seleccione Área...</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.id}>{area.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                            <select
                                name="responsable_id"
                                value={formData.responsable_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Seleccione Responsable...</option>
                                {personal.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/pc-equipos')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar y Continuar')}
                        </button>
                    </div>
                </form>
            )}

            {/* Características Tab */}
            {activeTab === 'caracteristicas' && isEditMode && (
                <PcCaracteristicasTecnicasForm equipoId={id} />
            )}

            {/* Imagen Tab */}
            {activeTab === 'imagen' && isEditMode && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-center">Imagen del Equipo</h2>
                    <div className="flex flex-col items-center">
                        <div className="mb-6">
                            {/* Preview */}
                            {previewUrl ? (
                                <div className="mb-4 relative w-64 h-64 border rounded-lg overflow-hidden">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="mb-4 w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                                    Sin Imagen
                                </div>
                            )}

                            {/* Upload Input */}
                            <div className="w-full max-w-xs">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Imagen</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100"
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                disabled={!imageFile || loading}
                                className={`px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow ${(!imageFile || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                                    }`}
                            >
                                {loading ? 'Subiendo...' : 'Actualizar Imagen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
