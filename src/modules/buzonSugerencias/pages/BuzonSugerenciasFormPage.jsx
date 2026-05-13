import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InboxIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { buzonSugerenciasService } from '../services/buzonSugerenciasService';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

export default function BuzonSugerenciasFormPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        asunto: '',
        observaciones: '',
        prioridad: 'Baja'
    });
    const [files, setFiles] = useState([]);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const rawFiles = Array.from(e.target.files);
            
            const options = {
                maxSizeMB: 1, // Reducir a máximo 1MB
                maxWidthOrHeight: 1280,
                useWebWorker: true,
            };

            try {
                const compressedFiles = await Promise.all(
                    rawFiles.map(async (file) => {
                        if (file.type.startsWith('image/')) {
                            // Comprimir imagen y mantener el nombre original
                            const compressedFile = await imageCompression(file, options);
                            return new File([compressedFile], file.name, { type: compressedFile.type });
                        }
                        return file; // Si no es imagen, lo deja intacto
                    })
                );
                
                setFiles(prev => [...prev, ...compressedFiles]);
            } catch (error) {
                console.error("Error al comprimir imagen:", error);
                Swal.fire('Atención', 'Algunas imágenes no pudieron ser comprimidas, pero se intentarán subir de todas formas.', 'warning');
                setFiles(prev => [...prev, ...rawFiles]);
            }
        }
    };

    const removeFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('asunto', formData.asunto);
            data.append('observaciones', formData.observaciones);
            data.append('prioridad', formData.prioridad);

            if (files.length > 0) {
                files.forEach(file => {
                    data.append('archivos[]', file);
                });
            }

            const response = await buzonSugerenciasService.create(data);
            const ticket = response.objeto;

            await Swal.fire({
                title: 'Enviado',
                text: `Tu sugerencia fue registrada con el ticket ${ticket.codigo_ticket}`,
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            });
            navigate('/buzon');
        } catch (error) {
            Swal.fire('Error', 'No se pudo registrar la sugerencia.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-inner">
                        <InboxIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Nueva Sugerencia
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">
                            Completa los detalles para que podamos ayudarte.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                            Asunto
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.asunto}
                            onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm"
                            placeholder="Ej: Problema con el aire acondicionado"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Prioridad
                            </label>
                            <select
                                value={formData.prioridad}
                                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm"
                            >
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Adjuntar Evidencia (Opcional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex items-center gap-2 block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all shadow-sm">
                                    <PaperClipIcon className="w-5 h-5" />
                                    <span>Seleccionar imágenes...</span>
                                </div>
                            </div>
                            {files.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {files.map((file, idx) => (
                                        <li key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-sm border border-slate-100">
                                            <span className="truncate text-slate-600 max-w-[200px]">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                            Observaciones Detalladas
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.observaciones}
                            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm"
                            placeholder="Describe el problema o sugerencia..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate('/buzon')}
                            className="rounded-2xl bg-white px-6 py-3 text-sm font-black tracking-widest text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black tracking-widest text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            {saving ? 'GUARDANDO...' : 'ENVIAR SUGERENCIA'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
