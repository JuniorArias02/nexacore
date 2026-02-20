import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';
import api from '../../../services/api';
import { mantenimientoService } from '../services/mantenimientoService';

export default function MantenimientoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        titulo: '',
        codigo: '',
        modelo: '',
        dependencia: '',
        sede_id: '',
        nombre_receptor: '',
        descripcion: '',
    });

    const [sedes, setSedes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [allAreas, setAllAreas] = useState([]);
    const [receptores, setReceptores] = useState([]);
    const [imagen1, setImagen1] = useState(null);
    const [imagen2, setImagen2] = useState(null);
    const [preview1, setPreview1] = useState(null);
    const [preview2, setPreview2] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [compressing, setCompressing] = useState(false);

    useEffect(() => {
        loadSelectData();
        if (isEditing) loadMantenimiento();
    }, [id]);

    // When sede changes, filter areas
    useEffect(() => {
        if (formData.sede_id) {
            const filtered = allAreas.filter(
                (a) => String(a.sede_id) === String(formData.sede_id)
            );
            setAreas(filtered);
        } else {
            setAreas([]);
        }
    }, [formData.sede_id, allAreas]);

    const loadSelectData = async () => {
        try {
            const [sedesRes, areasRes, receptoresRes] = await Promise.all([
                api.get('/sedes'),
                api.get('/areas'),
                mantenimientoService.getUsuariosPorPermiso('mantenimiento.receptor'),
            ]);
            setSedes(sedesRes.data?.objeto ?? []);
            setAllAreas(areasRes.data?.objeto ?? []);
            setReceptores(receptoresRes?.objeto ?? []);
        } catch (error) {
            console.error('Error loading select data:', error);
        }
    };

    const loadMantenimiento = async () => {
        try {
            const data = await mantenimientoService.getById(id);
            setFormData({
                titulo: data.titulo || '',
                codigo: data.codigo || '',
                modelo: data.modelo || '',
                dependencia: data.dependencia || '',
                sede_id: data.sede_id || '',
                nombre_receptor: data.nombre_receptor || '',
                descripcion: data.descripcion || '',
            });
            // Parse existing images
            if (data.imagen) {
                setExistingImages(data.imagen.split(',').filter(Boolean));
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar el mantenimiento', 'error');
            navigate('/mantenimientos');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
        };
        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error('Error compressing image:', error);
            return file;
        }
    };

    const handleImageChange = async (e, setImage, setPreview) => {
        const file = e.target.files[0];
        if (!file) return;

        setCompressing(true);
        try {
            const compressed = await compressImage(file);
            setImage(compressed);
            setPreview(URL.createObjectURL(compressed));
        } catch {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.titulo.trim()) {
            Swal.fire('Error', 'El título es requerido', 'error');
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    fd.append(key, value);
                }
            });

            if (imagen1) fd.append('imagen', imagen1, imagen1.name || 'imagen1.jpg');
            if (imagen2) fd.append('imagen2', imagen2, imagen2.name || 'imagen2.jpg');

            if (isEditing) {
                await mantenimientoService.update(id, fd);
                Swal.fire('Éxito', 'Mantenimiento actualizado correctamente', 'success');
            } else {
                await mantenimientoService.create(fd);
                Swal.fire('Éxito', 'Mantenimiento creado correctamente', 'success');
            }
            navigate('/mantenimientos');
        } catch (error) {
            const msg = error.response?.data?.mensaje || 'Error al guardar el mantenimiento';
            Swal.fire('Error', msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white">
                        {isEditing ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
                    </h2>
                    <p className="text-blue-100 mt-1">
                        {isEditing ? 'Actualiza la información del mantenimiento' : 'Completa los datos para registrar un nuevo mantenimiento'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Titulo */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
                        <input type="text" name="titulo" value={formData.titulo} onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Ej: Mantenimiento preventivo impresora" required />
                    </div>

                    {/* Codigo + Modelo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Código</label>
                            <input type="text" name="codigo" value={formData.codigo} onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Ej: MNT-001" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Ej: HP LaserJet Pro" />
                        </div>
                    </div>

                    {/* Sede + Dependencia (cascade) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sede</label>
                            <select name="sede_id" value={formData.sede_id} onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                <option value="">Seleccione una sede</option>
                                {sedes.map((s) => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Dependencia</label>
                            <select name="dependencia" value={formData.dependencia} onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                disabled={!formData.sede_id}>
                                <option value="">{formData.sede_id ? 'Seleccione una dependencia' : 'Primero seleccione una sede'}</option>
                                {areas.map((a) => (
                                    <option key={a.id} value={a.nombre}>{a.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Receptor */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Receptor (Funcionario)</label>
                        <select name="nombre_receptor" value={formData.nombre_receptor} onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                            <option value="">Seleccione un receptor</option>
                            {receptores.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.nombre_completo || u.usuario}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Solo aparecen usuarios con permiso "mantenimiento.receptor"</p>
                    </div>

                    {/* Descripcion */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Describa el mantenimiento a realizar..." />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Fotografías del equipo</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Image 1 */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                                <input type="file" accept="image/*"
                                    onChange={(e) => handleImageChange(e, setImagen1, setPreview1)}
                                    className="hidden" id="imagen1-input" />
                                <label htmlFor="imagen1-input" className="cursor-pointer block">
                                    {preview1 ? (
                                        <img src={preview1} alt="Preview 1" className="mx-auto h-40 object-cover rounded-lg" />
                                    ) : existingImages[0] ? (
                                        <img src={`${API_URL}/${existingImages[0]}`} alt="Imagen actual 1" className="mx-auto h-40 object-cover rounded-lg" />
                                    ) : (
                                        <div className="py-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-gray-400 mb-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-500">Foto 1 — Click para seleccionar</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Image 2 */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                                <input type="file" accept="image/*"
                                    onChange={(e) => handleImageChange(e, setImagen2, setPreview2)}
                                    className="hidden" id="imagen2-input" />
                                <label htmlFor="imagen2-input" className="cursor-pointer block">
                                    {preview2 ? (
                                        <img src={preview2} alt="Preview 2" className="mx-auto h-40 object-cover rounded-lg" />
                                    ) : existingImages[1] ? (
                                        <img src={`${API_URL}/${existingImages[1]}`} alt="Imagen actual 2" className="mx-auto h-40 object-cover rounded-lg" />
                                    ) : (
                                        <div className="py-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-gray-400 mb-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-500">Foto 2 — Click para seleccionar</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                        {compressing && (
                            <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Comprimiendo imagen...
                            </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">Las imágenes se comprimen automáticamente para optimizar el almacenamiento.</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => navigate('/mantenimientos')}
                            className="px-6 py-3 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading || compressing}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 transition shadow-lg">
                            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Mantenimiento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
