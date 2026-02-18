import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEntregasService from '../services/pcEntregasService';
import PersonalSearchSelect from '../components/PersonalSearchSelect';
import EquipoSearchSelect from '../components/EquipoSearchSelect';
import SignaturePad from '../../signatures/components/SignaturePad';

export default function PcEntregasForm({ equipoId: propEquipoId, onCancel: propOnCancel, onSuccess: propOnSuccess }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        equipo_id: propEquipoId || '',
        funcionario_id: '',
        funcionario_nombre: '', // For display
        fecha_entrega: new Date().toISOString().split('T')[0],
        devuelto: '',
        estado: 'entregado',
    });
    const [loading, setLoading] = useState(false);

    // Signature State
    const [firmaEntrega, setFirmaEntrega] = useState(null); // New signature
    const [firmaRecibe, setFirmaRecibe] = useState(null); // New signature
    const [existingFirmaEntrega, setExistingFirmaEntrega] = useState(null); // URL from DB
    const [existingFirmaRecibe, setExistingFirmaRecibe] = useState(null); // URL from DB

    useEffect(() => {
        if (isEditMode) {
            loadEntrega();
        }
    }, [id]);

    const loadEntrega = async () => {
        try {
            setLoading(true);
            const data = await pcEntregasService.getById(id);
            if (data) {
                setFormData({
                    equipo_id: data.equipo_id,
                    funcionario_id: data.funcionario_id,
                    funcionario_nombre: data.funcionario ? `${data.funcionario.nombres} ${data.funcionario.apellidos} ` : '',
                    fecha_entrega: data.fecha_entrega,
                    devuelto: data.devuelto || '',
                    estado: data.estado,
                });

                // Set existing signatures
                setExistingFirmaEntrega(data.firma_entrega);
                setExistingFirmaRecibe(data.firma_recibe);
            }
        } catch (error) {
            console.error('Error loading entrega', error);
            Swal.fire('Error', 'No se pudo cargar la entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEquipoSelect = (item) => {
        if (item) {
            setFormData(prev => ({
                ...prev,
                equipo_id: item.id
            }));
        } else {
            setFormData(prev => ({ ...prev, equipo_id: '' }));
        }
    };

    const handlePersonalSelect = (item) => {
        setFormData(prev => ({
            ...prev,
            funcionario_id: item ? item.id : '',
            funcionario_nombre: item ? item.nombre : ''
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.funcionario_id) {
            Swal.fire('Error', 'Debe seleccionar un funcionario', 'error');
            return;
        }

        if (!formData.equipo_id) {
            Swal.fire('Error', 'Debe seleccionar un equipo', 'error');
            return;
        }

        setLoading(true);
        try {
            // Only send signatures if they are new (not null)
            const payload = {
                ...formData,
            };

            if (firmaEntrega) {
                payload.firma_entrega = firmaEntrega;
            }

            if (firmaRecibe) {
                payload.firma_recibe = firmaRecibe;
            }

            if (isEditMode) {
                await pcEntregasService.update(id, payload);
                Swal.fire('Éxito', 'Entrega actualizada correctamente', 'success');
            } else {
                await pcEntregasService.create(payload);
                Swal.fire('Éxito', 'Entrega registrada correctamente', 'success');
            }

            if (propOnSuccess) {
                propOnSuccess();
            } else {
                navigate('/pc-entregas');
            }
        } catch (error) {
            console.error('Error saving entrega:', error);
            Swal.fire('Error', 'No se pudo guardar la entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onCancel = propOnCancel || (() => navigate('/pc-entregas'));
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{isEditMode ? 'Editar Entrega de Equipo' : 'Nueva Entrega de Equipo'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <EquipoSearchSelect
                        label="Equipo a Entregar"
                        value={formData.equipo_id}
                        onChange={handleEquipoSelect}
                        disabled={!!propEquipoId}
                    />
                </div>

                <div className="md:col-span-2">
                    <PersonalSearchSelect
                        label="Funcionario (Recibe)"
                        value={formData.funcionario_id}
                        onChange={handlePersonalSelect}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Entrega</label>
                    <input
                        type="date"
                        name="fecha_entrega"
                        value={formData.fecha_entrega}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="entregado">Entregado</option>
                        <option value="devuelto">Devuelto</option>
                    </select>
                </div>

                {formData.estado === 'devuelto' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Devolución</label>
                        <input
                            type="date"
                            name="devuelto"
                            value={formData.devuelto}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                )}

                {/* Signatures */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Firma Entrega (Sistemas)</h2>
                        {existingFirmaEntrega && !firmaEntrega && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual:</p>
                                <img
                                    src={`${apiUrl}/${existingFirmaEntrega}`}
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
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Firma Recibe (Funcionario)</h2>
                        {existingFirmaRecibe && !firmaRecibe && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Firma actual:</p>
                                <img
                                    src={`${apiUrl}/${existingFirmaRecibe}`}
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
            </div>

            <div className="mt-8 flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Entrega' : 'Guardar Entrega')}
                </button>
            </div>
        </form>
    );
}
