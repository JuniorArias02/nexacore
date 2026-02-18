import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';

export default function DependenciaProcesoSelect({ sedeId, dependenciaValue, procesoValue, onDependenciaChange, onProcesoChange }) {
    const [procesos, setProcesos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAreas();
    }, []);

    useEffect(() => {
        if (sedeId) {
            loadProcesos(sedeId);
        } else {
            setProcesos([]);
        }
    }, [sedeId]);

    const loadAreas = async () => {
        setLoading(true);
        try {
            const areasData = await inventoryService.getAreas();
            setAreas(areasData || []);
        } catch (err) {
            console.error("Error loading areas:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadProcesos = async (id) => {
        setLoading(true);
        try {
            const procesosData = await inventoryService.getProcesos(id);
            setProcesos(procesosData || []);
        } catch (err) {
            console.error("Error loading procesos:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Dependencia (Área) *</label>
                <select
                    name="dependencia"
                    required
                    value={dependenciaValue || ''}
                    onChange={(e) => {
                        const idx = e.target.selectedIndex;
                        const text = e.target.options[idx].text;
                        onDependenciaChange(text); // Passing text/name as requested
                    }}
                    disabled={loading}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm disabled:bg-gray-100"
                >
                    <option value="">{loading ? 'Cargando...' : 'Seleccionar Área...'}</option>
                    {areas.map(a => (
                        <option key={a.id} value={a.nombre}>{a.nombre}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Proceso *</label>
                <select
                    name="proceso_id"
                    required
                    value={procesoValue || ''}
                    onChange={onProcesoChange}
                    disabled={!sedeId || loading}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm disabled:bg-gray-100"
                >
                    <option value="">{loading ? 'Cargando...' : 'Seleccionar Proceso...'}</option>
                    {procesos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </select>
            </div>
        </>
    );
}
