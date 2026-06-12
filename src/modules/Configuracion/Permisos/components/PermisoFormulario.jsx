import { PlusIcon } from '@heroicons/react/24/outline';

export default function PermisoFormulario({ newPermiso, setNewPermiso, handleCreatePermiso }) {
    return (
        <div className="bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-slate-900/5 rounded-3xl p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                    <PlusIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Nuevo Permiso</h3>
            </div>
            <form onSubmit={handleCreatePermiso} className="space-y-5">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Slug del Permiso</label>
                    <input
                        type="text"
                        required
                        value={newPermiso.nombre}
                        onChange={(e) => setNewPermiso({ ...newPermiso, nombre: e.target.value })}
                        placeholder="ej: inventario.crear"
                        className="block w-full rounded-2xl border-slate-100 bg-slate-50 py-3 px-4 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500/20 text-sm transition-all"
                    />
                    <p className="mt-2 text-xs text-slate-500 font-medium">Formato: <code className="bg-indigo-50 text-indigo-700 rounded-md px-1.5 py-0.5 font-bold">modulo.accion</code></p>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Descripción</label>
                    <textarea
                        value={newPermiso.descripcion}
                        onChange={(e) => setNewPermiso({ ...newPermiso, descripcion: e.target.value })}
                        rows={3}
                        placeholder="Describe qué permite hacer esta acción..."
                        className="block w-full rounded-2xl border-slate-100 bg-slate-50 py-3 px-4 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500/20 text-sm transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-black tracking-widest text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    CREAR PERMISO
                </button>
            </form>
        </div>
    );
}
