import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { entregaActivosFijosService } from '../services/entregaActivosFijosService';
import { formatDate } from '../../../utils/dateFormatter';
import {
    PlusIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import React from 'react'; // Added React import for Fragment

export default function EntregaActivosFijosList() {
    const navigate = useNavigate();
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEntregaId, setExpandedEntregaId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadEntregas();
    }, []);

    const loadEntregas = async () => {
        try {
            setLoading(true);
            const data = await entregaActivosFijosService.getAll();
            setEntregas(data || []);
        } catch (error) {
            console.error('Error loading entregas:', error);
            Swal.fire('Error', 'No se pudieron cargar las entregas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id) => {
        if (expandedEntregaId === id) {
            setExpandedEntregaId(null);
        } else {
            setExpandedEntregaId(id);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await entregaActivosFijosService.delete(id);
                Swal.fire('Eliminado', 'La entrega ha sido eliminada', 'success');
                loadEntregas();
            } catch (error) {
                console.error('Error deleting entrega:', error);
                Swal.fire('Error', 'No se pudo eliminar la entrega', 'error');
            }
        }
    };

    const filteredEntregas = entregas.filter(entrega =>
        entrega.personal?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.sede?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.id?.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/30 mb-2 backdrop-blur-sm">
                        GESTIÓN DE ACTIVOS
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                        Entrega de Activos Fijos
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg">
                        Administra y controla las entregas de equipos y activos a colaboradores.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/entrega-activos-fijos/nuevo')}
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:-translate-y-1"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                            Nueva Entrega
                        </button>
                    </div>
                </div>
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
                <div className="relative rounded-2xl shadow-sm max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-2xl border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm"
                        placeholder="Buscar por personal, sede o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-gray-900/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Entrega</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asignado</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sede</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredEntregas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-lg font-medium text-gray-900">No se encontraron entregas</p>
                                            <p className="text-sm text-gray-500 mt-1">Intenta ajustar tu búsqueda o crea una nueva entrega.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEntregas.map((entrega) => (
                                    <React.Fragment key={entrega.id}>
                                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 cursor-pointer" onClick={() => toggleRow(entrega.id)}>
                                                <div className="flex items-center gap-2">
                                                    #{entrega.id}
                                                    {expandedEntregaId === entrega.id ? (
                                                        <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(entrega.fecha_entrega)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex items-center">
                                                        <span className="text-xs font-semibold text-gray-500 w-20">Personal:</span>
                                                        <span className="text-sm font-medium text-gray-900">{entrega.personal?.nombre || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-xs font-semibold text-gray-500 w-20">Coordinador:</span>
                                                        <span className="text-sm text-gray-600">{entrega.coordinador?.nombre || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    {entrega.sede?.nombre || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                    {entrega.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/entrega-activos-fijos/editar/${entrega.id}`)}
                                                        className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                        title="Ver Detalle"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(entrega.id)}
                                                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expanded Row Details */}
                                        {expandedEntregaId === entrega.id && (
                                            <tr className="bg-gray-50/50">
                                                <td colSpan="6" className="px-6 py-4">
                                                    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
                                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                            <CubeIcon className="h-4 w-4 text-indigo-500" />
                                                            Items Entregados
                                                        </h4>
                                                        <div className="overflow-hidden rounded-lg border border-gray-200">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marca/Modelo</th>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Accesorio</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                                    {entrega.items?.map((item) => (
                                                                        <tr key={item.id}>
                                                                            <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                                                                                {item.inventario?.codigo || 'N/A'}
                                                                            </td>
                                                                            <td className="px-3 py-2 text-xs text-gray-500">
                                                                                {item.inventario?.nombre || 'N/A'}
                                                                            </td>
                                                                            <td className="px-3 py-2 text-xs text-gray-500">
                                                                                {item.inventario?.marca} {item.inventario?.modelo ? `/ ${item.inventario?.modelo} ` : ''}
                                                                            </td>
                                                                            <td className="px-3 py-2 text-xs text-gray-500">
                                                                                {item.inventario?.serial || 'N/A'}
                                                                            </td>
                                                                            <td className="px-3 py-2 text-xs text-gray-500">
                                                                                {item.es_accesorio ? (
                                                                                    <span className="text-green-600 font-medium">Sí ({item.accesorio_descripcion})</span>
                                                                                ) : (
                                                                                    <span className="text-gray-400">No</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        {/* Signatures */}
                                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="flex flex-col items-center">
                                                                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Firma Quien Entrega</p>
                                                                {entrega.firma_quien_entrega ? (
                                                                    <div className="p-2 border border-dashed border-gray-300 rounded bg-gray-50/50">
                                                                        <img
                                                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${entrega.firma_quien_entrega}`}
                                                                            alt="Firma Entrega"
                                                                            className="h-24 object-contain mix-blend-multiply"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-24 w-full flex items-center justify-center text-gray-400 text-sm italic border border-dashed border-gray-300 rounded bg-gray-50/50">
                                                                        Sin firma
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-center">
                                                                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Firma Quien Recibe</p>
                                                                {entrega.firma_quien_recibe ? (
                                                                    <div className="p-2 border border-dashed border-gray-300 rounded bg-gray-50/50">
                                                                        <img
                                                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${entrega.firma_quien_recibe}`}
                                                                            alt="Firma Recibe"
                                                                            className="h-24 object-contain mix-blend-multiply"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-24 w-full flex items-center justify-center text-gray-400 text-sm italic border border-dashed border-gray-300 rounded bg-gray-50/50">
                                                                        Sin firma
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
