import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { PhotoIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { imagenMensualService } from '../services/imagenMensualService';

export default function ImagenMensualPage() {
    const [imageBlob, setImageBlob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadImage();
    }, []);

    useEffect(() => {
        return () => {
            if (imageBlob) {
                URL.revokeObjectURL(imageBlob);
            }
        };
    }, [imageBlob]);

    const loadImage = async () => {
        try {
            setLoading(true);
            const blob = await imagenMensualService.obtenerImagenBlob();
            if (blob.size > 0 && blob.type.includes('image')) {
                setImageBlob(URL.createObjectURL(blob));
            } else {
                setImageBlob(null);
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error("Error cargando imagen:", error);
            }
            setImageBlob(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'image/png') {
            Swal.fire('Formato Inválido', 'Solo se aceptan archivos PNG.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Archivo muy grande', 'El archivo no puede pesar más de 5MB.', 'error');
            return;
        }

        try {
            setUploading(true);
            await imagenMensualService.subirImagen(file);
            Swal.fire('Éxito', 'Imagen subida correctamente.', 'success');
            loadImage();
        } catch (error) {
            console.error("Error subiendo:", error);
            Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará la imagen actual y no se podrá recuperar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await imagenMensualService.eliminarImagen();
                Swal.fire('Eliminado', 'La imagen ha sido eliminada.', 'success');
                setImageBlob(null);
            } catch (error) {
                console.error("Error eliminando:", error);
                Swal.fire('Error', 'No se pudo eliminar la imagen.', 'error');
            }
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up font-sans">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        CONFIGURACIÓN
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Imagen Mensual
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Gestiona la imagen principal que se muestra en el sistema. Solo se permite una imagen en formato PNG (máx. 5MB).
                    </p>
                </div>
                <PhotoIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            <div className="bg-white shadow-2xl rounded-[2.5rem] p-8 ring-1 ring-slate-900/5 transition-all">
                <div className="flex flex-col items-center justify-center space-y-8">
                    
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-slate-500 font-bold">Cargando imagen...</p>
                        </div>
                    ) : imageBlob ? (
                        <div className="relative group/item rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 w-full max-w-lg mx-auto bg-slate-50 flex items-center justify-center p-4">
                            <img 
                                src={imageBlob} 
                                alt="Imagen Mensual" 
                                className="max-w-full max-h-[400px] object-contain transition-transform duration-500 group-hover/item:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                                <button 
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-600/90 hover:bg-red-500 text-white px-6 py-3 rounded-2xl font-black tracking-widest shadow-lg shadow-red-500/30 backdrop-blur-md transition-all hover:-translate-y-1"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                    ELIMINAR IMAGEN
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl w-full max-w-lg mx-auto border-2 border-dashed border-slate-200">
                            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                                <PhotoIcon className="h-12 w-12 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold text-lg mb-2">No hay imagen cargada</p>
                            <p className="text-slate-400 text-sm mb-6">Sube una imagen PNG para mostrarla en el sistema</p>
                        </div>
                    )}

                    <div className="w-full max-w-md mt-8">
                        <label className={`
                            relative flex items-center justify-center gap-3 w-full p-4 rounded-2xl font-black tracking-widest cursor-pointer transition-all duration-300 shadow-xl
                            ${uploading 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/30 hover:scale-[1.02]'}
                        `}>
                            {uploading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
                            ) : (
                                <ArrowUpTrayIcon className="h-6 w-6" />
                            )}
                            {uploading ? 'SUBIENDO...' : (imageBlob ? 'REEMPLAZAR IMAGEN' : 'SUBIR IMAGEN')}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".png" 
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </label>
                        <p className="text-center text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
                            FORMATO PNG • MÁX. 5MB
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
