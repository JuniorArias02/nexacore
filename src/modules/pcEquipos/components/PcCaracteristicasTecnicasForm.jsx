
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import pcCaracteristicasTecnicasService from '../services/pcCaracteristicasTecnicasService';
import InventorySearchSelect from './InventorySearchSelect';

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
        return <div className="text-center py-4">Cargando características...</div>;
    }

    const renderInput = (label, name, type = 'text', placeholder = '', colSpan = 1) => (
        <div className={colSpan > 1 ? `md: col - span - ${colSpan} ` : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-3 pb-2 border-b border-gray-200 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Procesamiento y Almacenamiento</h3>
                </div>
                {renderInput('Procesador', 'procesador', 'text', 'Ej: Intel Core i5')}
                {renderInput('Memoria RAM', 'memoria_ram', 'text', 'Ej: 8GB DDR4')}
                {renderInput('Disco Duro (Marca/Tipo)', 'disco_duro', 'text', 'Ej: Kingston SSD')}
                {renderInput('Capacidad Disco', 'capacidad_disco', 'text', 'Ej: 500GB')}

                <div className="md:col-span-3 pb-2 border-b border-gray-200 mb-2 mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Multimedia y Red</h3>
                </div>
                {renderInput('Tarjeta de Video', 'tarjeta_video', 'text', 'Ej: NVIDIA GeForce')}
                {renderInput('Tarjeta de Red', 'tarjeta_red', 'text', 'Ej: Realtek PCIe')}
                {renderInput('Velocidad Red', 'velocidad_red', 'text', 'Ej: 100/1000 Mbps')}
                {renderInput('Internet', 'internet', 'text', 'Ej: Wifi / Ethernet')}
                {renderInput('Tarjeta de Sonido', 'tarjeta_sonido', 'text', 'Ej: Realtek High Definition')}
                {renderInput('Parlantes', 'parlantes', 'text', 'Ej: Genéricos')}

                <div className="md:col-span-3 pb-2 border-b border-gray-200 mb-2 mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Puertos y Periféricos</h3>
                </div>
                {renderInput('Puertos USB', 'usb', 'text', 'Ej: 2.0 / 3.0')}
                {renderInput('Unidad CD/DVD', 'unidad_cd', 'text', 'Ej: LG DVD-RW')}
                {renderInput('Drive/Lector Tarjetas', 'drive', 'text', 'Ej: Multi-card reader')}

                <div className="md:col-span-3 pb-2 border-b border-gray-200 mb-2 mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Periféricos de Entrada/Salida</h3>
                </div>

                {/* Custom Search Selects for Inventory Linked Items */}
                <div className="relative">
                    {/* Reuse renderInput logic just for display if we wanted, but we use custom component */}
                    <div className="mb-2">
                        {/* Show current text value if we want to confirm what is saved */}
                        {/* But the component handles search. We can pass existing name to it? */}
                        {/* In InventorySearchSelect, I relied on 'value' which is ID. */}
                        {/* To show the name correctly on load, I need to pass the name. */}
                        {/* Let's update InventorySearchSelect to accept 'initialText' or use 'value' as object? */}
                        {/* Or just handle it here: if I have a name, I show it. */}
                        {/* Actually, let's create a wrapper that manages the display. */}
                    </div>
                    <InventorySearchSelect
                        label="Monitor (Buscar Inventario)"
                        value={formData.monitor_id}
                        onChange={(item) => handleInventorySelect('monitor', item)}
                        placeholder="Buscar monitor..."
                    />
                    <div className="mt-2">
                        <label className="text-xs text-gray-500">Valor actual: {formData.monitor || 'Ninguno'}</label>
                    </div>
                </div>

                <div className="relative">
                    <InventorySearchSelect
                        label="Teclado (Buscar Inventario)"
                        value={formData.teclado_id}
                        onChange={(item) => handleInventorySelect('teclado', item)}
                        placeholder="Buscar teclado..."
                    />
                    <div className="mt-2">
                        <label className="text-xs text-gray-500">Valor actual: {formData.teclado || 'Ninguno'}</label>
                    </div>
                </div>

                <div className="relative">
                    <InventorySearchSelect
                        label="Mouse (Buscar Inventario)"
                        value={formData.mouse_id}
                        onChange={(item) => handleInventorySelect('mouse', item)}
                        placeholder="Buscar mouse..."
                    />
                    <div className="mt-2">
                        <label className="text-xs text-gray-500">Valor actual: {formData.mouse || 'Ninguno'}</label>
                    </div>
                </div>

            </div>

            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px - 6 py - 2 bg - indigo - 600 text - white font - medium rounded - lg shadow hover: bg - indigo - 700 focus: outline - none focus: ring - 2 focus: ring - offset - 2 focus: ring - indigo - 500 transition - colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        } `}
                >
                    {loading ? 'Guardando...' : 'Guardar Características'}
                </button>
            </div>
        </form>
    );
}
