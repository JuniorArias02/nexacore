import { UserGroupIcon, MagnifyingGlassIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AsignacionRoles({
    roles,
    selectedRoleId,
    setSelectedRoleId,
    activeRole,
    searchTerm,
    setSearchTerm,
    groupedPermissions,
    localPermissions,
    toggleLocalPermission,
    toggleGroupPermissions,
    isDirty,
    saving,
    saveRolePermissions
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fade-in-up">
            {/* Role Selector (Left Sidebar) */}
            <div className="md:col-span-4 lg:col-span-3 space-y-4">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">Selecciona un Rol</h2>
                <div className="space-y-3">
                    {roles.map(rol => (
                        <div
                            key={rol.id}
                            onClick={() => setSelectedRoleId(rol.id)}
                            className={`group relative flex items-center justify-between p-4 cursor-pointer rounded-[1.5rem] transition-all duration-300 border ${
                                selectedRoleId === rol.id
                                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 border-transparent scale-105'
                                    : 'bg-white text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 border-slate-100 shadow-sm'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-2xl transition-colors ${selectedRoleId === rol.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white text-slate-500'}`}>
                                    <UserGroupIcon className={`h-5 w-5 ${selectedRoleId === rol.id ? 'text-white' : ''}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold">{rol.nombre}</h3>
                                    <p className={`text-xs font-medium mt-0.5 ${selectedRoleId === rol.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                                        {rol.permisos?.length || 0} activos
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permissions Matrix */}
            <div className="md:col-span-8 lg:col-span-9 relative">
                {selectedRoleId ? (
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        Permisos para <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{activeRole?.nombre}</span>
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500 mt-1">Configura los accesos activando o desactivando permisos individuales o por grupo.</p>
                                </div>
                                <div className="w-full sm:w-64">
                                    <div className="relative group">
                                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Filtrar permisos..."
                                            className="block w-full rounded-2xl border-slate-100 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {Object.entries(groupedPermissions).map(([group, groupPermisos]) => {
                                    // Check if all are selected
                                    const allSelected = groupPermisos.every(p => localPermissions.has(p.id));
                                    
                                    return (
                                        <div key={group} className="animate-fade-in-up">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    {group}
                                                </h3>
                                                <button
                                                    onClick={() => toggleGroupPermissions(groupPermisos, !allSelected)}
                                                    className={`text-[10px] font-black tracking-widest px-4 py-2 rounded-full transition-all uppercase ${
                                                        allSelected 
                                                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {allSelected ? 'Desmarcar Todos' : 'Seleccionar Todos'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {groupPermisos.map(permiso => {
                                                    const isSelected = localPermissions.has(permiso.id);
                                                    return (
                                                        <div
                                                            key={permiso.id}
                                                            onClick={() => toggleLocalPermission(permiso.id)}
                                                            className={`
                                                                group/item relative flex items-start p-4 rounded-2xl cursor-pointer transition-all duration-300
                                                                ${isSelected
                                                                    ? 'bg-indigo-50/80 border-transparent shadow-[0_4px_20px_-4px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20 transform scale-[1.02]'
                                                                    : 'bg-white border-slate-100 border hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50'
                                                                }
                                                            `}
                                                        >
                                                            {/* Custom Checkbox/Toggle Switch look */}
                                                            <div className={`
                                                                flex-shrink-0 mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center mr-3.5 transition-all duration-300
                                                                ${isSelected ? 'bg-indigo-600 border-indigo-600 scale-110' : 'bg-transparent border-slate-300 group-hover/item:border-indigo-400'}
                                                            `}>
                                                                {isSelected && <CheckCircleIcon className="h-4 w-4 text-white" />}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <span className={`block text-sm font-bold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-700 group-hover/item:text-slate-900'}`}>
                                                                    {permiso.nombre}
                                                                </span>
                                                                <span className="block text-xs font-medium text-slate-500 mt-1 line-clamp-2">
                                                                    {permiso.descripcion}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm">
                        <div className="p-6 bg-slate-50 rounded-full mb-6">
                            <UserGroupIcon className="h-16 w-16 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Ningún rol seleccionado</h3>
                        <p className="text-slate-500 max-w-sm mt-3 font-medium text-sm">Selecciona un rol de la lista de la izquierda para comenzar a gestionar sus accesos de manera intuitiva.</p>
                    </div>
                )}
            </div>

            {/* Floating Save Button */}
            <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${isDirty ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90 pointer-events-none'}`}>
                <button
                    onClick={saveRolePermissions}
                    disabled={saving}
                    className="flex items-center gap-2.5 bg-slate-900 text-white px-8 py-4 rounded-full shadow-[0_20px_60px_-10px_rgba(15,23,42,0.4)] hover:bg-indigo-600 hover:shadow-[0_20px_60px_-10px_rgba(79,70,229,0.4)] focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 disabled:hover:bg-slate-900 font-black tracking-widest text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    {saving ? (
                        <>
                            <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            GUARDANDO...
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon className="h-5 w-5" />
                            GUARDAR CAMBIOS
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
