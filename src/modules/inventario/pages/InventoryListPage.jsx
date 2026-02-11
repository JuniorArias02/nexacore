import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { inventoryService } from '../services/inventoryService';

export default function InventoryListPage() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setLoading(true);
        try {
            const data = await inventoryService.getAllInventario();
            // Adjust depending on API response structure. 
            // If API returns { objeto: [...], ... } then use data.objeto
            setInventory(data.objeto || []);
        } catch (err) {
            console.error("Error loading inventory:", err);
            setError("No se pudo cargar el inventario.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este item?')) {
            try {
                await inventoryService.deleteInventario(id);
                setInventory(prev => prev.filter(item => item.id !== id));
            } catch (err) {
                console.error("Error deleting item:", err);
                alert("Error al eliminar el item.");
            }
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 m-4">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Inventario</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Listado completo de activos y equipos.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/inventario/nuevo"
                        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Nuevo
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Codigo</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nombre</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Marca / Modelo</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Serial</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ubicación</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">Cargando inventario...</td>
                                    </tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">No se encontraron registros.</td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {item.codigo}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item.nombre}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item.marca} <span className="text-gray-300">|</span> {item.modelo}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item.serial}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item.ubicacion || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.estado === 'Nuevo' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                        item.estado === 'Malo' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                            'bg-blue-50 text-blue-700 ring-blue-600/20'
                                                    }`}>
                                                    {item.estado}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Ver detalles">
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                    <Link to={`/inventario/editar/${item.id}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
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
        </div>
    );
}
