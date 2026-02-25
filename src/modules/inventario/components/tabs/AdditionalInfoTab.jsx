import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AdditionalInfoTab({ formData, handleChange, filePreview }) {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                    <DocumentArrowUpIcon className="h-6 w-6 text-indigo-500" />
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Información Adicional</h3>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <div className="col-span-full">
                        <label htmlFor="soporte" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Soporte Documentación (Texto/Link)</label>
                        <input type="text" name="soporte" id="soporte" value={formData.soporte} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" placeholder="Ref. soporte físico o enlace" />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Adjuntar Soporte (PDF)</label>
                        <div className="mt-2 flex justify-center rounded-[2rem] border-2 border-dashed border-slate-200 px-6 py-10 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group">
                            <div className="text-center">
                                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-400 group-hover:scale-110 transition-all" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-xl bg-white font-black text-[10px] uppercase tracking-widest text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 px-4 py-2 shadow-sm border border-indigo-50"
                                    >
                                        <span>Seleccionar Archivo</span>
                                        <input id="file-upload" name="soporte_adjunto" type="file" className="sr-only" accept="application/pdf" onChange={handleChange} />
                                    </label>
                                    <p className="pl-3 self-center text-[10px] font-bold uppercase tracking-widest text-slate-400">o arrastrar y soltar</p>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">PDF hasta 10MB</p>
                                {filePreview && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white py-2 px-4 rounded-xl shadow-sm border border-indigo-50 animate-bounce-short">
                                        <CheckCircleIcon className="h-4 w-4" />
                                        <span>{filePreview.name} ({filePreview.size})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
