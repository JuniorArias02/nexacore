import { useState, useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { inventoryService } from '../../services/inventoryService';

export default function FinancialInfoTab({ formData, handleChange, centrosCosto, setFormData }) {
    const [dependencias, setDependencias] = useState([]);
    const [loadingDeps, setLoadingDeps] = useState(false);

    useEffect(() => {
        if (formData.sede_id) {
            loadDependencias(formData.sede_id);
        } else {
            setDependencias([]);
        }
    }, [formData.sede_id]);

    const loadDependencias = async (sedeId) => {
        setLoadingDeps(true);
        try {
            const data = await inventoryService.getCpDependencias(sedeId);
            setDependencias(data || []);
        } catch (error) {
            console.error("Error loading dependencias:", error);
        } finally {
            setLoadingDeps(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                    <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" />
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Información Financiera</h3>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label htmlFor="fecha_compra" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Fecha de Compra</label>
                        <input type="date" name="fecha_compra" id="fecha_compra" value={formData.fecha_compra} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="valor_compra" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Valor Compra</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" name="valor_compra" id="valor_compra" value={formData.valor_compra} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 pl-8 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" placeholder="0.00" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="vida_util" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Vida Útil (Meses)</label>
                        <select
                            name="vida_util"
                            id="vida_util"
                            value={formData.vida_util}
                            onChange={handleChange}
                            className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="11">11 Meses</option>
                            <option value="60">60 Meses</option>
                            <option value="120">120 Meses</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="vida_util_niff" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Vida Útil NIIF (Meses)</label>
                        <select
                            name="vida_util_niff"
                            id="vida_util_niff"
                            value={formData.vida_util_niff}
                            onChange={handleChange}
                            className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="11">11 Meses</option>
                            <option value="60">60 Meses</option>
                            <option value="120">120 Meses</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Dependencia *</label>
                        <select
                            name="dependencia"
                            value={formData.dependencia}
                            onChange={handleChange}
                            disabled={!formData.sede_id || loadingDeps}
                            className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50 disabled:opacity-50"
                            required
                        >
                            <option value="">{loadingDeps ? 'Cargando...' : 'Seleccionar Dependencia...'}</option>
                            {dependencias.map(d => (
                                <option key={d.id} value={d.nombre}>{d.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Centro de Costo</label>
                        <select
                            name="centro_costo"
                            id="centro_costo"
                            value={formData.centro_costo}
                            onChange={handleChange}
                            className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50"
                        >
                            <option value="">Seleccionar...</option>
                            {centrosCosto.map(c => (
                                <option key={c.id} value={c.codigo}>{c.codigo} - {c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="ubicacion" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Ubicación Específica</label>
                        <input type="text" name="ubicacion" id="ubicacion" value={formData.ubicacion} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="tipo_bien" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Tipo de Bien</label>
                        <input type="text" name="tipo_bien" id="tipo_bien" value={formData.tipo_bien} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="escritura" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Escritura</label>
                        <input type="text" name="escritura" id="escritura" value={formData.escritura} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="matricula" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Matrícula</label>
                        <input type="text" name="matricula" id="matricula" value={formData.matricula} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="salvamenta" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Valor Salvamento</label>
                        <input type="number" name="salvamenta" id="salvamenta" value={formData.salvamenta} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="depreciacion" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Depreciación</label>
                        <input type="number" name="depreciacion" id="depreciacion" value={formData.depreciacion} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="depreciacion_niif" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Depreciación NIIF</label>
                        <input type="number" name="depreciacion_niif" id="depreciacion_niif" value={formData.depreciacion_niif} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="meses" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Meses Depreciación</label>
                        <input type="number" name="meses" id="meses" value={formData.meses} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="meses_niif" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Meses Dep NIIF</label>
                        <input type="number" name="meses_niif" id="meses_niif" value={formData.meses_niif} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="tipo_adquisicion" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Tipo de Adquisición</label>
                        <select name="tipo_adquisicion" id="tipo_adquisicion" value={formData.tipo_adquisicion} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50">
                            <option value="03">03 - Compra</option>
                            <option value="01">01 - Donación</option>
                            <option value="02">02 - Comodato</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="calibrado" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Fecha de Calibrado</label>
                        <input type="date" name="calibrado" id="calibrado" value={formData.calibrado} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>
                </div>
            </div>
        </div>
    );
}
