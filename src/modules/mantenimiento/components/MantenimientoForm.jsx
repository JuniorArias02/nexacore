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
        coordinador_id: '',
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
            const [sedesRes, areasRes, coordinadoresRes] = await Promise.all([
                api.get('/sedes'),
                api.get('/areas'),
                mantenimientoService.getUsuariosPorPermiso('mantenimiento.seleccion_coordinador'),
            ]);
            setSedes(sedesRes.data?.objeto ?? []);
            setAllAreas(areasRes.data?.objeto ?? []);
            setReceptores(coordinadoresRes?.objeto ?? []);
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
                coordinador_id: data.coordinador_id || '',
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
        <div className="max-w-4xl mx-auto p-4 md:p-10 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-500">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 px-8 py-10 md:px-12 md:py-14 text-white">
                    <div className="relative z-10">
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-4 backdrop-blur-md">
                            Mantenimiento
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                            {isEditing ? 'Editar Registro' : 'Nuevo Mantenimiento'}
                        </h2>
                        <p className="text-indigo-100 text-sm md:text-base font-medium opacity-90 max-w-xl">
                            {isEditing 
                                ? 'Actualiza los detalles técnicos y el estado del equipo para mantener la trazabilidad.' 
                                : 'Ingresa la información detallada para programar y registrar un nuevo servicio técnico.'}
                        </p>
                    </div>
                    
                    {/* Decorative Background Icon */}
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
                        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6.3 6.3 9 1.7 4.4C.6 6.8 1 9.8 3 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.4-.4.4-1.1 0-1.5z" />
                        </svg>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-8 bg-white">
                    {/* Section: General Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Información General</span>
                        </div>
                        
                        {/* Titulo */}
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-indigo-600 transition-colors">Título del Mantenimiento *</label>
                            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange}
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                placeholder="Ej: Mantenimiento preventivo impresora contabilidad" required />
                        </div>

                        {/* Codigo + Modelo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-indigo-600 transition-colors">Código de Activo</label>
                                <input type="text" name="codigo" value={formData.codigo} onChange={handleChange}
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                    placeholder="Ej: MNT-001" />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-indigo-600 transition-colors">Modelo del Equipo</label>
                                <input type="text" name="modelo" value={formData.modelo} onChange={handleChange}
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                    placeholder="Ej: HP LaserJet Pro M404dn" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Location */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Ubicación y Asignación</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-indigo-600 transition-colors">Sede</label>
                                <select name="sede_id" value={formData.sede_id} onChange={handleChange}
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium appearance-none">
                                    <option value="">Seleccione una sede</option>
                                    {sedes.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-indigo-600 transition-colors">Dependencia / Área</label>
                                <select name="dependencia" value={formData.dependencia} onChange={handleChange}
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium appearance-none"
                                    disabled={!formData.sede_id}>
                                    <option value="">{formData.sede_id ? 'Seleccione un área' : 'Seleccione primero la sede'}</option>
                                    {areas.map((a) => (
                                        <option key={a.id} value={a.nombre}>{a.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Coordinador */}
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-indigo-600 transition-colors">Coordinador Autorizado</label>
                            <select name="coordinador_id" value={formData.coordinador_id} onChange={handleChange}
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium appearance-none">
                                <option value="">Seleccione el validador</option>
                                {receptores.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.nombre_completo || u.usuario}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-2 text-[10px] font-medium text-slate-400 italic">Solo personal con permisos de auditoría y gestión técnica.</p>
                        </div>
                    </div>

                    {/* Descripcion */}
                    <div className="group">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-indigo-600 transition-colors">Descripción del Servicio</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4}
                            className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                            placeholder="Detalle el estado actual y los requerimientos del mantenimiento..." />
                    </div>

                    {/* Images Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Evidencia Fotográfica</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image 1 */}
                            <div className="relative group">
                                <input type="file" accept="image/*"
                                    onChange={(e) => handleImageChange(e, setImagen1, setPreview1)}
                                    className="hidden" id="imagen1-input" />
                                <label htmlFor="imagen1-input" className="cursor-pointer block border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300">
                                    {preview1 ? (
                                        <div className="relative group/preview">
                                            <img src={preview1} alt="Preview 1" className="mx-auto h-48 w-full object-cover rounded-2xl shadow-md" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                <span className="text-white text-xs font-black uppercase tracking-widest">Cambiar Foto</span>
                                            </div>
                                        </div>
                                    ) : existingImages[0] ? (
                                        <div className="relative group/preview">
                                            <img src={`${API_URL}/${existingImages[0]}`} alt="Imagen actual 1" className="mx-auto h-48 w-full object-cover rounded-2xl shadow-md" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                <span className="text-white text-xs font-black uppercase tracking-widest">Cambiar Foto</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-6 flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cargar Foto Principal</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Image 2 */}
                            <div className="relative group">
                                <input type="file" accept="image/*"
                                    onChange={(e) => handleImageChange(e, setImagen2, setPreview2)}
                                    className="hidden" id="imagen2-input" />
                                <label htmlFor="imagen2-input" className="cursor-pointer block border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300">
                                    {preview2 ? (
                                        <div className="relative group/preview">
                                            <img src={preview2} alt="Preview 2" className="mx-auto h-48 w-full object-cover rounded-2xl shadow-md" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                <span className="text-white text-xs font-black uppercase tracking-widest">Cambiar Foto</span>
                                            </div>
                                        </div>
                                    ) : existingImages[1] ? (
                                        <div className="relative group/preview">
                                            <img src={`${API_URL}/${existingImages[1]}`} alt="Imagen actual 2" className="mx-auto h-48 w-full object-cover rounded-2xl shadow-md" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                <span className="text-white text-xs font-black uppercase tracking-widest">Cambiar Foto</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-6 flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cargar Foto Secundaria</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {compressing && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-2xl text-indigo-700 animate-pulse">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                <span className="text-sm font-bold uppercase tracking-widest">Optimizando Archivo...</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-8 border-t border-slate-100">
                        <button type="button" onClick={() => navigate('/mantenimientos')}
                            className="w-full md:w-auto px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-all">
                            Cancelar Operación
                        </button>
                        <button type="submit" disabled={loading || compressing}
                            className="w-full md:w-auto px-10 py-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0">
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Guardando...
                                </div>
                            ) : isEditing ? 'Confirmar Actualización' : 'Registrar Mantenimiento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
