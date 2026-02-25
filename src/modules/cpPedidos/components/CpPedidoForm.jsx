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

export default function CpPedidoForm({ initialData = null }) {
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

    // Load initial data for editing
    useEffect(() => {
        if (initialData) {
            setHeaderData({
                proceso_solicitante: initialData.proceso_solicitante || '',
                tipo_solicitud: initialData.tipo_solicitud || '',
                observacion: initialData.observacion || '',
                sede_id: initialData.sede_id || '',
                elaborado_por: initialData.elaborado_por || '',
            });
            setItems(initialData.items || []);
            // For editing, we might want to default to drawing signature if they want to change it,
            // or we just don't touch signatureData unless they draw/upload a new one.
        }
    }, [initialData]);

    const loadCurrentUser = async () => {
        try {
            const response = await authService.me();
            // Handle response wrapper if present
            const user = response.objeto || response;
            setCurrentUser(user);

            // Auto-set elaborado_por only if not editing
            if (!initialData && user && user.id) {
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
        try {
            const [tipos, sed] = await Promise.all([
                cpTipoSolicitudService.getAll(),
                sedeService.getAll(),
                // dependenciaSedeService.getAll() // No longer load all on mount
            ]);
            if (tipos && tipos.objeto) setTipoSolicitudes(tipos.objeto);
            if (sed) setSedes(sed);
            // if (deps && deps.objeto) setDependencias(deps.objeto);
            // else if (Array.isArray(deps)) setDependencias(deps);

        } catch (error) {
            console.error("Error loading dependencies:", error);
            Swal.fire('Error', 'No se pudieron cargar las dependencias iniciales', 'error');
        }
    };

    // Effect to load dependencies when sede changes
    useEffect(() => {
        const loadDependenciasPorSede = async () => {
            if (!headerData.sede_id) {
                setDependencias([]);
                return;
            }

            try {
                const deps = await dependenciaSedeService.getAll({ sede_id: headerData.sede_id });
                if (deps && deps.objeto) setDependencias(deps.objeto);
                else if (Array.isArray(deps)) setDependencias(deps);
            } catch (error) {
                console.error("Error loading dependencias for sede:", error);
                setDependencias([]);
            }
        };

        loadDependenciasPorSede();

        // If not initial data loading, reset proceso_solicitante when sede changes
        if (!initialData || (initialData && initialData.sede_id !== headerData.sede_id)) {
            setHeaderData(prev => ({
                ...prev,
                proceso_solicitante: ''
            }));
        }
    }, [headerData.sede_id]);

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

        if (!headerData.proceso_solicitante || !headerData.tipo_solicitud || !headerData.sede_id || !headerData.observacion) {
            Swal.fire('Error', 'Por favor complete los campos obligatorios del encabezado (incluyendo observación)', 'warning');
            return;
        }

        if (items.length === 0) {
            Swal.fire('Error', 'Debe agregar al menos un item al pedido', 'warning');
            return;
        }

        if (!initialData) {
            if (!useStoredSignature && !signatureData) {
                Swal.fire('Error', 'Debe firmar el pedido o usar su firma guardada', 'warning');
                return;
            }

            if (useStoredSignature && !currentUser?.firma_digital) {
                Swal.fire('Error', 'No tiene una firma guardada en su perfil', 'error');
                return;
            }
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

            if (initialData) {
                await cpPedidoService.update(initialData.id, payload);
                Swal.fire('Éxito', 'Pedido actualizado correctamente', 'success');
            } else {
                await cpPedidoService.create(payload);
                Swal.fire('Éxito', 'Pedido creado correctamente', 'success');
            }

            navigate('/cp-pedidos');

            if (!initialData) {
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
            }

        } catch (error) {
            console.error("Error saving pedido:", error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error al guardar el pedido';
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

            {/* Information Guide - NexaCore Style */}


            <form onSubmit={handleSubmit} className="space-y-8">
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
                                disabled={!headerData.sede_id}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!headerData.sede_id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                <option value="">{headerData.sede_id ? 'Seleccione...' : 'Primero seleccione una sede'}</option>
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


                    </div>
                </div>

                {/* Items Section */}
                <CpPedidoItemForm
                    items={items}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}
                    isFarmacia={dependencias.find(d => d.id == headerData.proceso_solicitante)?.nombre?.toUpperCase().includes('FARMACIA')}
                />


                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                        <DocumentTextIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-700">Observaciones del Pedido</h2>
                    </div>
                    <div className="relative">
                        <textarea
                            name="observacion"
                            value={headerData.observacion}
                            onChange={handleHeaderChange}
                            rows={4}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 bg-white transition-all duration-200"
                            placeholder="Escriba aquí los detalles adicionales, justificaciones o notas importantes para este pedido..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            Campo obligatorio *
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                            <ClockIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Guía de Tiempos y Solicitudes</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3 shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-700 text-lg mb-1">Unidad de Medida</h4>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        Puede representarse en <span className="text-indigo-600 font-semibold italic">Unidad</span> o <span className="text-indigo-600 font-semibold italic">Paquete</span> según aplique a su proceso.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-green-100 shadow-sm">
                                <div className="flex items-center mb-3">
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Prioritaria
                                    </span>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-1.5 mr-3 shrink-0"></div>
                                        <span><strong className="text-gray-700">Farmacia:</strong> Se recibe la solicitud y se dará respuesta en un tiempo no mayor a <span className="font-semibold text-green-700">5 horas</span>.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-1.5 mr-3 shrink-0"></div>
                                        <span><strong className="text-gray-700">Compras Nacionales:</strong> En casos que requiera compra en otra ciudad, la respuesta será de <span className="font-semibold text-green-700">3 a 4 días hábiles</span>.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-1.5 mr-3 shrink-0"></div>
                                        <span><strong className="text-gray-700">Otros Procesos:</strong> Se dará respuesta en <span className="font-semibold text-green-700">2 días hábiles</span>.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-lg border border-orange-100 shadow-sm">
                                <div className="flex items-center mb-3">
                                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Recurrente
                                    </span>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-1.5 mr-3 shrink-0"></div>
                                        <span><strong className="text-gray-700">Farmacia:</strong> El pedido mensual recibe respuesta en un tiempo de <span className="font-semibold text-orange-700">1 a 5 días</span>.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-1.5 mr-3 shrink-0"></div>
                                        <span><strong className="text-gray-700">General:</strong> Se reciben los 5 primeros días del mes para dar respuesta en <span className="font-semibold text-orange-700">1 a 4 días hábiles</span>.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-inner">
                                <p className="text-sm text-amber-900 leading-relaxed">
                                    <span className="font-bold flex items-center mb-1 text-amber-800">
                                        <DocumentTextIcon className="h-4 w-4 mr-1" /> Nota Importante:
                                    </span>
                                    En caso que el pedido requiera elaboración, se dará respuesta en el tiempo determinado con el proveedor, previamente informado al proceso solicitante.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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
