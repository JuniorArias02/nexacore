import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcDevueltoService from '../services/pcDevueltoService';

export default function PcDevueltoList() {
    const [devueltos, setDevueltos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDevueltos();
    }, []);

    const loadDevueltos = async () => {
        try {
            const data = await pcDevueltoService.getAll();
            setDevueltos(data || []);
        } catch (error) {
            console.error('Error loading devueltos:', error);
            Swal.fire('Error', 'No se pudieron cargar las devoluciones', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await pcDevueltoService.delete(id);
                Swal.fire('Eliminado', 'La devolución ha sido eliminada', 'success');
                loadDevueltos();
            } catch (error) {
                console.error('Error deleting devuelto:', error);
                Swal.fire('Error', 'No se pudo eliminar la devolución', 'error');
            }
        }
    };

    if (loading) {
        return <div className="text-center p-10">Cargando devoluciones...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Devolución de Equipos</h1>
                <Link
                    to="/pc-devueltos/crear"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Nueva Devolución
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Devolución</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {devueltos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay devoluciones registradas
                                </td>
                            </tr>
                        ) : (
                            devueltos.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.entrega?.equipo?.nombre_equipo || 'N/A'}
                                        <span className="text-gray-500 text-xs block">{item.entrega?.equipo?.serial || ''}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.entrega?.funcionario?.nombres} {item.entrega?.funcionario?.apellidos}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(item.fecha_devolucion).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/pc-devueltos/editar/${item.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
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
    );
}
