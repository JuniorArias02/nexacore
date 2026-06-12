import { useState, useEffect, useMemo } from 'react';
import { permisosService } from '../services/permisosService';
import { ServerStackIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

import PermisosHero from '../components/PermisosHero';
import CatalogoPermisos from '../components/CatalogoPermisos';
import AsignacionRoles from '../components/AsignacionRoles';

export default function PermisosPage() {
    const [activeTab, setActiveTab] = useState('asignacion');
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
            const [rolesData, permisosData] = await Promise.all([
                permisosService.getRolesWithPermisos(),
                permisosService.getAll()
            ]);
            setRoles(rolesData);
            setPermisos(permisosData);

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

    const handleEditPermiso = async (permiso) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Permiso',
            html:
                `<div style="text-align:left;margin-bottom:8px;"><label style="font-size:14px;font-weight:600;">Slug del Permiso</label></div>` +
                `<input id="swal-nombre" class="swal2-input" style="margin:0 0 16px 0;width:100%;box-sizing:border-box;" value="${permiso.nombre}" placeholder="ej: inventario.crear">` +
                `<div style="text-align:left;margin-bottom:8px;"><label style="font-size:14px;font-weight:600;">Descripción</label></div>` +
                `<textarea id="swal-descripcion" class="swal2-textarea" style="margin:0;width:100%;box-sizing:border-box;" placeholder="Describe qué permite hacer...">${permiso.descripcion || ''}</textarea>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#4f46e5',
            preConfirm: () => {
                const nombre = document.getElementById('swal-nombre').value;
                if (!nombre) {
                    Swal.showValidationMessage('El nombre es obligatorio');
                    return false;
                }
                return {
                    nombre,
                    descripcion: document.getElementById('swal-descripcion').value
                };
            }
        });

        if (formValues) {
            try {
                await permisosService.update(permiso.id, formValues);
                Swal.fire({
                    icon: 'success',
                    title: 'Permiso actualizado',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                loadData();
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar el permiso', 'error');
            }
        }
    };

    const handleDeletePermiso = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará el permiso permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
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

    const toggleGroupPermissions = (groupPermisos, selectAll) => {
        const newSet = new Set(localPermissions);
        groupPermisos.forEach(p => {
            if (selectAll) {
                newSet.add(p.id);
            } else {
                newSet.delete(p.id);
            }
        });
        setLocalPermissions(newSet);
        setIsDirty(true);
    };

    const saveRolePermissions = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        try {
            await permisosService.assignPermisos(selectedRoleId, Array.from(localPermissions));

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

    const groupedPermissions = useMemo(() => {
        const groups = {};

        const filtered = permisos.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.forEach(p => {
            const moduleName = p.nombre.includes('.') ? p.nombre.split('.')[0] : 'General';
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
        <div className="space-y-8 animate-fade-in pb-20 font-['Outfit']">
            <PermisosHero stats={{ permisos: permisos.length, roles: roles.length }} />

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
                <nav className="flex space-x-2 rounded-full bg-slate-100/80 p-1.5 shadow-inner backdrop-blur-xl border border-slate-200/50">
                    <button
                        onClick={() => { setActiveTab('permisos'); setSearchTerm(''); }}
                        className={`flex items-center rounded-full px-8 py-3 text-sm font-black tracking-widest transition-all duration-300 ${
                            activeTab === 'permisos'
                                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-900/5 scale-105'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                        }`}
                    >
                        <ServerStackIcon className="mr-2 h-5 w-5" />
                        CATÁLOGO DE PERMISOS
                    </button>
                    <button
                        onClick={() => { setActiveTab('asignacion'); setSearchTerm(''); }}
                        className={`flex items-center rounded-full px-8 py-3 text-sm font-black tracking-widest transition-all duration-300 ${
                            activeTab === 'asignacion'
                                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-900/5 scale-105'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                        }`}
                    >
                        <UserGroupIcon className="mr-2 h-5 w-5" />
                        ASIGNACIÓN A ROLES
                    </button>
                </nav>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'permisos' && (
                        <CatalogoPermisos
                            newPermiso={newPermiso}
                            setNewPermiso={setNewPermiso}
                            handleCreatePermiso={handleCreatePermiso}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            groupedPermissions={groupedPermissions}
                            handleEditPermiso={handleEditPermiso}
                            handleDeletePermiso={handleDeletePermiso}
                        />
                    )}

                    {activeTab === 'asignacion' && (
                        <AsignacionRoles
                            roles={roles}
                            selectedRoleId={selectedRoleId}
                            setSelectedRoleId={setSelectedRoleId}
                            activeRole={activeRole}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            groupedPermissions={groupedPermissions}
                            localPermissions={localPermissions}
                            toggleLocalPermission={toggleLocalPermission}
                            toggleGroupPermissions={toggleGroupPermissions}
                            isDirty={isDirty}
                            saving={saving}
                            saveRolePermissions={saveRolePermissions}
                        />
                    )}
                </>
            )}
        </div>
    );
}
