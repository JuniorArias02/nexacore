import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { pedidosProgramadosService } from '../services/pedidosProgramadosService';
import CpPedidoForm from '../../Pedidos/components/CpPedidoForm';

export default function CpPedidoProgramadoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await pedidosProgramadosService.getById(id);
                setInitialData(response);
            } catch (error) {
                console.error("Error al cargar el pedido programado:", error);
                Swal.fire('Error', 'No se pudo cargar el pedido', 'error');
                navigate('/gestion-compras/cp-pedidos-programados');
            } finally {
                setCargando(false);
            }
        };
        fetchPedido();
    }, [id, navigate]);

    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Cargando datos del pedido en espera...</p>
            </div>
        );
    }

    return (
        <div>
            <CpPedidoForm initialData={initialData} isProgramadoEdit={true} />
        </div>
    );
}
