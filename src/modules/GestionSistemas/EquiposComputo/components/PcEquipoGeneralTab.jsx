import { ComputerDesktopIcon, ClipboardDocumentListIcon, ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function PcEquipoGeneralTab({
    formData,
    handleChange,
    sedes,
    areas,
    personalSearch,
    handlePersonalSearch,
    showPersonalResults,
    personalResults,
    selectPersonal,
    setPersonalSearch,
    setFormData,
    handleSubmit,
    loading,
    isEditMode,
    navigate
}) {
    const inputClass = "w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-100";
    const labelClass = "block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tarjeta 1: Información Principal */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative p-8 md:p-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                        <ComputerDesktopIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Identificación del Activo</h2>
                        <p className="text-sm text-slate-500 font-medium">Datos básicos de hardware y red</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="group">
                        <label className={labelClass}>Tipo de Equipo *</label>
                        <select name="tipo" value={formData.tipo} onChange={handleChange} className={inputClass} required>
                            <option value="">Seleccione...</option>
                            <option value="desktop">Desktop</option>
                            <option value="laptop">Laptop</option>
                            <option value="servidor">Servidor</option>
                            <option value="todo_en_uno">Todo en Uno</option>
                        </select>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Marca</label>
                        <input type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Ej. Dell, HP, Lenovo" className={inputClass} />
                    </div>
                    <div className="group">
                        <label className={labelClass}>Modelo</label>
                        <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Ej. OptiPlex 7090" className={inputClass} />
                    </div>
                    <div className="group">
                        <label className={labelClass}>Serial *</label>
                        <input type="text" name="serial" value={formData.serial} onChange={handleChange} placeholder="Número de serie único" className={`${inputClass} uppercase`} required />
                    </div>
                    <div className="group">
                        <label className={labelClass}>Activo Fijo</label>
                        <input type="text" name="numero_inventario" value={formData.numero_inventario} onChange={handleChange} placeholder="Código de inventario" className={inputClass} />
                    </div>
                    <div className="group">
                        <label className={labelClass}>Estado</label>
                        <select name="estado" value={formData.estado} onChange={handleChange} className={inputClass}>
                            <option value="operativo">Operativo</option>
                            <option value="en_reparacion">En Reparación</option>
                            <option value="baja">Baja</option>
                            <option value="asignado">Asignado</option>
                        </select>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Propiedad</label>
                        <select name="propiedad" value={formData.propiedad} onChange={handleChange} className={inputClass}>
                            <option value="empresa">Empresa</option>
                            <option value="empleado">Empleado</option>
                        </select>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Dirección IP Fija</label>
                        <input type="text" name="ip_fija" value={formData.ip_fija} onChange={handleChange} placeholder="Ej. 192.168.1.50" className={inputClass} />
                    </div>
                </div>
            </div>

            {/* Tarjeta 2: Detalles Administrativos */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative p-8 md:p-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-inner">
                        <ClipboardDocumentListIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Detalles Administrativos</h2>
                        <p className="text-sm text-slate-500 font-medium">Ubicación, fechas y adquisiciones</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="group">
                        <label className={labelClass}>Sede</label>
                        <select name="sede_id" value={formData.sede_id} onChange={handleChange} className={inputClass}>
                            <option value="">Seleccione Sede...</option>
                            {sedes.map(sede => (
                                <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Área</label>
                        <select name="area_id" value={formData.area_id} onChange={handleChange} className={inputClass}>
                            <option value="">Seleccione Área...</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>{area.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="group relative">
                        <label className={labelClass}>Responsable Asignado</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={personalSearch}
                                onChange={(e) => handlePersonalSearch(e.target.value)}
                                placeholder="Buscar empleado..."
                                className={inputClass}
                                autoComplete="off"
                            />
                            {personalSearch && (
                                <button type="button" onClick={() => { setPersonalSearch(''); setFormData(prev => ({...prev, responsable_id: ''})); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors">
                                    &times;
                                </button>
                            )}
                        </div>
                        {showPersonalResults && personalResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-50 animate-fade-in-up">
                                {personalResults.map(p => (
                                    <div key={p.id} onClick={() => selectPersonal(p)} className="px-5 py-3 hover:bg-sky-50 cursor-pointer transition-colors">
                                        <div className="text-sm font-bold text-slate-800">{p.nombre}</div>
                                        {p.cargo && <div className="text-xs font-medium text-slate-500 mt-0.5">{p.cargo.nombre}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="group">
                        <label className={labelClass}>Forma de Adquisición</label>
                        <select name="forma_adquisicion" value={formData.forma_adquisicion} onChange={handleChange} className={inputClass}>
                            <option value="compra">Compra</option>
                            <option value="alquiler">Alquiler</option>
                            <option value="donacion">Donación</option>
                            <option value="comodato">Comodato</option>
                        </select>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Fecha de Ingreso</label>
                        <input type="date" name="fecha_ingreso" value={formData.fecha_ingreso || ''} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="group">
                        <label className={labelClass}>Fecha de Entrega (Asignación)</label>
                        <input type="date" name="fecha_entrega" value={formData.fecha_entrega || ''} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="group">
                        <label className={labelClass}>Garantía (Meses)</label>
                        <input type="number" name="garantia_meses" value={formData.garantia_meses} onChange={handleChange} placeholder="Ej. 12" className={inputClass} />
                    </div>
                </div>
            </div>

            {/* Tarjeta 3: Observaciones y Anexos */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative p-8 md:p-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner">
                        <DocumentTextIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Notas y Observaciones</h2>
                        <p className="text-sm text-slate-500 font-medium">Información complementaria del equipo</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group md:col-span-2">
                        <label className={labelClass}>Descripción General</label>
                        <textarea name="descripcion_general" value={formData.descripcion_general} onChange={handleChange} rows="3" placeholder="Añade una descripción detallada del uso u objetivo de este equipo..." className={`${inputClass} resize-none`}></textarea>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Observaciones Técnicas</label>
                        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" placeholder="Daños estéticos, fallas menores, etc." className={`${inputClass} resize-none`}></textarea>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Repuestos Principales</label>
                        <textarea name="repuestos_principales" value={formData.repuestos_principales} onChange={handleChange} rows="3" placeholder="Piezas cambiadas recientemente o requeridas..." className={`${inputClass} resize-none`}></textarea>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Recomendaciones de Uso</label>
                        <textarea name="recomendaciones" value={formData.recomendaciones} onChange={handleChange} rows="3" placeholder="Precauciones, mantenimientos preventivos recomendados..." className={`${inputClass} resize-none`}></textarea>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Equipos o Accesorios Adicionales</label>
                        <textarea name="equipos_adicionales" value={formData.equipos_adicionales} onChange={handleChange} rows="3" placeholder="Bases refrigerantes, candados guaya, maletín..." className={`${inputClass} resize-none`}></textarea>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-5 rounded-3xl border border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3 shadow-sm mt-4">
                <button type="button" onClick={() => navigate('/gestion-sistemas/pc-equipos')} className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 text-xs font-black uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors">
                    Cancelar
                </button>
                <button type="submit" disabled={loading} className={`w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>
                    {loading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Guardar y Continuar')}
                </button>
            </div>
        </form>
    );
}
