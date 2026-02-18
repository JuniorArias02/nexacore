import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pCargoService } from '../services/pCargoService';
import Swal from 'sweetalert2';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function PCargoList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await pCargoService.getAll();
            if (response && response.objeto) {
                setItems(response.objeto);
            } else if (Array.isArray(response)) {
                setItems(response);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Error loading cargos:", error);
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
                await pCargoService.delete(id);
                setItems(prev => prev.filter(item => item.id !== id));
                Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
            } catch (error) {
                console.error("Error deleting:", error);
                const errorMessage = error.response?.data?.mensaje || 'No se pudo eliminar el registro';
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Cargos (P)</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Lista de cargos.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        to="/p-cargos/nuevo"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <PlusIcon className="h-4 w-4" />
                            Nuevo Registro
                        </span>
                    </Link>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            ID
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Nombre
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Acciones</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 text-sm text-gray-500">Cargando...</td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 text-sm text-gray-500">No hay registros encontrados</td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {item.id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {item.nombre}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        to={`/p-cargos/editar/${item.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
                                                        title="Editar"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-900 inline-block"
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
