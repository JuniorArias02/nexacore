import { useCallback } from 'react';
import { inventoryService } from '../../services/inventoryService';
import SearchableSelect from '../SearchableSelect';

export default function PersonalSearch({ value, onChange, label, placeholder = "Buscar personal...", initialOption }) {
    const handleSearch = useCallback(async (query) => {
        if (!query) return [];
        const res = await inventoryService.searchPersonal(query);
        return res.objeto || [];
    }, []);

    const handleExternalSearch = useCallback(async (query) => {
        const res = await inventoryService.searchPersonalExterno(query);
        return res.objeto || [];
    }, []);

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            onSearch={handleSearch}
            onExternalSearch={handleExternalSearch}
            onChange={onChange}
            value={value}
            options={initialOption ? [initialOption] : []}
            displayKey="nombre"
            valueKey="id"
            secondaryKey="cedula"
            returnObject={true}
        />
    );
}
