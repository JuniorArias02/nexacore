import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CpPedidoItemForm from './CpPedidoItemForm';
import SignaturePad from '../../signatures/components/SignaturePad';
import { cpPedidoService } from '../services/cpPedidoService';
import { cpTipoSolicitudService } from '../../cpTipoSolicitud/services/cpTipoSolicitudService';
import { sedeService } from '../../users/services/sedeService';
import { dependenciaSedeService } from '../../dependenciaSede/services/dependenciaSedeService';
// import { userService } from '../../users/services/userService'; // Removed
import { authService } from '../../auth/services/authService';

import {
    ClipboardDocumentListIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    BriefcaseIcon,
    ClockIcon,
    UserIcon,
    DocumentTextIcon,
    PencilSquareIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

// Helper to convert dataURL to File
function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export default function CpPedidoForm() {
    const navigate = useNavigate();
    const [headerData, setHeaderData] = useState({
        proceso_solicitante: '',
        tipo_solicitud: '',
        observacion: '',
        sede_id: '',
        elaborado_por: '',
    });

    // Signature state
    const [useStoredSignature, setUseStoredSignature] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [items, setItems] = useState([]);
    const [signatureData, setSignatureData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dependencies state
    const [tipoSolicitudes, setTipoSolicitudes] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [dependencias, setDependencias] = useState([]);
    // const [usuarios, setUsuarios] = useState([]); // Removed as not needed for select

    useEffect(() => {
        loadDependencies();
        loadCurrentUser();
    }, []);

    const loadCurrentUser = async () => {
        try {
            const response = await authService.me();
            // Handle response wrapper if present
            const user = response.objeto || response;
            setCurrentUser(user);

            // Auto-set elaborado_por
            if (user && user.id) {
                setHeaderData(prev => ({
                    ...prev,
                    elaborado_por: user.id
                }));
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    const loadDependencies = async () => {
        // ... (existing loadDependencies logic) ...
        try {
            const [tipos, sed, deps] = await Promise.all([
                cpTipoSolicitudService.getAll(),
                sedeService.getAll(),
                dependenciaSedeService.getAll()
            ]);
            if (tipos && tipos.objeto) setTipoSolicitudes(tipos.objeto);
            if (sed && sed) setSedes(sed);
            if (deps && deps.objeto) setDependencias(deps.objeto);
            else if (Array.isArray(deps)) setDependencias(deps);

        } catch (error) {
            console.error("Error loading dependencies:", error);
            Swal.fire('Error', 'No se pudieron cargar las dependencias', 'error');
        }
    };

    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeaderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddItem = (item) => {
        setItems(prev => [...prev, item]);
    };

    const handleRemoveItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!headerData.proceso_solicitante || !headerData.tipo_solicitud || !headerData.sede_id) {
            Swal.fire('Error', 'Por favor complete los campos obligatorios del encabezado', 'warning');
            return;
        }

        if (items.length === 0) {
            Swal.fire('Error', 'Debe agregar al menos un item al pedido', 'warning');
            return;
        }

        if (!useStoredSignature && !signatureData) {
            Swal.fire('Error', 'Debe firmar el pedido o usar su firma guardada', 'warning');
            return;
        }

        if (useStoredSignature && !currentUser?.firma_digital) {
            Swal.fire('Error', 'No tiene una firma guardada en su perfil', 'error');
            return;
        }

        try {
            setLoading(true);

            let signatureFile = null;
            if (!useStoredSignature && signatureData) {
                // Convert signature to File
                signatureFile = dataURLtoFile(signatureData, 'firma_elaborado_por.png');
            }

            const payload = {
                ...headerData,
                elaborado_por: headerData.elaborado_por || currentUser?.id, // Ensure ID is present
                items: items,
                elaborado_por_firma: signatureFile,
                use_stored_signature: useStoredSignature
            };

            await cpPedidoService.create(payload);
            Swal.fire('Éxito', 'Pedido creado correctamente', 'success');
            navigate('/cp-pedidos');

            setHeaderData({
                proceso_solicitante: '',
                tipo_solicitud: '',
                observacion: '',
                sede_id: '',
                elaborado_por: '',
            });
            setItems([]);
            setSignatureData(null);
            setUseStoredSignature(false);

        } catch (error) {
            console.error("Error creating pedido:", error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error al crear el pedido';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-center border-b pb-4 mb-8">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Crear Pedido de Compra</h1>
            </div>

            {/* Information Guide */}
            {/* Information Guide - NexaCore Style */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Información sobre solicitudes</h3>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Unidad de medida:</h4>
                        <p className="text-gray-600 text-sm">Puede representarse en <span className="font-semibold text-gray-800">unidad</span> o <span className="font-semibold text-gray-800">paquete</span> según aplique.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Tipo de solicitud:</h4>

                        <div className="mb-4">
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded border border-green-200 mb-2">Prioritaria</span>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                <li>Para el proceso de farmacia se recibe la solicitud del pedido y se dará respuesta en un tiempo no mayor a 5 horas.</li>
                                <li>En los casos que requiera compra en otra ciudad se dará respuesta en un tiempo de 3 a 4 días hábiles.</li>
                                <li>Para los demás procesos se dará respuesta en 2 días hábiles.</li>
                            </ul>
                        </div>

                        <div>
                            <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded border border-orange-200 mb-2">Recurrente</span>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                <li>Para el proceso de farmacia el pedido mensual se recibe la solicitud del pedido y se dará respuesta de 1 a 5 días.</li>
                                <li>Para los demás procesos se reciben los 5 primeros días del mes para dar respuesta en un tiempo de 1 a 4 días hábiles.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-sm text-yellow-800">
                        <p><strong>Nota:</strong> En caso que el pedido requiera elaboración se dará respuesta en el tiempo que se determine con el proveedor para entrega de la compra previamente informado al proceso solicitante.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                {/* Header Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                        <BuildingOfficeIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-700">Información General</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                                Sede *
                            </label>
                            <select
                                name="sede_id"
                                value={headerData.sede_id}
                                onChange={handleHeaderChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Seleccione...</option>
                                {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <BriefcaseIcon className="h-4 w-4 mr-1 text-gray-400" />
                                Proceso Solicitante *
                            </label>
                            <select
                                name="proceso_solicitante"
                                value={headerData.proceso_solicitante}
                                onChange={handleHeaderChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Seleccione...</option>
                                {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                                Tipo Solicitud *
                            </label>
                            <select
                                name="tipo_solicitud"
                                value={headerData.tipo_solicitud}
                                onChange={handleHeaderChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Seleccione...</option>
                                {tipoSolicitudes.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                            </select>
                        </div>

                        {/* Elaborado Por field removed as per request - auto-filled from current user */}

                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-400" />
                                Observación
                            </label>
                            <textarea
                                name="observacion"
                                value={headerData.observacion}
                                onChange={handleHeaderChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <CpPedidoItemForm
                    items={items}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}
                    isFarmacia={dependencias.find(d => d.id == headerData.proceso_solicitante)?.nombre?.toUpperCase().includes('FARMACIA')}
                />

                {/* Signature Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <PencilSquareIcon className="h-5 w-5 text-indigo-500 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-700">Firma Elaborado Por *</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                {useStoredSignature ? 'Usando firma guardada' : 'Dibujar firma'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setUseStoredSignature(!useStoredSignature)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${useStoredSignature ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useStoredSignature ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                    </div>

                    {useStoredSignature ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white min-h-[160px]">
                            {currentUser?.firma_digital ? (
                                <div className="text-center">
                                    <img
                                        src={currentUser.firma_digital?.startsWith('http')
                                            ? currentUser.firma_digital
                                            : `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${currentUser.firma_digital}`
                                        }
                                        alt="Firma Guardada"
                                        className="h-24 object-contain mx-auto mb-2"
                                        onError={(e) => {
                                            console.error('Error loading signature:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <p className="text-sm text-green-600 font-medium">Firma guardada lista para usar</p>
                                    {/* Debug path */}
                                    {/* <p className="text-xs text-gray-400 mt-1">{currentUser.firma_digital}</p> */}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="mt-2 text-sm font-medium text-gray-900">No tienes una firma guardada</p>
                                    <p className="mt-1 text-sm text-gray-500">Por favor, dibuja tu firma o configura una en tu perfil.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <SignaturePad
                            onSave={setSignatureData}
                            buttonText="Firmar Documento"
                            title="Firma de Elaboración"
                        />
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-5">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                    >
                        <XMarkIcon className="h-5 w-5 mr-2" />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? (
                            <>Creando Pedido...</>
                        ) : (
                            <>
                                <CheckIcon className="h-5 w-5 mr-2" />
                                Crear Pedido
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
