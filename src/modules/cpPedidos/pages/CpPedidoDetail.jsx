import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cpPedidoService } from '../services/cpPedidoService';
import { authService } from '../../auth/services/authService';
import { formatDate } from '../../../utils/dateFormatter';
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    PhotoIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import SignatureCanvas from 'react-signature-canvas';

export default function CpPedidoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Approval Mode State
    const [isApprovalMode, setIsApprovalMode] = useState(false);
    const [motivoAprobacion, setMotivoAprobacion] = useState('');
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
    const [useStoredSignature, setUseStoredSignature] = useState(false);

    // Items Management State (Post-Approval)
    const [localItems, setLocalItems] = useState([]);
    const [hasItemChanges, setHasItemChanges] = useState(false);

    const [approvalStage, setApprovalStage] = useState(null); // 'compras' | 'gerencia'

    const sigPad = useRef({});

    useEffect(() => {
        loadPedido();
        loadCurrentUser();
    }, [id]);

    useEffect(() => {
        if (pedido) {
            if (pedido.estado_compras === 'pendiente') {
                setApprovalStage('compras');
            } else if (pedido.estado_compras === 'aprobado' && pedido.estado_gerencia === 'pendiente') {
                setApprovalStage('gerencia');
            } else {
                setApprovalStage(null);
            }
        }
    }, [pedido]);

    const loadCurrentUser = async () => {
        try {
            const response = await authService.me();
            const user = response.objeto || response;
            setCurrentUser(user);
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    const loadPedido = async () => {
        try {
            setLoading(true);
            const data = await cpPedidoService.getById(id);
            setPedido(data);
            if (data.items) {
                setLocalItems(data.items.map(item => ({
                    id: item.id,
                    comprado: item.comprado === 1
                })));
            }
        } catch (error) {
            console.error('Error loading details:', error);
            Swal.fire('Error', 'No se pudieron cargar los detalles', 'error');
            navigate('/cp-pedidos');
        } finally {
            setLoading(false);
        }
    };

    const toggleApprovalMode = () => {
        setIsApprovalMode(!isApprovalMode);
        if (!isApprovalMode) {
            setMotivoAprobacion('');
            setIsSignatureEmpty(true);
            setUseStoredSignature(false);
            if (sigPad.current && sigPad.current.clear) sigPad.current.clear();
        }
    };

    const handleItemCheck = (itemId) => {
        // Allow check ONLY if approved
        if (pedido.estado_compras !== 'aprobado') return;

        setLocalItems(prev => {
            const newItems = prev.map(item =>
                item.id === itemId ? { ...item, comprado: !item.comprado } : item
            );
            // Check if changes exist compared to original pedido
            const originalItem = pedido.items.find(i => i.id === itemId);
            const newItem = newItems.find(i => i.id === itemId);

            // Simple check just to enable save button
            setHasItemChanges(true);
            return newItems;
        });
    };

    const saveItemChanges = async () => {
        try {
            const itemsToUpdate = localItems.map(item => ({
                id: item.id,
                comprado: item.comprado
            }));

            await cpPedidoService.updateItems(id, itemsToUpdate);
            Swal.fire('Actualizado', 'Estado de items actualizado correctamente', 'success');
            setHasItemChanges(false);
            loadPedido(); // Reload to sync
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron actualizar los items', 'error');
        }
    };

    const clearSignature = () => {
        if (sigPad.current) sigPad.current.clear();
        setIsSignatureEmpty(true);
    };

    const handleApprove = async () => {
        let signatureFile = null;
        let useStored = false;

        if (useStoredSignature) {
            if (!currentUser?.firma_digital) {
                Swal.fire('Error', 'No tienes una firma digital guardada en tu perfil.', 'error');
                return;
            }
            useStored = true;
        } else {
            if (isSignatureEmpty) {
                Swal.fire('Atención', 'Debe agregar su firma para aprobar', 'warning');
                return;
            }
            const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
            const res = await fetch(signatureData);
            const blob = await res.blob();
            signatureFile = new File([blob], "signature.png", { type: "image/png" });
        }

        try {
            const data = {
                firma: signatureFile,
                use_stored_signature: useStored
            };

            if (approvalStage === 'gerencia') {
                data.observacion_gerencia = motivoAprobacion;
                await cpPedidoService.aprobarGerencia(id, data);
            } else {
                data.motivo = motivoAprobacion;
                data.items_comprados = [];
                await cpPedidoService.aprobarCompras(id, data);
            }

            Swal.fire('Aprobado', `El pedido ha sido aprobado por ${approvalStage === 'gerencia' ? 'Gerencia' : 'Compras'} correctamente`, 'success');
            setIsApprovalMode(false);
            loadPedido();
        } catch (error) {
            console.error('Error approving:', error);
            const msg = error.response?.data?.mensaje || error.response?.data?.message || error.response?.data?.error || 'Error al aprobar el pedido';
            const details = error.response?.data?.objeto ? JSON.stringify(error.response.data.objeto) : '';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: msg,
                footer: details ? `<pre class="text-xs text-red-500">${details}</pre>` : null
            });
        }
    };

    const handleReject = async () => {
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Motivo del Rechazo',
            inputPlaceholder: 'Escriba la razón del rechazo...',
            showCancelButton: true,
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe escribir una razón para rechazar el pedido.';
                }
            }
        });

        if (text) {
            try {
                if (approvalStage === 'gerencia') {
                    await cpPedidoService.rechazarGerencia(id, text);
                } else {
                    await cpPedidoService.rechazarCompras(id, text);
                }
                Swal.fire('Rechazado', 'El pedido ha sido rechazado', 'success');
                loadPedido();
            } catch (error) {
                Swal.fire('Error', 'Error al rechazar el pedido', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!pedido) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/cp-pedidos')}
                        className="rounded-full p-2 bg-white text-gray-500 hover:text-indigo-600 hover:bg-gray-50 shadow-sm border border-gray-200 transition-all"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Detalle del Pedido #{pedido.consecutivo}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Información detallada y gestión de aprobación.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* Show approval buttons if a stage is active and we are not in approval mode yet */}
                    {approvalStage && !isApprovalMode && (
                        <>
                            <button
                                onClick={handleReject}
                                className="inline-flex justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                            >
                                Rechazar ({approvalStage === 'gerencia' ? 'Gerencia' : 'Compras'})
                            </button>
                            <button
                                onClick={toggleApprovalMode}
                                className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Gestionar Aprobación ({approvalStage === 'gerencia' ? 'Gerencia' : 'Compras'})
                            </button>
                        </>
                    )}
                    {pedido.estado_compras === 'aprobado' && hasItemChanges && (
                        <button
                            onClick={saveItemChanges}
                            className="inline-flex justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 animate-pulse"
                        >
                            Guardar Cambios en Items
                        </button>
                    )}
                    <button
                        onClick={() => cpPedidoService.exportExcel(id)}
                        className="inline-flex justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-inset ring-green-300 hover:bg-green-50"
                    >
                        <TableCellsIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                        Exportar Excel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Items & Approval) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Table */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6 flex justify-between items-center">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Items del Pedido</h3>
                            <span className="text-sm text-gray-500">{pedido.items?.length} items listados</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {pedido.estado_compras === 'aprobado' && (
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-10">
                                                <span className="sr-only">Seleccionar</span>
                                            </th>
                                        )}
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Producto</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cant.</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Und.</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {pedido.items?.map((item) => {
                                        const isChecked = localItems.find(i => i.id === item.id)?.comprado;
                                        return (
                                            <tr
                                                key={item.id}
                                                className={pedido.estado_compras === 'aprobado' ? "cursor-pointer hover:bg-indigo-50/50 transition-colors" : ""}
                                                onClick={() => handleItemCheck(item.id)}
                                            >
                                                {pedido.estado_compras === 'aprobado' && (
                                                    <td className="px-3 py-4 text-sm text-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            readOnly
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer pointer-events-none"
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    <div className="font-medium">{item.nombre}</div>
                                                    <div className="text-xs text-gray-500">{item.referencia_items}</div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">{item.cantidad}</td>
                                                <td className="px-3 py-4 text-sm text-gray-500">{item.unidad_medida}</td>
                                                <td className="px-3 py-4 text-sm">
                                                    {item.comprado === 1 ? (
                                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                            Comprado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                            Pendiente
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {pedido.estado_compras === 'aprobado' && (
                            <div className="bg-blue-50 px-4 py-3 border-t border-blue-100 flex items-start gap-3">
                                <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                                <p className="text-sm text-blue-700">
                                    Marque los items que ya han sido comprados y haga clic en "Guardar Cambios".
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Approval Action Area */}
                    {isApprovalMode && (
                        <div className="bg-white shadow-lg ring-1 ring-indigo-100 sm:rounded-xl overflow-hidden border-2 border-indigo-500/20">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                                    Finalizar Aprobación ({approvalStage === 'gerencia' ? 'Gerencia' : 'Compras'})
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo / Observación</label>
                                        <textarea
                                            rows={4}
                                            value={motivoAprobacion}
                                            onChange={(e) => setMotivoAprobacion(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Observaciones adicionales..."
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">Firma Digital *</label>

                                            {/* Signature Toggle */}
                                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => setUseStoredSignature(false)}
                                                    className={`p-1.5 rounded-md transition-all ${!useStoredSignature ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                                    title="Dibujar firma"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setUseStoredSignature(true)}
                                                    className={`p-1.5 rounded-md transition-all ${useStoredSignature ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                                    title="Usar firma guardada"
                                                >
                                                    <PhotoIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center relative min-h-[160px]">
                                            {useStoredSignature ? (
                                                currentUser?.firma_digital ? (
                                                    <img
                                                        src={currentUser.firma_digital}
                                                        alt="Firma Guardada"
                                                        className="h-24 object-contain"
                                                    />
                                                ) : (
                                                    <div className="text-center text-gray-500">
                                                        <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                                                        <span className="text-sm">No tienes una firma guardada.</span>
                                                    </div>
                                                )
                                            ) : (
                                                <>
                                                    <SignatureCanvas
                                                        ref={sigPad}
                                                        penColor='black'
                                                        canvasProps={{ width: 300, height: 120, className: 'cursor-crosshair' }}
                                                        onBegin={() => setIsSignatureEmpty(false)}
                                                    />
                                                    <button
                                                        onClick={clearSignature}
                                                        className="text-xs text-red-600 hover:text-red-800 absolute bottom-2 right-2 font-medium"
                                                    >
                                                        Limpiar
                                                    </button>
                                                    {isSignatureEmpty && <span className="text-xs text-gray-400 mt-10 pointer-events-none select-none">Firme aquí</span>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto"
                                >
                                    Confirmar Aprobación
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleApprovalMode}
                                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden p-6">
                        <h3 className="text-base font-semibold leading-7 text-gray-900 mb-4">Información del Pedido</h3>
                        <dl className="divide-y divide-gray-100">
                            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{formatDate(pedido.fecha_solicitud)}</dd>
                            </div>
                            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Sede</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pedido.sede?.nombre}</dd>
                            </div>
                            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Solicitante</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pedido.solicitante?.nombre}</dd>
                            </div>
                            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pedido.tipo_solicitud?.nombre}</dd>
                            </div>
                            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Elaborado</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 truncate">{pedido.elaborado_por?.nombre_completo}</dd>
                            </div>
                            {pedido.observacion && (
                                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Observaciones</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">{pedido.observacion}</dd>
                                </div>
                            )}
                            {pedido.motivo_aprobacion && (
                                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 bg-green-50 rounded-md px-2 -mx-2">
                                    <dt className="text-sm font-medium text-green-700">Motivo Aprobación</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">{pedido.motivo_aprobacion}</dd>
                                </div>
                            )}
                            {pedido.observaciones_pedidos && (
                                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 bg-red-50 rounded-md px-2 -mx-2">
                                    <dt className="text-sm font-medium text-red-600">Motivo Rechazo / Obs. Compras</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">{pedido.observaciones_pedidos}</dd>
                                </div>
                            )}
                            {pedido.observacion_gerencia && (
                                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 bg-orange-50 rounded-md px-2 -mx-2">
                                    <dt className="text-sm font-medium text-orange-700">Obs. Gerencia</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">{pedido.observacion_gerencia}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden p-6">
                        <h3 className="text-base font-semibold leading-7 text-gray-900 mb-4">Estado del Proceso</h3>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Compras</p>
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset mt-1 ${pedido.estado_compras === 'aprobado' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                    pedido.estado_compras === 'rechazado' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                        'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                    }`}>
                                    {pedido.estado_compras?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Gerencia</p>
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset mt-1 ${pedido.estado_gerencia === 'aprobado' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                    pedido.estado_gerencia === 'rechazado' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                        'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                    }`}>
                                    {pedido.estado_gerencia?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Signatures Display */}
                        <div className="mt-6 space-y-4 pt-4 border-t border-gray-100">
                            {pedido.elaborado_por_firma && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Firma Elaboración</p>
                                    <img
                                        src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${pedido.elaborado_por_firma}`}
                                        className="h-12 object-contain bg-gray-50 rounded p-1"
                                        alt="Firma Elaboración"
                                        onError={(e) => {
                                            console.error('Error loading signature:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            {pedido.proceso_compra_firma && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Firma Compras</p>
                                    <img
                                        src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${pedido.proceso_compra_firma}`}
                                        className="h-12 object-contain bg-gray-50 rounded p-1"
                                        alt="Firma Compras"
                                        onError={(e) => {
                                            console.error('Error loading signature:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            {pedido.responsable_aprobacion_firma && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Firma Gerencia</p>
                                    <img
                                        src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${pedido.responsable_aprobacion_firma}`}
                                        className="h-12 object-contain bg-gray-50 rounded p-1"
                                        alt="Firma Gerencia"
                                        onError={(e) => {
                                            console.error('Error loading signature:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
