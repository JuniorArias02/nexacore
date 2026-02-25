import { useState, useEffect } from 'react';
import { TagIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import ProductSearch from '../search/ProductSearch';
import PersonalSearch from '../search/PersonalSearch';
import SedeSelect from '../search/SedeSelect';
import { inventoryService } from '../../services/inventoryService';

export default function BasicInfoTab({ formData, handleChange, handleSelectChange, setFormData }) {
    const [procesos, setProcesos] = useState([]);
    const [loadingProcesos, setLoadingProcesos] = useState(false);

    useEffect(() => {
        if (formData.sede_id) {
            loadProcesos(formData.sede_id);
        } else {
            setProcesos([]);
        }
    }, [formData.sede_id]);

    const loadProcesos = async (sedeId) => {
        setLoadingProcesos(true);
        try {
            const data = await inventoryService.getProcesos(sedeId);
            setProcesos(data || []);
        } catch (error) {
            console.error("Error loading procesos:", error);
        } finally {
            setLoadingProcesos(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Activo e Identificación */}
            <div>
                <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                    <TagIcon className="h-6 w-6 text-indigo-500" />
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Identificación del Activo</h3>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-full sm:col-span-2">
                        <ProductSearch
                            label="Nombre del Activo *"
                            value={formData.nombre}
                            initialOption={formData.nombre ? { nombre: formData.nombre } : null}
                            onChange={(option) => {
                                setFormData(prev => ({
                                    ...prev,
                                    nombre: option.nombre
                                }));
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="codigo" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                            Serial de Inventario (Código) *
                        </label>
                        <input
                            type="text"
                            name="codigo"
                            id="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-slate-50/50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="marca" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Marca</label>
                        <input type="text" name="marca" id="marca" value={formData.marca} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="modelo" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Modelo</label>
                        <input type="text" name="modelo" id="modelo" value={formData.modelo} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="serial" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Serial</label>
                        <input type="text" name="serial" id="serial" value={formData.serial} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="proveedor" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Proveedor</label>
                        <input type="text" name="proveedor" id="proveedor" value={formData.proveedor} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="num_factu" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Número Factura</label>
                        <input type="text" name="num_factu" id="num_factu" value={formData.num_factu} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>

                    <div>
                        <label htmlFor="grupo" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Grupo</label>
                        <select name="grupo" value={formData.grupo} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50">
                            <option value="">Seleccionar...</option>
                            <option value="EC">EC</option>
                            <option value="ME">ME</option>
                            <option value="MAQ">MAQ</option>
                            <option value="IMC">IMC</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="estado" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Estado</label>
                        <select name="estado" value={formData.estado} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50">
                            <option value="Nuevo">Nuevo</option>
                            <option value="Buen Estado">Buen Estado</option>
                            <option value="Regular">Regular</option>
                            <option value="Malo">Malo</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tiene_accesorio" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">¿Tiene Accesorio?</label>
                        <select name="tiene_accesorio" value={formData.tiene_accesorio} onChange={handleChange} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50">
                            <option value="No">No</option>
                            <option value="Si">Si</option>
                        </select>
                    </div>

                    {formData.tiene_accesorio === 'Si' && (
                        <div className="col-span-full">
                            <label htmlFor="descripcion_accesorio" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Descripción Accesorio</label>
                            <textarea name="descripcion_accesorio" id="descripcion_accesorio" value={formData.descripcion_accesorio} onChange={handleChange} rows={2} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                        </div>
                    )}
                </div>
            </div>

            {/* Asignación y Ubicación */}
            <div>
                <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                    <BuildingOfficeIcon className="h-6 w-6 text-indigo-500" />
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Ubicación y Responsables</h3>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="sm:col-span-1">
                        <PersonalSearch
                            label="Responsable *"
                            value={formData.responsable_id}
                            initialOption={formData.responsable_personal ? { id: formData.responsable_personal.id, nombre: formData.responsable_personal.nombre } : (formData.responsable_id ? { id: formData.responsable_id, nombre: formData.responsable } : null)}
                            onChange={(opt) => setFormData(prev => ({ ...prev, responsable_id: opt.id, responsable: opt.nombre }))}
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <PersonalSearch
                            label="Coordinador"
                            placeholder="Buscar coordinador..."
                            value={formData.coordinador_id}
                            initialOption={formData.coordinador_personal ? { id: formData.coordinador_personal.id, nombre: formData.coordinador_personal.nombre } : (formData.coordinador_id ? { id: formData.coordinador_id, nombre: formData.coordinador_nombre } : null)}
                            onChange={(opt) => setFormData(prev => ({ ...prev, coordinador_id: opt.id, coordinador_nombre: opt.nombre }))}
                        />
                    </div>

                    <div>
                        <SedeSelect
                            value={formData.sede_id}
                            onChange={(e) => {
                                handleChange(e);
                                // Reset process when sede changes
                                setFormData(prev => ({ ...prev, proceso_id: '', dependencia: '' }));
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Proceso Solicitante *</label>
                        <select
                            name="proceso_id"
                            value={formData.proceso_id}
                            onChange={handleChange}
                            disabled={!formData.sede_id || loadingProcesos}
                            className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50 disabled:opacity-50"
                            required
                        >
                            <option value="">{loadingProcesos ? 'Cargando...' : 'Seleccionar Proceso...'}</option>
                            {procesos.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="observaciones" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Observación</label>
                        <textarea name="observaciones" id="observaciones" value={formData.observaciones} onChange={handleChange} rows={3} className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50/50" />
                    </div>
                </div>
            </div>
        </div>
    );
}
