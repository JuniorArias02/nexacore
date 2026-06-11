import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function PcEquipoImagenTab({
    previewUrl,
    handleImageChange,
    handleImageUpload,
    imageFile,
    loading
}) {
    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500"></div>

            <div className="p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                        <PhotoIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Imagen del Equipo</h2>
                        <p className="text-sm text-slate-500 font-medium">Sube una fotografía de referencia del dispositivo</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-full max-w-sm mb-8">
                        {/* Preview Area */}
                        {previewUrl ? (
                            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="text-white font-bold tracking-widest text-sm uppercase">Actualizar Imagen</span>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-square w-full rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                                <PhotoIcon className="h-16 w-16 mb-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                <span className="font-bold tracking-widest text-xs uppercase">Sin Imagen</span>
                            </div>
                        )}
                    </div>

                    {/* Upload Input */}
                    <div className="w-full max-w-sm">
                        <div className="relative group cursor-pointer mb-6">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-700 font-black tracking-widest text-xs uppercase group-hover:bg-indigo-100 transition-colors">
                                <ArrowUpTrayIcon className="h-5 w-5" />
                                {imageFile ? imageFile.name : 'Seleccionar Archivo...'}
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={!imageFile || loading}
                            className={`w-full px-8 py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all ${
                                (!imageFile || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                            }`}
                        >
                            {loading ? 'Subiendo...' : 'Guardar Imagen'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
