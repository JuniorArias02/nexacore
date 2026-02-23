import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { roleService } from '../../roles/services/roleService';
import { sedeService } from '../services/sedeService';
import Swal from 'sweetalert2';
import {
    UserCircleIcon,
    KeyIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    ArrowLeftIcon,
    IdentificationIcon,
    HashtagIcon,
    PowerIcon
} from '@heroicons/react/24/outline';

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
            Swal.fire({
                title: 'Error de Validación',
                text: 'Usuario y contraseña son obligatorios para el registro.',
                icon: 'error',
                customClass: { popup: 'rounded-[2rem]' }
            });
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
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Perfil de usuario modificado con éxito.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } else {
                await userService.create(dataToSend);
                Swal.fire({
                    title: '¡Creado!',
                    text: 'Nuevo usuario registrado en el sistema.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
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
            <div className="flex flex-col items-center justify-center min-h-[500px] animate-pulse">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recuperando Perfil...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in font-sans">
            {/* Header Section */}
            <div className="bg-white shadow-xl rounded-[2rem] p-6 mb-8 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mr-5 shadow-lg shadow-indigo-200">
                        <UserGroupIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            {isEditing ? 'Gestión de Perfil' : 'Registro de Identidad'}
                        </h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">NexaCore Security Protocol v2.0</p>
                    </div>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Master Engine</span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Terminal Encriptada</span>
                    </div>
                </div>
            </div>

            {/* Sub-Header Navigation */}
            <div className="mb-8 flex items-center justify-between px-2">
                <Link
                    to="/usuarios"
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                >
                    <div className="h-9 w-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:shadow-indigo-50 transition-all">
                        <ArrowLeftIcon className="h-4 w-4 stroke-[3]" />
                    </div>
                    Volver a Seguridad
                </Link>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NEXA CLOUD OS</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-8 md:p-14">
                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Section: Información Personal */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <IdentificationIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">1. Identidad del Usuario</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nombre Completo *</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserCircleIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="nombre_completo"
                                            value={formData.nombre_completo}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                                            placeholder="Ej: JUNIOR ARIAS"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Correo Electrónico</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            name="correo"
                                            value={formData.correo}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Teléfono Móvil</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <PhoneIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                                            placeholder="+57 300 000 0000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Credenciales y Seguridad */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                                    <KeyIcon className="h-5 w-5 text-red-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">2. Credenciales de Acceso</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">ID de Usuario *</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <HashtagIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="usuario"
                                            value={formData.usuario}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-300 font-bold font-mono tracking-wider"
                                            placeholder="JARIAS"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                        Clave Secreta {isEditing ? '(Opcional)' : '*'}
                                    </label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <PowerIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            name="contrasena"
                                            value={formData.contrasena}
                                            onChange={handleChange}
                                            required={!isEditing}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500/30 transition-all text-slate-900 placeholder:text-slate-300 font-bold"
                                            placeholder={isEditing ? 'Sin cambios' : '••••••••'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Roles y Privilegios */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">3. Privilegios de Red</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Rol del Sistema</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ShieldCheckIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <select
                                            name="rol_id"
                                            value={formData.rol_id}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold appearance-none"
                                        >
                                            <option value="">Selección de Rango</option>
                                            {roles.map((rol) => (
                                                <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Sede de Enlace</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MapPinIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <select
                                            name="sede_id"
                                            value={formData.sede_id}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold appearance-none"
                                        >
                                            <option value="">Selección de Ubicación</option>
                                            {sedes.map((sede) => (
                                                <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <PowerIcon className={`h-5 w-5 ${formData.estado ? 'text-green-500' : 'text-slate-300'}`} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-800">Estatus de Operación</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Determina si el perfil tiene permiso de logueo</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="estado"
                                                checked={formData.estado}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-grow relative overflow-hidden group py-5 bg-indigo-600 text-white rounded-3xl font-black tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:shadow-indigo-400 transition-all transform active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3 uppercase text-xs">
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            {isEditing ? 'Sincronizar Perfil' : 'Ejecutar Alta de Usuario'}
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/usuarios')}
                                className="sm:w-1/3 py-5 bg-white text-slate-400 rounded-3xl font-black tracking-widest border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all uppercase text-xs shadow-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer Brand */}
            <div className="mt-12 text-center pb-8 border-t border-slate-100 pt-8 opacity-40">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">
                    NexaCore Terminal Platform &copy; 2026
                </p>
            </div>
        </div>
    );
}
