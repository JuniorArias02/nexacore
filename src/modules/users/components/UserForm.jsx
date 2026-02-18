import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { roleService } from '../../roles/services/roleService';
import { sedeService } from '../services/sedeService';
import Swal from 'sweetalert2';
import { UserCircleIcon, KeyIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre_completo: '',
        usuario: '',
        contrasena: '',
        correo: '',
        telefono: '',
        rol_id: '',
        sede_id: '',
        estado: true
    });
    const [roles, setRoles] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDependencies();
        if (isEditing) {
            loadUser();
        }
    }, [id]);

    const loadDependencies = async () => {
        try {
            const [rolesData, sedesData] = await Promise.all([
                roleService.getAll(),
                sedeService.getAll()
            ]);

            if (rolesData && rolesData.objeto) setRoles(rolesData.objeto);
            else if (Array.isArray(rolesData)) setRoles(rolesData);

            if (sedesData && sedesData.objeto) setSedes(sedesData.objeto);
            else if (Array.isArray(sedesData)) setSedes(sedesData);

        } catch (error) {
            console.error("Error loading dependencies:", error);
            Swal.fire('Error', 'No se pudieron cargar las listas desplegables', 'error');
        }
    };

    const loadUser = async () => {
        try {
            setLoading(true);
            const data = await userService.getById(id);
            setFormData({
                nombre_completo: data.nombre_completo || '',
                usuario: data.usuario || '',
                contrasena: '',
                correo: data.correo || '',
                telefono: data.telefono || '',
                rol_id: data.rol_id || '',
                sede_id: data.sede_id || '',
                estado: data.estado !== undefined ? data.estado : true
            });
        } catch (error) {
            console.error("Error loading user:", error);
            Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
            navigate('/usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.usuario || (!isEditing && !formData.contrasena)) {
            Swal.fire('Error', 'Usuario y contraseña son obligatorios', 'error');
            return;
        }

        try {
            setLoading(true);
            const dataToSend = { ...formData };
            if (isEditing && !dataToSend.contrasena) {
                delete dataToSend.contrasena;
            }

            if (isEditing) {
                await userService.update(id, dataToSend);
                Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
            } else {
                await userService.create(dataToSend);
                Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
            }
            navigate('/usuarios');
        } catch (error) {
            console.error("Error saving user:", error);
            const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || 'Ocurrió un error al guardar';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && !formData.usuario) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Complete la información para {isEditing ? 'actualizar el' : 'registrar un nuevo'} usuario en el sistema.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-xl rounded-2xl p-6 sm:p-10 ring-1 ring-gray-900/5">

                {/* Section: Personal Info */}
                <div>
                    <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                        <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                        Información Personal
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                        Detalles básicos del usuario.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="nombre_completo" className="block text-sm font-medium leading-6 text-gray-900">
                                Nombre Completo
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="nombre_completo"
                                    id="nombre_completo"
                                    value={formData.nombre_completo}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="correo" className="block text-sm font-medium leading-6 text-gray-900">
                                Correo Electrónico
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="email"
                                    name="correo"
                                    id="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium leading-6 text-gray-900">
                                Teléfono
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="telefono"
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                    placeholder="+57 300 123 4567"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-900/10 pt-8">
                    <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                        <KeyIcon className="h-5 w-5 text-indigo-600" />
                        Cuenta y Seguridad
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                        Credenciales de acceso al sistema.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="usuario" className="block text-sm font-medium leading-6 text-gray-900">
                                Usuario *
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="usuario"
                                    id="usuario"
                                    value={formData.usuario}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="contrasena" className="block text-sm font-medium leading-6 text-gray-900">
                                Contraseña {isEditing && <span className="text-gray-400 font-normal">(Dejar en blanco para mantener)</span>} *
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="contrasena"
                                    id="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required={!isEditing}
                                    className="block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-900/10 pt-8">
                    <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                        <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
                        Roles y Permisos
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                        Defina el rol y la ubicación del usuario.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="rol_id" className="block text-sm font-medium leading-6 text-gray-900">
                                Rol Asignado
                            </label>
                            <div className="mt-2">
                                <select
                                    id="rol_id"
                                    name="rol_id"
                                    value={formData.rol_id}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="sede_id" className="block text-sm font-medium leading-6 text-gray-900">
                                Sede / Ubicación
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <select
                                    id="sede_id"
                                    name="sede_id"
                                    value={formData.sede_id}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                                >
                                    <option value="">Seleccione una sede</option>
                                    {sedes.map((sede) => (
                                        <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <div className="relative flex gap-x-3">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="estado"
                                        name="estado"
                                        type="checkbox"
                                        checked={formData.estado}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="estado" className="font-medium text-gray-900">
                                        Usuario Activo
                                    </label>
                                    <p className="text-gray-500">Permitir acceso al sistema.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-900/10 pt-8 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        onClick={() => navigate('/usuarios')}
                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all duration-200"
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario')}
                    </button>
                </div>
            </form>
        </div>
    );
}
