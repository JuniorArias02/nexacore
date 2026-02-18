import { useState } from 'react';
import Swal from 'sweetalert2';

export default function EntregaItemForm({ onAddItem }) {
    const [item, setItem] = useState({
        item_id: '',
        es_accesorio: false,
        accesorio_descripcion: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!item.item_id) {
            Swal.fire('Error', 'Debe seleccionar un item de inventario', 'error');
            return;
        }

        onAddItem({
            ...item,
            item_id: parseInt(item.item_id)
        });

        // Reset form
        setItem({
            item_id: '',
            es_accesorio: false,
            accesorio_descripcion: ''
        });
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Item Inventario *
                    </label>
                    <input
                        type="number"
                        value={item.item_id}
                        onChange={(e) => setItem({ ...item, item_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="ID del item"
                        required
                    />
                </div>

                <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={item.es_accesorio}
                            onChange={(e) => setItem({ ...item, es_accesorio: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Es Accesorio</span>
                    </label>
                </div>

                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción Accesorio
                    </label>
                    <input
                        type="text"
                        value={item.accesorio_descripcion}
                        onChange={(e) => setItem({ ...item, accesorio_descripcion: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Descripción"
                        disabled={!item.es_accesorio}
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    >
                        Agregar Item
                    </button>
                </div>
            </div>
        </div>
    );
}
