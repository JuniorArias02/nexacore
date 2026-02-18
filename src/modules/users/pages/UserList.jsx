import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import Swal from 'sweetalert2';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    UserIcon
} from '@heroicons/react/24/outline';

export default function UserList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll();
            if (response && response.objeto) {
                setItems(response.objeto);
            } else if (Array.isArray(response)) {
                setItems(response);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Error loading users:", error);
            Swal.fire('Error', 'No se pudieron cargar los registros', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await userService.delete(id);
                setItems(prev => prev.filter(item => item.id !== id));
                Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
            } catch (error) {
                console.error("Error deleting:", error);
                const errorMessage = error.response?.data?.mensaje || 'No se pudo eliminar el registro';
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };

    const filteredItems = items.filter(item =>
        item.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Gestión de Usuarios
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Administra los accesos y perfiles del sistema NEXA.
                    </p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <Link
                        to="/usuarios/nuevo"
                        className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
                    >
                        <PlusIcon className="-ml-0.5 mr-2.5 h-5 w-5" aria-hidden="true" />
                        Nuevo Usuario
                    </Link>
                </div>
            </div>

            {/* Filters & Search Card */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-shadow"
                            placeholder="Buscar por nombre o usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:pl-6">
                                    ID
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Rol / Sede
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                                            Cargando usuarios...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-sm text-gray-500">
                                        <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        No se encontraron usuarios que coincidan con tu búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-400 sm:pl-6">
                                            #{item.id}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {item.nombre_completo.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{item.nombre_completo}</div>
                                                    <div className="text-gray-500">{item.usuario}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 w-fit mb-1">
                                                    {item.rol ? item.rol.nombre : 'Sin Rol'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {item.sede ? item.sede.nombre : 'Sin Sede'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.is_online
                                                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                    : item.activity_status === 'away'
                                                        ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                                        : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${item.is_online ? 'bg-green-600 animate-pulse' :
                                                        item.activity_status === 'away' ? 'bg-yellow-600' : 'bg-gray-400'
                                                    }`} />
                                                {item.is_online ? 'En línea' : item.activity_status === 'away' ? 'Ausente' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/usuarios/editar/${item.id}`}
                                                    className="rounded-full p-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="rounded-full p-2 text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
