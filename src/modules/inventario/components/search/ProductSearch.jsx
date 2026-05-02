import { useCallback } from 'react';
import { inventoryService } from '../../services/inventoryService';
import SearchableSelect from '../SearchableSelect';

export default function ProductSearch({ value, onChange, label = "Nombre del Producto *", initialOption }) {
    const handleSearch = useCallback(async (query) => {
        if (!query) return [];
        const res = await inventoryService.searchProductos(query);
        return res.objeto || []; // Return array
    }, []);

    const handleExternalSearch = useCallback(async (query) => {
        const res = await inventoryService.searchProductosExterno(query);
        return res.objeto || [];
    }, []);

    return (
        <SearchableSelect
            label={label}
            placeholder="Buscar por código o nombre..."
            onSearch={handleSearch}
            onExternalSearch={handleExternalSearch}
            onChange={onChange}
            value={value}
            options={initialOption ? [initialOption] : []}
            displayKey="nombre"
            valueKey="nombre"
            returnObject={true}
            secondaryKey="codigo_producto"
            className="block"
        />
    );
}

