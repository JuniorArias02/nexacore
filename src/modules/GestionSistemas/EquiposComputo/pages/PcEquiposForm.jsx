import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import pcEquiposService from '../services/pcEquiposService';
import PcCaracteristicasTecnicasForm from '../components/PcCaracteristicasTecnicasForm';
import PcEquipoGeneralTab from '../components/PcEquipoGeneralTab';
import PcEquipoImagenTab from '../components/PcEquipoImagenTab';
import PcLicenciasForm from '../components/PcLicenciasForm';

import api from '../../../../services/api';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function PcEquiposForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    // Searchable Personal State
    const [personalSearch, setPersonalSearch] = useState('');
    const [personalResults, setPersonalResults] = useState([]);
    const [showPersonalResults, setShowPersonalResults] = useState(false);

    // Image Upload State
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Dropdown Data
    const [sedes, setSedes] = useState([]);
    const [areas, setAreas] = useState([]);

    const [formData, setFormData] = useState({
        nombre_equipo: '',
        tipo: '',
        marca: '',
        modelo: '',
        serial: '',
        numero_inventario: '',
        sede_id: '',
        area_id: '',
        responsable_id: '',
        estado: 'operativo',
        propiedad: 'empresa',
        ip_fija: '',
        fecha_ingreso: '',
        fecha_entrega: '',
        garantia_meses: '',
        forma_adquisicion: 'compra',
        descripcion_general: '',
        observaciones: '',
        repuestos_principales: '',
        recomendaciones: '',
        equipos_adicionales: ''
    });

    useEffect(() => {
        loadCatalogs();
        if (isEditMode) {
            loadEquipo(id);
        }
    }, [id]);

    const loadCatalogs = async () => {
        try {
            const sedesRes = await api.get('/sedes');
            setSedes(sedesRes.data.objeto || sedesRes.data || []);
        } catch (error) {
            console.error('Error loading catalogs', error);
        }
    };

    const loadEquipo = async (equipoId) => {
        try {
            setInitialLoading(true);
            const response = await pcEquiposService.getById(equipoId);
            if (response && response.objeto) {
                setFormData(response.objeto);
                
                if (response.objeto.responsable) {
                    setPersonalSearch(response.objeto.responsable.nombre);
                }

                if (response.objeto.sede_id) {
                    loadAreas(response.objeto.sede_id);
                }

                if (response.objeto.imagen_url) {
                    if (response.objeto.imagen_url.startsWith('http')) {
                        setPreviewUrl(response.objeto.imagen_url);
                    } else {
                        setPreviewUrl(`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${response.objeto.imagen_url}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading equipo:', error);
            const errorMsg = error.response?.data?.mensaje || error.response?.data?.message || 'No se pudo cargar el equipo';
            Swal.fire('Error', errorMsg, 'error').then(() => {
                navigate('/gestion-sistemas/pc-equipos');
            });
        } finally {
            setInitialLoading(false);
        }
    };

    const loadAreas = async (sedeId) => {
        if (!sedeId) {
            setAreas([]);
            return;
        }
        try {
            const response = await api.get('/areas', {
                params: { sede_id: sedeId }
            });
            const allAreas = response.data.objeto || response.data || [];
            setAreas(allAreas);
        } catch (error) {
            console.error('Error loading areas', error);
        }
    };

    const handlePersonalSearch = async (query) => {
        setPersonalSearch(query);
        if (query.length < 2) {
            setPersonalResults([]);
            setShowPersonalResults(false);
            return;
        }

        try {
            const response = await api.get('/personal/buscar', {
                params: { termino: query }
            });
            const results = response.data.objeto || response.data || [];
            setPersonalResults(results.slice(0, 8));
            setShowPersonalResults(true);
        } catch (error) {
            console.error('Error searching personal:', error);
        }
    };

    const selectPersonal = (p) => {
        setFormData(prev => ({ ...prev, responsable_id: p.id }));
        setPersonalSearch(p.nombre);
        setShowPersonalResults(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'sede_id') {
                newData.area_id = '';
            }
            return newData;
        });

        if (name === 'sede_id') {
            loadAreas(value);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            Swal.fire('Atención', 'Selecciona una imagen primero', 'warning');
            return;
        }

        try {
            const uploadData = new FormData();
            uploadData.append('imagen', imageFile);
            uploadData.append('_method', 'PUT');

            setLoading(true);
            await api.post(`/gestion-sistemas/pc-equipos/${id}`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire('Éxito', 'Imagen actualizada correctamente', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.mensaje || 'No se pudo subir la imagen';
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await pcEquiposService.update(id, formData);
                Swal.fire('Actualizado', 'Equipo actualizado correctamente', 'success');
            } else {
                const response = await pcEquiposService.create(formData);
                const newId = response.objeto?.id || response.id;
                Swal.fire({
                    title: 'Creado',
                    text: 'Equipo creado. Ahora puedes agregar las características técnicas.',
                    icon: 'success',
                    confirmButtonText: 'Ir a Características'
                }).then(() => {
                    navigate(`/gestion-sistemas/pc-equipos/editar/${newId}`);
                    setActiveTab('caracteristicas');
                });
            }
        } catch (error) {
            console.error('Error saving equipo:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.mensaje || 'No se pudo guardar el equipo';
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Cargando datos del equipo...</p>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto p-4 md:p-8 animate-fade-in-up">
            
            {/* Hero Header NexaCore Premium */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
                        MÓDULO DE SISTEMAS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                        {isEditMode ? 'Gestión de Equipo' : 'Nuevo Equipo'}
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
                        {isEditMode 
                            ? 'Actualiza la información, características, licencias e imagen del dispositivo de cómputo en el inventario.'
                            : 'Registra un nuevo dispositivo de cómputo para comenzar a rastrear su ciclo de vida y mantenimientos.'}
                    </p>
                </div>
                {/* Icono Decorativo Flotante */}
                <ComputerDesktopIcon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            {/* Tabs Premium */}
            <div className="flex overflow-x-auto hide-scrollbar mb-8 pb-2 space-x-2">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === 'general'
                            ? 'bg-slate-800 text-white shadow-lg shadow-slate-300'
                            : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200'
                    }`}
                >
                    Información General
                </button>
                <button
                    onClick={() => {
                        if (!isEditMode) {
                            Swal.fire('Atención', 'Debes guardar la información general primero', 'warning');
                            return;
                        }
                        setActiveTab('caracteristicas');
                    }}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === 'caracteristicas'
                            ? 'bg-slate-800 text-white shadow-lg shadow-slate-300'
                            : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200'
                    } ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Características Técnicas
                </button>
                <button
                    onClick={() => {
                        if (!isEditMode) {
                            Swal.fire('Atención', 'Debes guardar la información general primero', 'warning');
                            return;
                        }
                        setActiveTab('licencias');
                    }}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === 'licencias'
                            ? 'bg-slate-800 text-white shadow-lg shadow-slate-300'
                            : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200'
                    } ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Licencias Software
                </button>
                <button
                    onClick={() => {
                        if (!isEditMode) {
                            Swal.fire('Atención', 'Debes guardar la información general primero', 'warning');
                            return;
                        }
                        setActiveTab('imagen');
                    }}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === 'imagen'
                            ? 'bg-slate-800 text-white shadow-lg shadow-slate-300'
                            : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200'
                    } ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Imagen del Equipo
                </button>
            </div>

            {/* Tab Contents */}
            <div className="animate-fade-in-up">
                <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                    <PcEquipoGeneralTab
                        formData={formData}
                        handleChange={handleChange}
                        sedes={sedes}
                        areas={areas}
                        personalSearch={personalSearch}
                        handlePersonalSearch={handlePersonalSearch}
                        showPersonalResults={showPersonalResults}
                        personalResults={personalResults}
                        selectPersonal={selectPersonal}
                        setPersonalSearch={setPersonalSearch}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        isEditMode={isEditMode}
                        navigate={navigate}
                    />
                </div>

                {isEditMode && (
                    <div className={activeTab === 'caracteristicas' ? 'block' : 'hidden'}>
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500"></div>
                            <PcCaracteristicasTecnicasForm equipoId={id} />
                        </div>
                    </div>
                )}

                {isEditMode && (
                    <div className={activeTab === 'licencias' ? 'block' : 'hidden'}>
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-green-500"></div>
                            <PcLicenciasForm equipoId={id} />
                        </div>
                    </div>
                )}

                {isEditMode && (
                    <div className={activeTab === 'imagen' ? 'block' : 'hidden'}>
                        <PcEquipoImagenTab
                            previewUrl={previewUrl}
                            handleImageChange={handleImageChange}
                            handleImageUpload={handleImageUpload}
                            imageFile={imageFile}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

