import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { entregaActivosFijosService } from '../services/entregaActivosFijosService';
import { personalService } from '../../../Configuracion/Personal/services/personalService';
import { sedeService } from '../../../Configuracion/Sede/services/sedeService';
import { dependenciaSedeService } from '../../../Configuracion/DependenciaSede/services/dependenciaSedeService';
import { inventarioService } from '../../Inventario/services/inventarioService';
import { authService } from '../../../Autenticacion/services/authService';
import SignaturePad from '../../../Firmas/components/SignaturePad';
import SearchableSelect from '../../../../components/SearchableSelect';

export default function EntregaActivosFijosForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isEditing = !!id;
    const isUpdatingSignature = location.pathname.includes('/actualizar-firma');
    const [submitMode, setSubmitMode] = useState('');
    const submitModeRef = useRef('');
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
            navigate('/gestion-compras/entrega-activos-fijos');
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

            const currentSubmitMode = submitModeRef.current;

            if (isUpdatingSignature || currentSubmitMode === 'update') {
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

            navigate('/gestion-compras/entrega-activos-fijos');
        } catch (error) {
            console.error('Error creating entrega:', error);
            Swal.fire('Error', error.response?.data?.mensaje || 'Error al guardar la entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto p-6 lg:p-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        ACTIVOS FIJOS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        {isUpdatingSignature ? 'Actualizar Firma' : (isEditing ? 'Nueva Versión' : 'Nueva Entrega')}
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        {isUpdatingSignature 
                            ? 'Actualice las firmas de este acta y guarde los cambios.' 
                            : (isEditing ? 'Revise los datos y el inventario actualizado antes de generar la nueva acta.' : 'Complete el formulario para registrar una nueva entrega')
                        }
                    </p>
                </div>
                {/* Decorativo */}
                <svg className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                </svg>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Información General</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SearchableSelect
                                label="Sede"
                                options={sedes}
                                value={formData.sede_id}
                                onChange={(value) => setFormData({ ...formData, sede_id: value })}
                                placeholder="Seleccione sede..."
                            />
                        </div>

                        <div className={!formData.sede_id ? "opacity-60 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                            <SearchableSelect
                                label="Proceso Solicitante"
                                options={filteredDependencias}
                                value={formData.proceso_solicitante}
                                onChange={(value) => setFormData({ ...formData, proceso_solicitante: value })}
                                placeholder={formData.sede_id ? 'Seleccione proceso...' : 'Seleccione sede primero...'}
                            />
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
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Fecha de Entrega *
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_entrega}
                                onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 text-slate-700 font-medium"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-slate-100 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Items de Inventario</h2>
                        </div>
                        <button
                            type="button"
                            onClick={fetchInventarioItems}
                            disabled={loadingItems || !formData.personal_id || !formData.coordinador_id}
                            className="inline-flex items-center px-6 py-2.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-100 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
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
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">#</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Código</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nombre</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Marca</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Modelo</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Serial</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tiene Accesorio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-50">
                                        {inventarioItems.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors duration-200">
                                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.codigo}</td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{item.nombre || item.nombre_activo}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.marca || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.modelo || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.serial || item.serial_inventario || '-'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {item.tiene_accesorio === 'Si' ? (
                                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-black uppercase tracking-wider rounded-full">Sí</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200/50 text-[10px] font-black uppercase tracking-wider rounded-full">No</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Seleccione un personal y coordinador para ver los items de inventario
                            </p>
                        </div>
                    )}
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-100 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-violet-50 rounded-2xl text-violet-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Quien Entrega</h2>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 py-2 px-4 rounded-2xl border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
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

                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-100 gap-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-fuchsia-50 rounded-2xl text-fuchsia-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Quien Recibe</h2>
                            </div>
                        </div>
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
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/gestion-compras/entrega-activos-fijos')}
                        className="px-8 py-3 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 shadow-sm"
                    >
                        Cancelar
                    </button>
                    {isEditing && !isUpdatingSignature && (
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => {
                                setSubmitMode('update');
                                submitModeRef.current = 'update';
                            }}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 shadow-lg shadow-emerald-200 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            {loading && submitMode === 'update' ? 'Actualizando...' : 'Actualizar Acta Actual'}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={() => {
                            setSubmitMode('create');
                            submitModeRef.current = 'create';
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 shadow-lg shadow-indigo-200 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        {loading && submitMode === 'create' ? 'Guardando...' : (isUpdatingSignature ? 'Actualizar Acta' : (isEditing ? 'Generar Nueva Acta' : 'Guardar Entrega'))}
                    </button>
                </div>
            </form>
        </div>
    );
}
