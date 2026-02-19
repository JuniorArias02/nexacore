import { useState, useEffect, useMemo } from 'react';
import { permisosService } from '../services/permisosService';
import {
    PlusIcon,
    TrashIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    UserGroupIcon,
    ArrowPathIcon,
    ServerStackIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function PermisosPage() {
    const [activeTab, setActiveTab] = useState('permisos'); // 'permisos' or 'asignacion'
    const [permisos, setPermisos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Asignacion State
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [localPermissions, setLocalPermissions] = useState(new Set());
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state for creating permission
    const [newPermiso, setNewPermiso] = useState({ nombre: '', descripcion: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    // When role changes, reset local state
    useEffect(() => {
        if (selectedRoleId) {
            const role = roles.find(r => r.id === selectedRoleId);
            if (role) {
                const initialPermisos = new Set(role.permisos.map(p => p.id));
                setLocalPermissions(initialPermisos);
                setIsDirty(false);
            }
        } else {
            setLocalPermissions(new Set());
            setIsDirty(false);
        }
    }, [selectedRoleId, roles]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Always load both for smoother transitions and data availability
            const [rolesData, permisosData] = await Promise.all([
                permisosService.getRolesWithPermisos(),
                permisosService.getAll()
            ]);
            setRoles(rolesData);
            setPermisos(permisosData);

            // Auto-select first role if none selected and in assignment tab
            if (activeTab === 'asignacion' && !selectedRoleId && rolesData.length > 0) {
                setSelectedRoleId(rolesData[0].id);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePermiso = async (e) => {
        e.preventDefault();
        try {
            await permisosService.create(newPermiso);
            Swal.fire({
                icon: 'success',
                title: 'Permiso creado',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            setNewPermiso({ nombre: '', descripcion: '' });
            loadData();
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el permiso', 'error');
        }
    };

    const handleDeletePermiso = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará el permiso permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await permisosService.delete(id);
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                loadData();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el permiso', 'error');
            }
        }
    };

    // --- Bulk Assignment Logic ---

    const toggleLocalPermission = (permisoId) => {
        const newSet = new Set(localPermissions);
        if (newSet.has(permisoId)) {
            newSet.delete(permisoId);
        } else {
            newSet.add(permisoId);
        }
        setLocalPermissions(newSet);
        setIsDirty(true);
    };

    const saveRolePermissions = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        try {
            await permisosService.assignPermisos(selectedRoleId, Array.from(localPermissions));

            // Reload roles to confirm sync
            const rolesData = await permisosService.getRolesWithPermisos();
            setRoles(rolesData);
            setIsDirty(false);

            Swal.fire({
                icon: 'success',
                title: 'Permisos actualizados',
                text: 'La asignación se ha guardado correctamente.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
        } finally {
            setSaving(false);
        }
    };

    // --- Grouping Logic ---
    const groupedPermissions = useMemo(() => {
        const groups = {};

        // Filter first
        const filtered = permisos.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.forEach(p => {
            const moduleName = p.nombre.includes('.') ? p.nombre.split('.')[0] : 'General';
            // Capitalize
            const formattedName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

            if (!groups[formattedName]) {
                groups[formattedName] = [];
            }
            groups[formattedName].push(p);
        });

        return groups;
    }, [permisos, searchTerm]);

    const activeRole = roles.find(r => r.id === selectedRoleId);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* NexaCore Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md mb-3 border border-white/20">
                            <ShieldCheckIcon className="mr-1.5 h-3.5 w-3.5" />
                            SEGURIDAD
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                            Gestión de Permisos
                        </h1>
                        <p className="text-indigo-50 max-w-2xl text-lg opacity-90">
                            Configura el control de acceso basado en roles (RBAC) para la plataforma NexaCore.
                        </p>
                    </div>
                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
                            <div className="text-3xl font-bold">{permisos.length}</div>
                            <div className="text-xs text-indigo-100 uppercase tracking-widest opacity-80">Permisos</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
                            <div className="text-3xl font-bold">{roles.length}</div>
                            <div className="text-xs text-indigo-100 uppercase tracking-widest opacity-80">Roles</div>
                        </div>
                    </div>
                </div>
                {/* Decorative Blobs */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-500/30 blur-2xl"></div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center">
                <nav className="flex space-x-2 rounded-full bg-white/60 p-1.5 shadow-sm backdrop-blur-xl border border-gray-200/50">
                    <button
                        onClick={() => setActiveTab('permisos')}
                        className={`flex items-center rounded-full px-6 py-2.5 text-sm font-bold transition-all ${activeTab === 'permisos'
                            ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <ServerStackIcon className="mr-2 h-4 w-4" />
                        Catálogo de Permisos
                    </button>
                    <button
                        onClick={() => setActiveTab('asignacion')}
                        className={`flex items-center rounded-full px-6 py-2.5 text-sm font-bold transition-all ${activeTab === 'asignacion'
                            ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <UserGroupIcon className="mr-2 h-4 w-4" />
                        Asignación a Roles
                    </button>
                </nav>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'permisos' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Create Form */}
                            <div className="lg:col-span-1">
                                <div className="bg-white/70 backdrop-blur-md shadow-lg ring-1 ring-gray-900/5 rounded-3xl p-6 sticky top-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                            <PlusIcon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Nuevo Permiso</h3>
                                    </div>
                                    <form onSubmit={handleCreatePermiso} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug del Permiso</label>
                                            <input
                                                type="text"
                                                required
                                                value={newPermiso.nombre}
                                                onChange={(e) => setNewPermiso({ ...newPermiso, nombre: e.target.value })}
                                                placeholder="ej: inventario.crear"
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            <p className="mt-1.5 text-xs text-gray-500">Formato recomendado: <code className="bg-gray-100 rounded px-1 py-0.5">modulo.accion</code></p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
                                            <textarea
                                                value={newPermiso.descripcion}
                                                onChange={(e) => setNewPermiso({ ...newPermiso, descripcion: e.target.value })}
                                                rows={3}
                                                placeholder="Describe qué permite hacer esta acción..."
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                            <PlusIcon className="mr-2 h-5 w-5" />
                                            Crear Permiso
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* List */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Search Filter */}
                                <div className="relative">
                                    <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <input
                                        type="text"
                                        placeholder="Buscar permisos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-2xl border-0 bg-white py-3 pl-11 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow hover:shadow-md"
                                    />
                                </div>

                                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-3xl overflow-hidden">
                                    {Object.keys(groupedPermissions).length === 0 ? (
                                        <div className="p-12 text-center">
                                            <ServerStackIcon className="mx-auto h-12 w-12 text-gray-300" />
                                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay permisos</h3>
                                            <p className="mt-1 text-sm text-gray-500">Comienza creando uno nuevo en el panel izquierdo.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {Object.entries(groupedPermissions).map(([group, groupPermisos]) => (
                                                <div key={group} className="bg-white">
                                                    <div className="bg-gray-50/50 px-6 py-3 border-l-4 border-blue-500">
                                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{group}</h3>
                                                    </div>
                                                    <ul className="divide-y divide-gray-50">
                                                        {groupPermisos.map((permiso) => (
                                                            <li key={permiso.id} className="flex items-center justify-between gap-x-6 px-6 py-5 hover:bg-gray-50 transition-colors">
                                                                <div className="min-w-0">
                                                                    <div className="flex items-start gap-x-3">
                                                                        <p className="text-sm font-semibold leading-6 text-gray-900">{permiso.nombre}</p>
                                                                    </div>
                                                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                                                        <p>{permiso.descripcion || 'Sin descripción'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-none items-center gap-x-4">
                                                                    <button
                                                                        onClick={() => handleDeletePermiso(permiso.id)}
                                                                        className="rounded-lg p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                                    >
                                                                        <TrashIcon className="h-5 w-5" />
                                                                        <span className="sr-only">Eliminar</span>
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
                    )}

                    {activeTab === 'asignacion' && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            {/* Role Selector (Left Sidebar) */}
                            <div className="md:col-span-4 lg:col-span-3 space-y-4">
                                <h2 className="text-lg font-bold text-gray-900 px-1">Selecciona un Rol</h2>
                                <div className="space-y-2">
                                    {roles.map(rol => (
                                        <div
                                            key={rol.id}
                                            onClick={() => setSelectedRoleId(rol.id)}
                                            className={`group relative flex items-center justify-between p-4 cursor-pointer rounded-2xl transition-all duration-200 border ${selectedRoleId === rol.id
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-500' // Dark text removed, white text used
                                                : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 border-gray-100 shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${selectedRoleId === rol.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'}`}>
                                                    <UserGroupIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{rol.nombre}</h3>
                                                    <p className={`text-xs ${selectedRoleId === rol.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {rol.permisos?.length} permisos activos
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Permissions Matrix (Right Content) */}
                            <div className="md:col-span-8 lg:col-span-9">
                                {selectedRoleId ? (
                                    <div className="space-y-6">
                                        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-gray-100">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">
                                                        Permisos para <span className="text-blue-600">{activeRole?.nombre}</span>
                                                    </h2>
                                                    <p className="text-sm text-gray-500">Selecciona los permisos que deseas asignar a este rol.</p>
                                                </div>
                                                {/* Search in Asignacion */}
                                                <div className="w-64">
                                                    <div className="relative">
                                                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            placeholder="Filtrar permisos..."
                                                            className="block w-full rounded-xl border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                {Object.entries(groupedPermissions).map(([group, groupPermisos]) => (
                                                    <div key={group} className="animate-fade-in-up">
                                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                                            {group}
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {groupPermisos.map(permiso => {
                                                                const isSelected = localPermissions.has(permiso.id);
                                                                return (
                                                                    <div
                                                                        key={permiso.id}
                                                                        onClick={() => toggleLocalPermission(permiso.id)} // NO API CALL HERE
                                                                        className={`
                                                                        relative flex items-center p-3 rounded-xl cursor-pointer border transition-all duration-200
                                                                        ${isSelected
                                                                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20'
                                                                                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                                                            }
                                                                    `}
                                                                    >
                                                                        <div className={`
                                                                        flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3 transition-colors
                                                                        ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-gray-300'}
                                                                    `}>
                                                                            {isSelected && <CheckCircleIcon className="h-3.5 w-3.5 text-white" />}
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <span className={`block text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                                                {permiso.nombre}
                                                                            </span>
                                                                            <span className="block text-xs text-gray-500 truncate">
                                                                                {permiso.descripcion}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                                        <UserGroupIcon className="h-16 w-16 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900">Ningún rol seleccionado</h3>
                                        <p className="text-gray-500 max-w-sm mt-2">Selecciona un rol de la lista de la izquierda para comenzar a gestionar sus permisos.</p>
                                    </div>
                                )}
                            </div>

                            {/* Floating Save Button */}
                            <div className={`fixed bottom-8 right-8 transition-all duration-300 transform ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                                <button
                                    onClick={saveRolePermissions}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-900/40 disabled:opacity-70 font-bold"
                                >
                                    {saving ? (
                                        <>
                                            <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="h-5 w-5" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
