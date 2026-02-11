import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { inventoryService } from '../services/inventoryService';

import {
    PhotoIcon,
    DocumentArrowUpIcon,
    CheckCircleIcon,
    XCircleIcon,
    BuildingOfficeIcon,
    TagIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import ProductSearch from '../components/search/ProductSearch';
import PersonalSearch from '../components/search/PersonalSearch';
import SedeSelect from '../components/search/SedeSelect';
import DependenciaProcesoSelect from '../components/search/DependenciaProcesoSelect';

const InventoryFormPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Catalog Data
    const [centrosCosto, setCentrosCosto] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        dependencia: '', // Text fallback or name
        responsable: '', // Text fallback
        responsable_id: '',
        coordinador_id: '',
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
        estado: 'Nuevo', // Default
        escritura: '',
        matricula: '',
        valor_compra: '',
        salvamenta: '',
        depreciacion: '',
        depreciacion_niif: '',
        meses: '',
        meses_niif: '',
        tipo_adquisicion: '03', // Fixed as requested
        calibrado: '',
        observaciones: '',
        cuenta_inventario: '',
        cuenta_gasto: '',
        cuenta_salida: '',
        grupo_activos: '',
        valor_actual: '',
        depreciacion_acumulada: '',
        tipo_bien: '',
        tiene_accesorio: 'No', // Default
        descripcion_accesorio: ''
    });

    // File Preview
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        loadCatalogs();
    }, []);

    // Load Centros Costo on mount
    const loadCatalogs = async () => {
        try {
            const centrosData = await inventoryService.getCentrosCosto();
            setCentrosCosto(centrosData || []);
        } catch (err) {
            console.error("Error loading catalogs:", err);
            setError("Error cargando catálogos iniciales.");
        }
    };

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

        try {
            await inventoryService.createInventario(formData);
            setSuccess(true);
            window.scrollTo(0, 0);
            // Optionally reset form
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al crear el inventario. Verifique los campos.");
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-3 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                            Crear Nuevo Inventario
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Complete el formulario para registrar un nuevo activo en el sistema NexaCore.
                        </p>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 rounded-md bg-green-50 p-4 shadow-sm border border-green-100 animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Operación exitosa</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>El item de inventario se ha creado correctamente.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 shadow-sm border border-red-100 animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error en el registro</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

                    {/* Sección 1: Información Básica */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                            <TagIcon className="h-6 w-6 text-indigo-500" />
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Información del Producto</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="col-span-full sm:col-span-2">
                                <ProductSearch
                                    value={formData.codigo}
                                    onChange={(option) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            nombre: option.nombre,
                                            codigo: option.codigo_producto
                                        }));
                                    }}
                                />
                                <input type="hidden" name="nombre" value={formData.nombre} />
                            </div>

                            <div>
                                <label htmlFor="codigo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Código Activo
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="codigo"
                                        id="codigo"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="marca" className="block text-sm font-medium leading-6 text-gray-900">Marca</label>
                                <input type="text" name="marca" id="marca" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label htmlFor="modelo" className="block text-sm font-medium leading-6 text-gray-900">Modelo</label>
                                <input type="text" name="modelo" id="modelo" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label htmlFor="serial" className="block text-sm font-medium leading-6 text-gray-900">Serial</label>
                                <input type="text" name="serial" id="serial" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label htmlFor="grupo" className="block text-sm font-medium leading-6 text-gray-900">Grupo *</label>
                                <select name="grupo" required onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm">
                                    <option value="">Seleccionar...</option>
                                    <option value="EC">EC</option>
                                    <option value="ME">ME</option>
                                    <option value="MAQ">MAQ</option>
                                    <option value="IMC">IMC</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="estado" className="block text-sm font-medium leading-6 text-gray-900">Estado *</label>
                                <select name="estado" required value={formData.estado} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm">
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Buen Estado">Buen Estado</option>
                                    <option value="Regular">Regular</option>
                                    <option value="Malo">Malo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Ubicación y Responsables */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                            <BuildingOfficeIcon className="h-6 w-6 text-indigo-500" />
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Ubicación y Responsables</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-1">
                                <PersonalSearch
                                    label="Responsable *"
                                    value={formData.responsable_id}
                                    onChange={(opt) => setFormData(prev => ({ ...prev, responsable_id: opt.id, responsable: opt.nombre }))}
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <PersonalSearch
                                    label="Coordinador"
                                    placeholder="Buscar coordinador..."
                                    value={formData.coordinador_id}
                                    onChange={(opt) => setFormData(prev => ({ ...prev, coordinador_id: opt.id }))}
                                />
                            </div>

                            <div>
                                <SedeSelect
                                    value={formData.sede_id}
                                    onChange={handleChange}
                                />
                            </div>

                            <DependenciaProcesoSelect
                                sedeId={formData.sede_id}
                                dependenciaValue={formData.dependencia}
                                procesoValue={formData.proceso_id}
                                onDependenciaChange={(text) => setFormData(prev => ({ ...prev, dependencia: text }))}
                                onProcesoChange={handleChange}
                            />

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Centro de Costo</label>
                                <select
                                    name="centro_costo"
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                                >
                                    <option value="">Seleccionar...</option>
                                    {centrosCosto.map(c => (
                                        <option key={c.id} value={c.codigo}>{c.codigo} - {c.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Ubicación Física</label>
                                <input type="text" name="ubicacion" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Datos Financieros y Adquisición */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                            <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" />
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Financiero y Adquisición</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Tipo Adquisición *</label>
                                <select
                                    name="tipo_adquisicion"
                                    value={formData.tipo_adquisicion}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-gray-50"
                                    required
                                >
                                    <option value="03">03 - Compra</option>
                                    <option value="01">01 - Donación</option>
                                    <option value="02">02 - Comodato</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Número Factura</label>
                                <input type="text" name="num_factu" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Fecha Compra</label>
                                <input type="date" name="fecha_compra" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Proveedor</label>
                                <input type="text" name="proveedor" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Valor Compra</label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input type="number" name="valor_compra" onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 pl-7 pr-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" placeholder="0.00" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Valor Actual</label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input type="number" name="valor_actual" onChange={handleChange} className="block w-full rounded-md border-0 py-2.5 pl-7 pr-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" placeholder="0.00" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Salvamento</label>
                                <input type="text" name="salvamenta" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Vida Útil *</label>
                                <select name="vida_util" onChange={handleChange} required className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm">
                                    <option value="">Seleccionar...</option>
                                    <option value="12">12 Meses</option>
                                    <option value="60">60 Meses</option>
                                    <option value="120">120 Meses</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Vida Útil NIIF</label>
                                <select name="vida_util_niff" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm">
                                    <option value="">Seleccionar...</option>
                                    <option value="12">12 Meses</option>
                                    <option value="60">60 Meses</option>
                                    <option value="120">120 Meses</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Meses Depreciación</label>
                                <input type="number" name="meses" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Meses Depr. NIIF</label>
                                <input type="number" name="meses_niif" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Depreciación</label>
                                <input type="number" name="depreciacion" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Depreciación NIIF</label>
                                <input type="number" name="depreciacion_niif" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Depreciación Acumulada</label>
                                <input type="number" name="depreciacion_acumulada" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Contabilidad */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                            <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-500" />
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Información Contable</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Cuenta Inventario</label>
                                <input type="number" name="cuenta_inventario" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Cuenta Gasto</label>
                                <input type="number" name="cuenta_gasto" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Cuenta Salida</label>
                                <input type="number" name="cuenta_salida" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Grupo Activos</label>
                                <input type="text" name="grupo_activos" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Tipo Bien</label>
                                <input type="text" name="tipo_bien" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 5: Detalles Legales y Otros */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                            <DocumentArrowUpIcon className="h-6 w-6 text-indigo-500" />
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Legal y Otros</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Escritura</label>
                                <input type="text" name="escritura" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Matrícula</label>
                                <input type="text" name="matricula" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Soporte (Texto/Link)</label>
                                <input type="text" name="soporte" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" placeholder="Ref. soporte físico o enlace" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Código Barras</label>
                                <input type="text" name="codigo_barras" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Calibrado (Fecha)</label>
                                <input type="date" name="calibrado" onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Observaciones</label>
                                <textarea name="observaciones" rows={3} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Descripción General</label>
                                <textarea name="descripcion" rows={3} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Accesorios y Adjuntos */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
                            <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-500" />
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Detalles Adicionales</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="tiene_accesorio"
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <span className="text-sm font-medium text-gray-900">¿Tiene Accesorios?</span>
                                </label>
                            </div>

                            {formData.tiene_accesorio === 'Si' && (
                                <div className="col-span-full sm:col-span-2 animate-fade-in-down">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Descripción de Accesorios</label>
                                    <textarea
                                        name="descripcion_accesorio"
                                        rows={3}
                                        onChange={handleChange}
                                        className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                                        placeholder="Liste los accesorios incluidos..."
                                    />
                                </div>
                            )}

                            <div className="col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Soporte Adjunto (PDF) *</label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 bg-gray-50 hover:bg-indigo-50/50 transition-colors">
                                    <div className="text-center">
                                        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 px-2"
                                            >
                                                <span>Subir un archivo</span>
                                                <input id="file-upload" name="soporte_adjunto" type="file" className="sr-only" accept="application/pdf" onChange={handleChange} required />
                                            </label>
                                            <p className="pl-1">o arrastrar y soltar</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PDF hasta 10MB</p>
                                        {filePreview && (
                                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-indigo-600 bg-indigo-50 py-1 px-3 rounded-full">
                                                <CheckCircleIcon className="h-4 w-4" />
                                                <span>{filePreview.name} ({filePreview.size})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`rounded-md bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? 'Guardando...' : 'Crear Inventario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryFormPage;
