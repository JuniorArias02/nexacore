import { useCallback } from 'react';
import { inventoryService } from '../../services/inventoryService';
import SearchableSelect from '../SearchableSelect';

export default function ProductSearch({ value, onChange, label = "Nombre del Producto *", initialOption }) {
    const handleSearch = useCallback(async (query) => {
        if (!query) return [];
        return await inventoryService.searchProductos(query);
    }, []);

    return (
        <SearchableSelect
            label={label}
            placeholder="Buscar por código o nombre..."
            onSearch={handleSearch}
            onChange={onChange}
            value={value}
            options={initialOption ? [initialOption] : []}
            displayKey="nombre"
            valueKey="nombre"
            className="block"
        />
    );
}

