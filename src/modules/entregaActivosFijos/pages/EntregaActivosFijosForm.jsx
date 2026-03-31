import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { entregaActivosFijosService } from '../services/entregaActivosFijosService';
import { personalService } from '../../personal/services/personalService';
import { sedeService } from '../../users/services/sedeService';
import { dependenciaSedeService } from '../../dependenciaSede/services/dependenciaSedeService';
import { inventarioService } from '../../inventario/services/inventarioService';
import { authService } from '../../auth/services/authService';
import SignaturePad from '../../signatures/components/SignaturePad';
import SearchableSelect from '../../../components/SearchableSelect';

export default function EntregaActivosFijosForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isEditing = !!id;
    const isUpdatingSignature = location.pathname.includes('/actualizar-firma');
    const [submitMode, setSubmitMode] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [personal, setPersonal] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [dependencias, setDependencias] = useState([]);
    const [filteredDependencias, setFilteredDependencias] = useState([]);
    const [inventarioItems, setInventarioItems] = useState([]);

    const [formData, setFormData] = useState({
        personal_id: '',
        sede_id: '',
        proceso_solicitante: '',
        coordinador_id: '',
        fecha_entrega: new Date().toISOString().split('T')[0],
    });

    const [firmaEntrega, setFirmaEntrega] = useState(null);
    const [firmaRecibe, setFirmaRecibe] = useState(null);
    const [existingFirmaEntrega, setExistingFirmaEntrega] = useState(null);
    const [existingFirmaRecibe, setExistingFirmaRecibe] = useState(null);

    const [useStoredSignatureEntrega, setUseStoredSignatureEntrega] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        loadDependencies();
        loadCurrentUser();
        if (id) {
            loadEntrega(id);
        }
    }, [id]);

    const loadCurrentUser = async () => {
        try {
            const response = await authService.me();
            const user = response.objeto || response;
            setCurrentUser(user);
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    // Filter dependencias based on selected Sede
    useEffect(() => {
        if (formData.sede_id) {
            const filtered = dependencias.filter(d => d.sede_id == formData.sede_id);
            setFilteredDependencias(filtered);

            // Clear selected proceso if it doesn't belong to the new sede
            if (formData.proceso_solicitante) {
                const currentProceso = dependencias.find(d => d.id == formData.proceso_solicitante);
                if (currentProceso && currentProceso.sede_id != formData.sede_id) {
                    setFormData(prev => ({ ...prev, proceso_solicitante: '' }));
                }
            }
        } else {
            setFilteredDependencias([]);
        }
    }, [formData.sede_id, dependencias]);

    // Auto-fetch inventory when both personal and coordinador are selected, BUT ONLY IF NOT EDITING
    useEffect(() => {
        if (!isEditing && formData.personal_id && formData.coordinador_id) {
            fetchInventarioItems();
        } else if (!isEditing) {
            setInventarioItems([]);
        }
    }, [formData.personal_id, formData.coordinador_id, isEditing]);

    const loadDependencies = async () => {
        try {
            const [personalData, sedesData, dependenciasData] = await Promise.all([
                personalService.getAll(),
                sedeService.getAll(),
                dependenciaSedeService.getAll()
            ]);

            // Safely handle responses - extract data if wrapped in response object
            const cleanPersonal = Array.isArray(personalData) ? personalData : (personalData?.objeto || personalData?.data || []);
            console.log('Personal Data Loaded:', cleanPersonal);
            setPersonal(cleanPersonal);

            setSedes(Array.isArray(sedesData) ? sedesData : (sedesData?.objeto || sedesData?.data || []));
            setDependencias(Array.isArray(dependenciasData) ? dependenciasData : (dependenciasData?.objeto || dependenciasData?.data || []));
        } catch (error) {
            console.error('Error loading dependencies:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos necesarios', 'error');
        }
    };

    // Async search for personal — triggers Kubapp fallback on backend
    const handleSearchPersonal = useCallback(async (query, externalSearch = false) => {
        try {
            const results = await personalService.search(query, externalSearch);
            const arr = Array.isArray(results) ? results : [];
            // Merge new results into the personal state so they persist in the dropdown
            setPersonal(prev => {
                const map = new Map(prev.map(p => [String(p.id), p]));
                arr.forEach(p => map.set(String(p.id), p));
                return [...map.values()];
            });
            return arr;
        } catch (error) {
            console.error('Error searching personal:', error);
            return [];
        }
    }, []);

    // ... existing functions ...

    const fetchInventarioItems = async () => {
        try {
            setLoadingItems(true);
            const response = await inventarioService.getByResponsableAndCoordinador(
                formData.personal_id,
                formData.coordinador_id
            );

            const items = response.objeto || [];
            setInventarioItems(items);

            if (items.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin items',
                    text: 'No se encontraron items de inventario para este personal y coordinador',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: `${items.length} items encontrados`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            console.error('Error fetching inventario:', error);
            // Better error message
            Swal.fire({
                icon: 'info',
                title: 'Sin items',
                text: 'No hay items de inventario asignados a este personal y coordinador',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            setInventarioItems([]);
        } finally {
            setLoadingItems(false);
        }
    };

    const loadEntrega = async (id) => {
        try {
            setLoading(true);
            const response = await entregaActivosFijosService.getById(id);
            const entrega = response.objeto;
            console.log('Entrega Loaded:', entrega);

            if (entrega) {
                setFormData({
                    personal_id: entrega.personal_id,
                    sede_id: entrega.sede_id,
                    proceso_solicitante: entrega.proceso_solicitante?.id || entrega.proceso_solicitante, // Handle object or ID
                    coordinador_id: entrega.coordinador_id,
                    fecha_entrega: entrega.fecha_entrega ? entrega.fecha_entrega.split('T')[0] : '', // Ensure YYYY-MM-DD
                });

                // Map items
                if (entrega.items) {
                    const items = entrega.items.map(item => ({
                        ...item.inventario, // detailed info
                        item_id: item.item_id, // keep tracking via item_id
                        unique_id: item.id, // relationship id
                        tiene_accesorio: item.es_accesorio ? 'Si' : 'No',
                        descripcion_accesorio: item.accesorio_descripcion
                    }));
                    setInventarioItems(items);
                }

                // Handle existing signatures
                setExistingFirmaEntrega(entrega.firma_quien_entrega);
                setExistingFirmaRecibe(entrega.firma_quien_recibe);
            }
        } catch (error) {
            console.error('Error loading entrega:', error);
            Swal.fire('Error', 'No se pudo cargar la entrega', 'error');
            navigate('/entrega-activos-fijos');
        } finally {
            setLoading(false);
        }
    };

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inventarioItems.length === 0) {
            Swal.fire('Error', 'No hay items de inventario para entregar. Seleccione un personal y coordinador que tengan items asignados.', 'error');
            return;
        }


        // Frontend Validation for Signatures
        if (!useStoredSignatureEntrega && !firmaEntrega && !existingFirmaEntrega) {
            Swal.fire('Error', 'La firma de quien entrega es requerida.', 'error');
            return;
        }

        if (!firmaRecibe && !existingFirmaRecibe) {
            Swal.fire('Error', 'La firma de quien recibe es requerida sí o sí.', 'error');
            return;
        }

        try {
            setLoading(true);

            // Prepare items for submission
            const items = inventarioItems.map(item => ({
                item_id: item.item_id || item.id, // Handle both cases
                es_accesorio: item.tiene_accesorio === 'Si' ? 1 : 0,
                accesorio_descripcion: item.descripcion_accesorio || ''
            }));

            const data = {
                ...formData,
                items,
                use_stored_signature_entrega: useStoredSignatureEntrega ? 1 : 0,
                firma_quien_entrega: (!useStoredSignatureEntrega && firmaEntrega) ? dataURLtoFile(firmaEntrega, 'firma_entrega.png') : null,
                firma_quien_recibe: firmaRecibe ? dataURLtoFile(firmaRecibe, 'firma_recibe.png') : null
            };

            if (isUpdatingSignature || submitMode === 'update') {
                await entregaActivosFijosService.update(id, data);
                Swal.fire({
                    icon: 'success',
                    title: 'Acta actualizada exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                // We always create a new record now, as requested
                await entregaActivosFijosService.create(data);

                Swal.fire({
                    icon: 'success',
                    title: 'Entrega generada exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            navigate('/entrega-activos-fijos');
        } catch (error) {
            console.error('Error creating entrega:', error);
            Swal.fire('Error', error.response?.data?.mensaje || 'Error al guardar la entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    {isUpdatingSignature ? 'Actualizar Firma del Acta' : (isEditing ? 'Nueva Versión (Desde Plantilla)' : 'Nueva Entrega')} de Activos Fijos
                </h1>
                <p className="text-gray-600 mt-2">
                    {isUpdatingSignature 
                        ? 'Actualice las firmas de este acta y guarde los cambios.' 
                        : (isEditing ? 'Revise los datos y el inventario actualizado antes de generar la nueva acta.' : 'Complete el formulario para registrar una nueva entrega')
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Información General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <SearchableSelect
                                label="Personal (Quien Recibe)"
                                options={personal}
                                value={formData.personal_id}
                                onChange={(value) => setFormData({ ...formData, personal_id: value })}
                                placeholder="Buscar personal (APELLIDOS NOMBRE)..."
                                onSearch={handleSearchPersonal}
                                uppercase
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sede *
                            </label>
                            <select
                                value={formData.sede_id}
                                onChange={(e) => setFormData({ ...formData, sede_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Seleccione sede</option>
                                {sedes.map((s) => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Proceso Solicitante *
                            </label>
                            <select
                                value={formData.proceso_solicitante}
                                onChange={(e) => setFormData({ ...formData, proceso_solicitante: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                disabled={!formData.sede_id}
                            >
                                <option value="">{formData.sede_id ? 'Seleccione proceso' : 'Seleccione sede primero'}</option>
                                {filteredDependencias.map((d) => (
                                    <option key={d.id} value={d.id}>{d.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <SearchableSelect
                                label="Coordinador"
                                options={personal}
                                value={formData.coordinador_id}
                                onChange={(value) => setFormData({ ...formData, coordinador_id: value })}
                                placeholder="Buscar coordinador (APELLIDOS NOMBRE)..."
                                onSearch={handleSearchPersonal}
                                uppercase
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Entrega *
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_entrega}
                                onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h2 className="text-xl font-semibold text-gray-700">Items de Inventario</h2>
                        <button
                            type="button"
                            onClick={fetchInventarioItems}
                            disabled={loadingItems || !formData.personal_id || !formData.coordinador_id}
                            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className={`-ml-1 mr-2 h-4 w-4 ${loadingItems ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar Inventario
                        </button>
                    </div>

                    {loadingItems ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="mt-2 text-gray-600">Cargando items...</p>
                        </div>
                    ) : inventarioItems.length > 0 ? (
                        <div>
                            <p className="text-sm text-gray-600 mb-4">
                                Se encontraron <span className="font-semibold text-indigo-600">{inventarioItems.length}</span> items asignados a este personal y coordinador.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tiene Accesorio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {inventarioItems.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.codigo}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{item.nombre || item.nombre_activo}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{item.marca || '-'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{item.modelo || '-'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{item.serial || item.serial_inventario || '-'}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    {item.tiene_accesorio === 'Si' ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sí</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">No</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                                Seleccione un personal y coordinador para ver los items de inventario
                            </p>
                        </div>
                    )}
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <h2 className="text-xl font-semibold text-gray-700">Firma Quien Entrega</h2>
                            <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-200">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {useStoredSignatureEntrega ? 'Usando firma guardada' : 'Dibujar firma'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setUseStoredSignatureEntrega(!useStoredSignatureEntrega)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 shadow-sm ${useStoredSignatureEntrega ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useStoredSignatureEntrega ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>

                        {existingFirmaEntrega && !firmaEntrega && !useStoredSignatureEntrega && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual guardada en el acta:</p>
                                <img
                                    src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${existingFirmaEntrega}`}
                                    alt="Firma Entrega Actual"
                                    className="h-32 border border-gray-200 rounded bg-white p-2 object-contain"
                                    onError={(e) => {
                                        if(!e.target.src.includes(existingFirmaEntrega) && existingFirmaEntrega.startsWith('http')) {
                                            e.target.src = existingFirmaEntrega;
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {useStoredSignatureEntrega ? (
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
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="mt-2 text-sm font-medium text-gray-900">No tienes una firma guardada</p>
                                        <p className="mt-1 text-sm text-gray-500">Por favor, personaliza tu firma en tu perfil.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <SignaturePad
                                onSave={setFirmaEntrega}
                                buttonText={existingFirmaEntrega ? "Reemplazar Firma" : "Firmar Entrega"}
                                title="Firma de Quien Entrega"
                            />
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Firma Quien Recibe</h2>
                        {existingFirmaRecibe && !firmaRecibe && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual guardada en el acta:</p>
                                <img
                                    src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}/${existingFirmaRecibe}`}
                                    alt="Firma Recibe Actual"
                                    className="h-32 border border-gray-200 rounded bg-white p-2 object-contain"
                                    onError={(e) => {
                                        if(!e.target.src.includes(existingFirmaRecibe) && existingFirmaRecibe.startsWith('http')) {
                                            e.target.src = existingFirmaRecibe;
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <SignaturePad
                            onSave={setFirmaRecibe}
                            buttonText={existingFirmaRecibe ? "Reemplazar Firma" : "Firmar Recepción"}
                            title="Firma de Quien Recibe"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/entrega-activos-fijos')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                    >
                        Cancelar
                    </button>
                    {isEditing && !isUpdatingSignature && (
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => setSubmitMode('update')}
                            className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && submitMode === 'update' ? 'Actualizando...' : 'Actualizar Acta Actual'}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={() => setSubmitMode('create')}
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && submitMode === 'create' ? 'Guardando...' : (isUpdatingSignature ? 'Actualizar Acta' : (isEditing ? 'Generar Nueva Acta' : 'Guardar Entrega'))}
                    </button>
                </div>
            </form>
        </div>
    );
}
