import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcDevueltoService from '../services/pcDevueltoService';
import pcEntregasService from '../../pcEntregas/services/pcEntregasService'; // Need to fetch deliveries
import SignaturePad from '../../signatures/components/SignaturePad';

export default function PcDevueltoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        entrega_id: '',
        fecha_devolucion: new Date().toISOString().split('T')[0],
        observaciones: '',
        firma_entrega: '', // User returning
        firma_recibe: '' // Admin receiving
    });

    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Signatures
    const [firmaEntrega, setFirmaEntrega] = useState(null);
    const [firmaRecibe, setFirmaRecibe] = useState(null);
    const [existingFirmaEntrega, setExistingFirmaEntrega] = useState(null);
    const [existingFirmaRecibe, setExistingFirmaRecibe] = useState(null);

    useEffect(() => {
        loadEntregas();
        if (isEditMode) {
            loadDevuelto();
        }
    }, [id]);

    const loadEntregas = async () => {
        try {
            const data = await pcEntregasService.getAll();
            // Filter only active deliveries? Or show all?
            // Usually we want to return something that is currently "entregado"
            // But for simplicity, list all. Ideally filter by state='entregado'
            setEntregas(data || []);
        } catch (error) {
            console.error('Error loading entregas:', error);
        }
    };

    const loadDevuelto = async () => {
        try {
            setLoading(true);
            const data = await pcDevueltoService.getById(id);
            if (data) {
                setFormData({
                    entrega_id: data.entrega_id,
                    fecha_devolucion: data.fecha_devolucion ? data.fecha_devolucion.split('T')[0] : '', // Adjust format
                    observaciones: data.observaciones || '',
                });
                setExistingFirmaEntrega(data.firma_entrega);
                setExistingFirmaRecibe(data.firma_recibe);
            }
        } catch (error) {
            console.error('Error loading devuelto:', error);
            Swal.fire('Error', 'No se pudo cargar la devolución', 'error');
            navigate('/pc-devueltos');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.entrega_id) {
            Swal.fire('Error', 'Debe seleccionar una entrega', 'error');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };

            // Should add validation for signatures if new
            if (!isEditMode && (!firmaEntrega || !firmaRecibe)) {
                // Optional: enforce signatures?
            }

            if (firmaEntrega) payload.firma_entrega = firmaEntrega;
            if (firmaRecibe) payload.firma_recibe = firmaRecibe;

            if (isEditMode) {
                await pcDevueltoService.update(id, payload);
                Swal.fire('Éxito', 'Devolución actualizada correctamente', 'success');
            } else {
                await pcDevueltoService.create(payload);
                Swal.fire('Éxito', 'Devolución registrada correctamente', 'success');
            }
            navigate('/pc-devueltos');
        } catch (error) {
            console.error('Error saving devuelto:', error);
            Swal.fire('Error', 'No se pudo guardar la devolución', 'error');
        } finally {
            setLoading(false);
        }
    };

    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? 'Editar Devolución' : 'Nueva Devolución'}</h1>
                <p className="text-gray-600 mt-2">Registre la devolución de un equipo entregado</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">

                {/* Entrega Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entrega (Equipo - Funcionario) *</label>
                    <select
                        name="entrega_id"
                        value={formData.entrega_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                        disabled={isEditMode} // Usually shouldn't change the delivery item in edit
                    >
                        <option value="">Seleccione una entrega</option>
                        {entregas.map(entrega => (
                            <option key={entrega.id} value={entrega.id}>
                                {entrega.equipo?.nombre_equipo} ({entrega.equipo?.serial}) - {entrega.funcionario?.nombres} {entrega.funcionario?.apellidos}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fecha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Devolución *</label>
                    <input
                        type="date"
                        name="fecha_devolucion"
                        value={formData.fecha_devolucion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Observaciones */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3">Firma Quien Devuelve (Funcionario)</h3>
                        {existingFirmaEntrega && !firmaEntrega && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual:</p>
                                <img
                                    src={`${apiUrl}/${existingFirmaEntrega}`}
                                    alt="Firma Entrega Actual"
                                    className="h-24 border border-gray-200 rounded bg-white p-2"
                                />
                            </div>
                        )}
                        <SignaturePad
                            onSave={setFirmaEntrega}
                            buttonText={existingFirmaEntrega ? "Cambiar Firma" : "Firmar Devolución"}
                            title="Firma de Quien Devuelve"
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3">Firma Quien Recibe (Sistemas)</h3>
                        {existingFirmaRecibe && !firmaRecibe && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual:</p>
                                <img
                                    src={`${apiUrl}/${existingFirmaRecibe}`}
                                    alt="Firma Recibe Actual"
                                    className="h-24 border border-gray-200 rounded bg-white p-2"
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

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/pc-devueltos')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Devolución' : 'Guardar Devolución')}
                    </button>
                </div>

            </form>
        </div>
    );
}
