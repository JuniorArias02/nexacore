import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';

export default function DependenciaProcesoSelect({ sedeId, dependenciaValue, procesoValue, onDependenciaChange, onProcesoChange }) {
    const [procesos, setProcesos] = useState([]);
    const [cpDependencias, setCpDependencias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sedeId) {
            loadCatalogs(sedeId);
        } else {
            setProcesos([]);
            setCpDependencias([]);
        }
    }, [sedeId]);

    const loadCatalogs = async (id) => {
        setLoading(true);
        try {
            const [procesosData, cpDependenciasData] = await Promise.all([
                inventoryService.getProcesos(id),
                inventoryService.getCpDependencias(id)
            ]);
            setProcesos(procesosData || []);
            setCpDependencias(cpDependenciasData || []);
        } catch (err) {
            console.error("Error loading catalogs:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Dependencia *</label>
                <select
                    name="dependencia"
                    required
                    value={dependenciaValue || ''}
                    onChange={(e) => {
                        const idx = e.target.selectedIndex;
                        const text = e.target.options[idx].text;
                        onDependenciaChange(text); // Passing text/name as requested
                    }}
                    disabled={!sedeId || loading}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm disabled:bg-gray-100"
                >
                    <option value="">{loading ? 'Cargando...' : 'Seleccionar Dependencia...'}</option>
                    {cpDependencias.map(d => (
                        <option key={d.id} value={d.nombre}>{d.nombre}</option>
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
