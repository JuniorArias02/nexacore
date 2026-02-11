import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';

export default function SedeSelect({ value, onChange, label = "Sede *" }) {
    const [sedes, setSedes] = useState([]);

    useEffect(() => {
        const loadSedes = async () => {
            try {
                const data = await inventoryService.getSedes();
                setSedes(data || []);
            } catch (error) {
                console.error("Error loading sedes:", error);
            }
        };
        loadSedes();
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <select
                name="sede_id"
                required
                value={value}
                onChange={onChange}
                className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            >
                <option value="">Seleccionar Sede...</option>
                {sedes.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
            </select>
        </div>
    );
}
