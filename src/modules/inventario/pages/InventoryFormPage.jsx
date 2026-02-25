import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { inventoryService } from '../services/inventoryService';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

import {
    CheckCircleIcon,
    XCircleIcon,
    ArrowLeftIcon,
    InformationCircleIcon,
    CurrencyDollarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

import BasicInfoTab from '../components/tabs/BasicInfoTab';
import FinancialInfoTab from '../components/tabs/FinancialInfoTab';
import AdditionalInfoTab from '../components/tabs/AdditionalInfoTab';

const InventoryFormPage = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');

    // Catalog Data
    const [centrosCosto, setCentrosCosto] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        dependencia: '',
        responsable: '',
        responsable_id: '',
        coordinador_id: '',
        coordinador_nombre: '', // For UI persistence
        marca: '',
        modelo: '',
        serial: '',
        proceso_id: '',
        sede_id: '',
        creado_por: user?.id,
        codigo_barras: '',
        num_factu: '',
        grupo: '',
        vida_util: '',
        vida_util_niff: '',
        centro_costo: '',
        ubicacion: '',
        proveedor: '',
        fecha_compra: '',
        soporte: '',
        soporte_adjunto: null,
        descripcion: '',
        estado: 'Nuevo',
        escritura: '',
        matricula: '',
        valor_compra: '',
        salvamenta: '',
        depreciacion: '',
        depreciacion_niif: '',
        meses: '',
        meses_niif: '',
        tipo_adquisicion: '03',
        calibrado: '',
        observaciones: '',
        cuenta_inventario: '',
        cuenta_gasto: '',
        cuenta_salida: '',
        grupo_activos: '',
        valor_actual: '',
        depreciacion_acumulada: '',
        tipo_bien: '',
        tiene_accesorio: 'No',
        descripcion_accesorio: ''
    });

    // File Preview
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        loadCatalogs();
    }, []);

    useEffect(() => {
        if (id) {
            loadInventory(id);
        }
    }, [id]);

    const loadInventory = async (inventoryId) => {
        setLoading(true);
        try {
            const data = await inventoryService.getInventarioById(inventoryId);
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    ...data,
                    estado: data.estado || 'Nuevo',
                    tipo_adquisicion: data.tipo_adquisicion || '03',
                    tiene_accesorio: data.tiene_accesorio || 'No'
                }));
                if (data.soporte_adjunto) {
                    setFilePreview({ name: 'Archivo Adjunto Existente', size: 'N/A' });
                }
            }
        } catch (err) {
            console.error("Error loading inventory:", err);
            setError("Error al cargar los datos del inventario.");
            Swal.fire('Error', 'No se pudo cargar la información del inventario.', 'error');
            navigate('/inventario');
        } finally {
            setLoading(false);
        }
    };

    const loadCatalogs = async () => {
        try {
            const centrosData = await inventoryService.getCentrosCosto();
            setCentrosCosto(centrosData || []);
        } catch (err) {
            console.error("Error loading catalogs:", err);
            setError("Error cargando catálogos iniciales.");
        }
    };

    useEffect(() => {
        if (user?.id && !id) {
            setFormData(prev => ({ ...prev, creado_por: user.id }));
        }
    }, [user, id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            setFilePreview(file ? { name: file.name, size: (file.size / 1024).toFixed(2) + ' KB' } : null);
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked ? 'Si' : 'No' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const dataToSend = {
            ...formData,
            creado_por: formData.creado_por || user?.id
        };

        try {
            if (id) {
                await inventoryService.updateInventario(id, dataToSend);
                setSuccess(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Inventario Actualizado',
                    text: 'El item se ha actualizado correctamente.',
                    timer: 2000
                });
            } else {
                await inventoryService.createInventario(dataToSend);
                setSuccess(true);
                setFormData(prev => ({
                    ...prev,
                    codigo: '',
                    nombre: '',
                    serial: ''
                }));
                setFilePreview(null);
                window.scrollTo(0, 0);
                Swal.fire({
                    icon: 'success',
                    title: 'Inventario Creado',
                    text: 'El item se ha registrado correctamente.',
                    timer: 2000
                });
                setActiveTab('basic');
            }
        } catch (err) {
            console.error('Error completo:', err);
            let errorMessage = id ? 'Error al actualizar el inventario.' : 'Error al crear el inventario. Verifique los campos.';
            if (err.response?.data) {
                const data = err.response.data;
                if (data.mensaje || data.message) errorMessage = data.mensaje || data.message;
                if (data.errors) {
                    const errorList = Object.entries(data.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('\n');
                    errorMessage = `Errores de validación:\n${errorList}`;
                }
            }
            Swal.fire({
                icon: 'error',
                title: id ? 'Error al actualizar' : 'Error al crear',
                text: errorMessage,
                confirmButtonColor: '#d33'
            });
            setError(errorMessage);
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', name: 'Información Básica', icon: InformationCircleIcon },
        { id: 'financial', name: 'Información Financiera', icon: CurrencyDollarIcon },
        { id: 'additional', name: 'Información Adicional', icon: DocumentTextIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in-up">
            <div className="max-w-6xl mx-auto">
                {/* Hero Header Pattern */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                    <div className="relative z-10">
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                            INVENTARIO
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                            {id ? 'Editar Activo' : 'Nuevo Registro'}
                        </h1>
                        <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                            {id ? `Modificando detalles del activo "${formData.nombre}"` : 'Complete los campos para registrar un nuevo activo en el sistema.'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-start mb-8">
                    <button
                        onClick={() => navigate('/inventario')}
                        className="group flex items-center px-4 py-2 text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Regresar al Listado</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-8 rounded-[2rem] bg-red-50 p-6 shadow-xl border border-red-100 animate-fade-in">
                        <div className="flex">
                            <XCircleIcon className="h-6 w-6 text-red-400 mr-3" aria-hidden="true" />
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-red-800">Error detectado</h3>
                                <p className="mt-1 text-sm text-red-700 whitespace-pre-wrap">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form Container */}
                <div className="bg-white shadow-2xl rounded-[3rem] border border-slate-100 overflow-hidden transition-all hover:shadow-indigo-100/50">
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50 p-4 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-1 ring-indigo-500'
                                    : 'bg-white text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12">
                        {/* Tab Content */}
                        <div className="min-h-[400px]">
                            {activeTab === 'basic' && (
                                <BasicInfoTab
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSelectChange={handleSelectChange}
                                    setFormData={setFormData}
                                />
                            )}
                            {activeTab === 'financial' && (
                                <FinancialInfoTab
                                    formData={formData}
                                    handleChange={handleChange}
                                    centrosCosto={centrosCosto}
                                />
                            )}
                            {activeTab === 'additional' && (
                                <AdditionalInfoTab
                                    formData={formData}
                                    handleChange={handleChange}
                                    filePreview={filePreview}
                                />
                            )}
                        </div>

                        {/* Form Footer Actions */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-end gap-x-6">
                            <button
                                type="button"
                                onClick={() => navigate('/inventario')}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-200 hover:translate-y-[-2px] transition-all hover:shadow-2xl active:scale-95 ${loading ? 'opacity-70 cursor-wait' : ''
                                    }`}
                            >
                                {loading ? 'Procesando...' : (id ? 'Actualizar Activo' : 'Registrar Inventario')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InventoryFormPage;
