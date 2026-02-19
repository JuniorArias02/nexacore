import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { entregaActivosFijosService } from '../services/entregaActivosFijosService';
import { personalService } from '../../personal/services/personalService';
import { sedeService } from '../../users/services/sedeService';
import { dependenciaSedeService } from '../../dependenciaSede/services/dependenciaSedeService';
import { inventarioService } from '../../inventario/services/inventarioService';
import SignaturePad from '../../signatures/components/SignaturePad';
import SearchableSelect from '../../../components/SearchableSelect';

export default function EntregaActivosFijosForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
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

    useEffect(() => {
        loadDependencies();
        if (id) {
            loadEntrega(id);
        }
    }, [id]);

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
                firma_quien_entrega: firmaEntrega ? dataURLtoFile(firmaEntrega, 'firma_entrega.png') : null,
                firma_quien_recibe: firmaRecibe ? dataURLtoFile(firmaRecibe, 'firma_recibe.png') : null
            };

            if (isEditing) {
                await entregaActivosFijosService.update(id, data);
            } else {
                await entregaActivosFijosService.create(data);
            }

            Swal.fire({
                icon: 'success',
                title: isEditing ? 'Entrega actualizada exitosamente' : 'Entrega creada exitosamente',
                showConfirmButton: false,
                timer: 1500
            });

            navigate('/entrega-activos-fijos');
        } catch (error) {
            console.error('Error creating/updating entrega:', error);
            Swal.fire('Error', error.response?.data?.mensaje || 'Error al guardar la entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Editar Entrega' : 'Nueva Entrega'} de Activos Fijos</h1>
                <p className="text-gray-600 mt-2">Complete el formulario para registrar una nueva entrega</p>
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
                                placeholder="Buscar personal..."
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
                                placeholder="Buscar coordinador..."
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
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Items de Inventario</h2>

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
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Firma Quien Entrega</h2>
                        {existingFirmaEntrega && !firmaEntrega && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual:</p>
                                <img
                                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${existingFirmaEntrega}`}
                                    alt="Firma Entrega Actual"
                                    className="h-32 border border-gray-200 rounded bg-white p-2"
                                />
                            </div>
                        )}
                        <SignaturePad
                            onSave={setFirmaEntrega}
                            buttonText={existingFirmaEntrega ? "Cambiar Firma" : "Firmar Entrega"}
                            title="Firma de Quien Entrega"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Firma Quien Recibe</h2>
                        {existingFirmaRecibe && !firmaRecibe && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual:</p>
                                <img
                                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${existingFirmaRecibe}`}
                                    alt="Firma Recibe Actual"
                                    className="h-32 border border-gray-200 rounded bg-white p-2"
                                />
                            </div>
                        )}
                        <SignaturePad
                            onSave={setFirmaRecibe}
                            buttonText={existingFirmaRecibe ? "Cambiar Firma" : "Firmar Recepción"}
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar Entrega' : 'Guardar Entrega')}
                    </button>
                </div>
            </form>
        </div>
    );
}
