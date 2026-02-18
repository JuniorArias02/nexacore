import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { entregaActivosFijosService } from '../services/entregaActivosFijosService';
import { formatDate, formatDateTime } from '../../../utils/dateFormatter';

export default function EntregaActivosFijosList() {
    const navigate = useNavigate();
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntrega, setSelectedEntrega] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleViewDetails = (entrega) => {
        setSelectedEntrega(entrega);
        setIsModalOpen(true);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Entrega de Activos Fijos</h1>
                <button
                    onClick={() => navigate('/entrega-activos-fijos/nuevo')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nueva Entrega
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Entrega</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinador</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {entregas.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No hay entregas registradas
                                    </td>
                                </tr>
                            ) : (
                                entregas.map((entrega) => (
                                    <tr key={entrega.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{entrega.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(entrega.fecha_entrega)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {entrega.personal?.nombre || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {entrega.sede?.nombre || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {entrega.coordinador?.nombre || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {entrega.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => handleViewDetails(entrega)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Ver más
                                            </button>
                                            <button
                                                onClick={() => navigate(`/entrega-activos-fijos/editar/${entrega.id}`)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(entrega.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {isModalOpen && selectedEntrega && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">

                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setIsModalOpen(false)}
                        ></div>

                        {/* Modal panel */}
                        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2" id="modal-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                        </svg>
                                        Detalle de Entrega #{selectedEntrega.id}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                                {/* General Information */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Información General</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de Entrega</p>
                                            <p className="text-base font-medium text-gray-900">{formatDate(selectedEntrega.fecha_entrega)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Personal (Quien Recibe)</p>
                                            <p className="text-base font-medium text-gray-900">{selectedEntrega.personal?.nombre || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Sede</p>
                                            <p className="text-base font-medium text-gray-900">{selectedEntrega.sede?.nombre || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Proceso Solicitante</p>
                                            <p className="text-base font-medium text-gray-900">{selectedEntrega.procesoSolicitante?.nombre || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Coordinador</p>
                                            <p className="text-base font-medium text-gray-900">{selectedEntrega.coordinador?.nombre || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Items Entregados</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Es Accesorio</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedEntrega.items?.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.inventario?.nombre_activo || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.inventario?.serial_inventario || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            {item.es_accesorio ? (
                                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sí</span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">No</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-500">{item.accesorio_descripcion || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Signatures */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedEntrega.firma_quien_entrega && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Firma Quien Entrega</h4>
                                            <img
                                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedEntrega.firma_quien_entrega}`}
                                                alt="Firma Entrega"
                                                className="h-32 border border-gray-200 rounded bg-white p-2"
                                            />
                                        </div>
                                    )}
                                    {selectedEntrega.firma_quien_recibe && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Firma Quien Recibe</h4>
                                            <img
                                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedEntrega.firma_quien_recibe}`}
                                                alt="Firma Recibe"
                                                className="h-32 border border-gray-200 rounded bg-white p-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="inline-flex justify-center items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
