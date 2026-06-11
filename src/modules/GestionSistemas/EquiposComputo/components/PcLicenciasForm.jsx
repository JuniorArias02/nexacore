import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import pcLicenciasSoftwareService from '../services/pcLicenciasSoftwareService';
import { KeyIcon, CodeBracketSquareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function PcLicenciasForm({ equipoId }) {
    const [formData, setFormData] = useState({
        windows: '',
        office: '',
        nitro: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (equipoId) {
            loadData();
        }
    }, [equipoId]);

    const loadData = async () => {
        try {
            setInitialLoading(true);
            const response = await pcLicenciasSoftwareService.getByEquipoId(equipoId);
            if (response && response.objeto) {
                setFormData({
                    windows: response.objeto.windows || '',
                    office: response.objeto.office || '',
                    nitro: response.objeto.nitro || ''
                });
            }
        } catch (error) {
            console.log('No tech specs found or error', error);
        } finally {
            setInitialLoading(false);
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
        setLoading(true);
        try {
            await pcLicenciasSoftwareService.saveByEquipoId({
                equipo_id: equipoId,
                ...formData
            });
            Swal.fire('Éxito', 'Licencias de software guardadas correctamente', 'success');
        } catch (error) {
            console.error('Error saving licenses:', error);
            Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                <p className="text-slate-500 font-medium text-sm animate-pulse">Cargando licencias...</p>
            </div>
        );
    }

    const inputClass = "w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-100";
    const labelClass = "block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1";

    return (
        <form onSubmit={handleSubmit} className="relative bg-white rounded-3xl overflow-hidden">
            <div className="p-4 md:p-8 space-y-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                            <KeyIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Licencias de Software</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Windows */}
                        <div className="group bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <CodeBracketSquareIcon className="h-6 w-6 text-blue-500" />
                                <h4 className="font-bold text-slate-700">SO Windows</h4>
                            </div>
                            <label className={labelClass}>Estado de Licencia</label>
                            <select name="windows" value={formData.windows} onChange={handleChange} className={inputClass}>
                                <option value="">Seleccione...</option>
                                <option value="Original">Original (Licenciado)</option>
                                <option value="OEM">OEM (De fábrica)</option>
                                <option value="Crack">No Original (Crack)</option>
                                <option value="Libre">Libre (Linux/Otro)</option>
                                <option value="No Aplica">No Aplica</option>
                            </select>
                        </div>

                        {/* Office */}
                        <div className="group bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <DocumentTextIcon className="h-6 w-6 text-orange-500" />
                                <h4 className="font-bold text-slate-700">Suite Office</h4>
                            </div>
                            <label className={labelClass}>Estado de Licencia</label>
                            <select name="office" value={formData.office} onChange={handleChange} className={inputClass}>
                                <option value="">Seleccione...</option>
                                <option value="Original">Original (Licenciado)</option>
                                <option value="365">Suscripción (O365)</option>
                                <option value="Crack">No Original (Crack)</option>
                                <option value="Libre">Libre (LibreOffice)</option>
                                <option value="No Aplica">No Aplica</option>
                            </select>
                        </div>

                        {/* Nitro PDF */}
                        <div className="group bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <DocumentTextIcon className="h-6 w-6 text-red-500" />
                                <h4 className="font-bold text-slate-700">Lector PDF (Nitro)</h4>
                            </div>
                            <label className={labelClass}>Estado de Licencia</label>
                            <select name="nitro" value={formData.nitro} onChange={handleChange} className={inputClass}>
                                <option value="">Seleccione...</option>
                                <option value="Original">Original</option>
                                <option value="Crack">No Original (Crack)</option>
                                <option value="Gratuito">Versión Gratuita</option>
                                <option value="No Aplica">No Aplica</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Formulario */}
            <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                    }`}
                >
                    {loading ? 'Guardando...' : 'Guardar Licencias'}
                </button>
            </div>
        </form>
    );
}
