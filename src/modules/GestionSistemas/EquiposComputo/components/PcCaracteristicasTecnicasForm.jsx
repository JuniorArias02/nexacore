import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import pcCaracteristicasTecnicasService from '../services/pcCaracteristicasTecnicasService';
import InventorySearchSelect from './InventorySearchSelect';
import { CpuChipIcon, ServerStackIcon, SpeakerWaveIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';

export default function PcCaracteristicasTecnicasForm({ equipoId }) {
    const [formData, setFormData] = useState({
        procesador: '',
        memoria_ram: '',
        disco_duro: '',
        capacidad_disco: '',
        tarjeta_video: '',
        tarjeta_red: '',
        velocidad_red: '',
        internet: '',
        tarjeta_sonido: '',
        usb: '',
        unidad_cd: '',
        drive: '',
        parlantes: '',
        monitor: '',
        monitor_id: '',
        teclado: '',
        teclado_id: '',
        mouse: '',
        mouse_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (equipoId) {
            loadData();
        }
    }, [equipoId]);

    const loadData = async () => {
        try {
            setInitialLoading(true);
            const response = await pcCaracteristicasTecnicasService.getByEquipoId(equipoId);
            if (response && response.objeto) {
                setFormData(response.objeto);
            }
        } catch (error) {
            console.log('No tech specs found or error', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInventorySelect = (fieldPrefix, item) => {
        setFormData(prev => ({
            ...prev,
            [`${fieldPrefix}_id`]: item ? item.id : '',
            [fieldPrefix]: item ? `${item.nombre} - ${item.marca} (${item.serial})` : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await pcCaracteristicasTecnicasService.updateByEquipoId(equipoId, formData);
            Swal.fire('Éxito', 'Características técnicas guardadas correctamente', 'success');
        } catch (error) {
            console.error('Error saving specs:', error);
            Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                <p className="text-slate-500 font-medium text-sm animate-pulse">Cargando características...</p>
            </div>
        );
    }

    const renderInput = (label, name, type = 'text', placeholder = '', colSpan = 1) => (
        <div className={`group ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-100"
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="relative bg-white rounded-3xl overflow-hidden">
            <div className="p-4 md:p-8 space-y-10">
                
                {/* Procesamiento y Almacenamiento */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <CpuChipIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Procesamiento y Almacenamiento</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {renderInput('Procesador', 'procesador', 'text', 'Ej: Intel Core i5')}
                        {renderInput('Memoria RAM', 'memoria_ram', 'text', 'Ej: 8GB DDR4')}
                        {renderInput('Disco Duro', 'disco_duro', 'text', 'Ej: Kingston SSD')}
                        {renderInput('Capacidad', 'capacidad_disco', 'text', 'Ej: 500GB')}
                    </div>
                </div>

                {/* Multimedia y Red */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <SpeakerWaveIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Multimedia y Red</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderInput('Tarjeta de Video', 'tarjeta_video', 'text', 'Ej: NVIDIA GeForce')}
                        {renderInput('Tarjeta de Red', 'tarjeta_red', 'text', 'Ej: Realtek PCIe')}
                        {renderInput('Velocidad Red', 'velocidad_red', 'text', 'Ej: 100/1000 Mbps')}
                        {renderInput('Internet', 'internet', 'text', 'Ej: Wifi / Ethernet')}
                        {renderInput('Tarjeta de Sonido', 'tarjeta_sonido', 'text', 'Ej: Realtek High Definition')}
                        {renderInput('Parlantes', 'parlantes', 'text', 'Ej: Genéricos')}
                    </div>
                </div>

                {/* Puertos y Periféricos */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                            <ServerStackIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Puertos y Lectores</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderInput('Puertos USB', 'usb', 'text', 'Ej: 2.0 / 3.0')}
                        {renderInput('Unidad CD/DVD', 'unidad_cd', 'text', 'Ej: LG DVD-RW')}
                        {renderInput('Lector de Tarjetas', 'drive', 'text', 'Ej: Multi-card reader')}
                    </div>
                </div>

                {/* Componentes Externos (Inventario) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
                            <SquaresPlusIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Dispositivos Externos (Inventario)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Monitor</label>
                            <InventorySearchSelect
                                value={formData.monitor_id}
                                onChange={(item) => handleInventorySelect('monitor', item)}
                                placeholder="Buscar monitor..."
                            />
                            {formData.monitor && (
                                <p className="mt-2 ml-1 text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded-md">
                                    ✓ {formData.monitor}
                                </p>
                            )}
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Teclado</label>
                            <InventorySearchSelect
                                value={formData.teclado_id}
                                onChange={(item) => handleInventorySelect('teclado', item)}
                                placeholder="Buscar teclado..."
                            />
                            {formData.teclado && (
                                <p className="mt-2 ml-1 text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded-md">
                                    ✓ {formData.teclado}
                                </p>
                            )}
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Mouse</label>
                            <InventorySearchSelect
                                value={formData.mouse_id}
                                onChange={(item) => handleInventorySelect('mouse', item)}
                                placeholder="Buscar mouse..."
                            />
                            {formData.mouse && (
                                <p className="mt-2 ml-1 text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded-md">
                                    ✓ {formData.mouse}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Formulario */}
            <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                    }`}
                >
                    {loading ? 'Guardando...' : 'Guardar Características'}
                </button>
            </div>
        </form>
    );
}
