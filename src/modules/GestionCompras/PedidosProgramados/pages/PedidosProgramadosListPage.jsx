import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ClockIcon, PencilSquareIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { pedidosProgramadosService } from '../services/pedidosProgramadosService';
import { useAuth } from '../../../../context/AuthContext';
import { getStorageUrl } from '../../../../services/api';

export default function PedidosProgramadosListPage() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        cargarPedidos();
    }, [user]);

    const cargarPedidos = async () => {
        if (!user || !user.id) return;
        try {
            setCargando(true);
            const data = await pedidosProgramadosService.getAll({ estado: 'programado', creado_por: user.id });
            setPedidos(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error("Error al cargar pedidos programados:", error);
            Swal.fire('Error', 'No se pudieron cargar los pedidos programados', 'error');
        } finally {
            setCargando(false);
        }
    };

    const manejarEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción cancelará el pedido programado y no se podrá revertir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, cancelar pedido',
            cancelButtonText: 'No, mantener'
        });

        if (result.isConfirmed) {
            try {
                await pedidosProgramadosService.delete(id);
                Swal.fire('Eliminado', 'El pedido programado ha sido cancelado.', 'success');
                cargarPedidos();
            } catch (error) {
                console.error("Error al eliminar:", error);
                Swal.fire('Error', 'No se pudo cancelar el pedido', 'error');
            }
        }
    };

    const manejarEditar = (id) => {
        navigate(`/gestion-compras/cp-pedidos-programados/editar/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        GESTIÓN DE COMPRAS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        Mis Pedidos Programados
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        Administra los pedidos que has dejado en espera. Estos pedidos se ejecutarán automáticamente al llegar la fecha programada.
                    </p>
                </div>
                <ClockIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                <th className="p-5 font-black">ID</th>
                                <th className="p-5 font-black">Fecha Programada</th>
                                <th className="p-5 font-black">Ítems</th>
                                <th className="p-5 font-black text-center">Firma</th>
                                <th className="p-5 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-700">
                            {cargando ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">Cargando pedidos...</td>
                                </tr>
                            ) : pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <CalendarDaysIcon className="h-12 w-12 text-slate-200 mb-3" />
                                            <p>No tienes pedidos programados actualmente.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pedidos.map((pedido) => (
                                    <tr key={pedido.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors duration-200 group/item">
                                        <td className="p-5">
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                                                #{pedido.id}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center text-indigo-700 font-bold">
                                                <ClockIcon className="h-4 w-4 mr-2" />
                                                {new Date(pedido.fecha_programada).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
                                                {pedido.datos_pedido?.items?.length || 0} ítems
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            {pedido.firma_programador && (
                                                <img src={getStorageUrl(pedido.firma_programador)} alt="Firma" className="h-8 object-contain mx-auto mix-blend-multiply" />
                                            )}
                                        </td>
                                        <td className="p-5 text-right space-x-2">
                                            <button 
                                                onClick={() => manejarEditar(pedido.id)}
                                                className="inline-flex items-center p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                title="Editar Pedido"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => manejarEliminar(pedido.id)}
                                                className="inline-flex items-center p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                                title="Cancelar Pedido"
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
    );
}
