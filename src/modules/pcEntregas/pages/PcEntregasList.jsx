import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEntregasService from '../services/pcEntregasService';

export default function PcEntregasList() {
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEntregas();
    }, []);

    const loadEntregas = async () => {
        console.log('PcEntregasList: Loading entregas...');
        try {
            const data = await pcEntregasService.getAll();
            console.log('PcEntregasList: Data received:', data);
            setEntregas(data || []);
        } catch (error) {
            console.error('PcEntregasList: Error loading entregas:', error);
            Swal.fire('Error', 'No se pudieron cargar las entregas. Revise la consola.', 'error');
        } finally {
            setLoading(false);
            console.log('PcEntregasList: Loading finished.');
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
                await pcEntregasService.delete(id);
                Swal.fire('Eliminado', 'La entrega ha sido eliminada.', 'success');
                loadEntregas();
            } catch (error) {
                console.error('Error deleting entrega:', error);
                Swal.fire('Error', 'No se pudo eliminar la entrega', 'error');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Cargando entregas...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Entregas de Equipos</h1>
                <Link
                    to="/pc-entregas/crear"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    Nueva Entrega
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Entrega</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {entregas.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No hay entregas registradas.
                                </td>
                            </tr>
                        ) : (
                            entregas.map((entrega) => (
                                <tr key={entrega.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {entrega.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {entrega.equipo ? (
                                            <div>
                                                <div className="font-medium text-gray-900">{entrega.equipo.serial}</div>
                                                <div className="text-xs text-gray-500">{entrega.equipo.marca} {entrega.equipo.modelo}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Equipo no encontrado</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {entrega.funcionario ? (
                                            <div>
                                                <div className="font-medium">{entrega.funcionario.nombres} {entrega.funcionario.apellidos}</div>
                                                <div className="text-xs text-gray-500">{entrega.funcionario.cedula}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Desconocido</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {entrega.fecha_entrega}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${entrega.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                                                entrega.estado === 'devuelto' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {entrega.estado ? entrega.estado.charAt(0).toUpperCase() + entrega.estado.slice(1) : 'Desconocido'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/pc-entregas/editar/${entrega.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </Link>
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
    );
}
