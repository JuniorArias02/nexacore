import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import PermisoFormulario from './PermisoFormulario';

export default function CatalogoPermisos({
    newPermiso, setNewPermiso, handleCreatePermiso,
    searchTerm, setSearchTerm, groupedPermissions,
    handleEditPermiso, handleDeletePermiso
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            <div className="lg:col-span-1">
                <PermisoFormulario 
                    newPermiso={newPermiso} 
                    setNewPermiso={setNewPermiso} 
                    handleCreatePermiso={handleCreatePermiso} 
                />
            </div>
            
            <div className="lg:col-span-2 space-y-5">
                <div className="relative group">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar permisos por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-3xl border-0 bg-white/80 backdrop-blur-md py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all hover:shadow-md"
                    />
                </div>

                <div className="bg-white/80 backdrop-blur-md shadow-xl ring-1 ring-slate-900/5 rounded-[2rem] overflow-hidden">
                    {Object.keys(groupedPermissions).length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <ServerStackIcon className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No se encontraron permisos</h3>
                            <p className="mt-2 text-sm text-slate-500 font-medium">No hay resultados para tu búsqueda o el catálogo está vacío.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100/50">
                            {Object.entries(groupedPermissions).map(([group, groupPermisos]) => (
                                <div key={group} className="bg-white/50">
                                    <div className="bg-slate-50/50 px-6 py-4 border-l-4 border-indigo-500">
                                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{group}</h3>
                                    </div>
                                    <ul className="divide-y divide-slate-50">
                                        {groupPermisos.map((permiso) => (
                                            <li key={permiso.id} className="flex items-center justify-between gap-x-6 px-6 py-5 hover:bg-indigo-50/30 transition-colors group/item">
                                                <div className="min-w-0">
                                                    <div className="flex items-start gap-x-3">
                                                        <p className="text-sm font-bold leading-6 text-slate-900">{permiso.nombre}</p>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-slate-500 font-medium">
                                                        <p>{permiso.descripcion || 'Sin descripción'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-none items-center gap-x-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditPermiso(permiso)}
                                                        className="rounded-xl p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-110"
                                                        title="Editar Permiso"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePermiso(permiso.id)}
                                                        className="rounded-xl p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all hover:scale-110"
                                                        title="Eliminar Permiso"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
