import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CpPedidoForm from '../components/CpPedidoForm';
import { cpPedidoService } from '../services/cpPedidoService';
import Swal from 'sweetalert2';

export default function CpPedidoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const data = await cpPedidoService.getById(id);
                // Handle response wrapper
                const pedidoData = data.objeto || data;
                setPedido(pedidoData);
            } catch (error) {
                console.error('Error fetching pedido:', error);
                Swal.fire('Error', 'No se pudo cargar el pedido', 'error');
                navigate('/cp-pedidos');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPedido();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-lg font-medium text-gray-600 animate-pulse">Cargando pedido...</div>
            </div>
        );
    }

    if (!pedido) return null;

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Editar Pedido #{pedido.consecutivo}</h1>
            </div>
            <CpPedidoForm initialData={pedido} />
        </div>
    );
}
