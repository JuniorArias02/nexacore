import { useCallback } from 'react';
import { inventoryService } from '../../services/inventoryService';
import SearchableSelect from '../SearchableSelect';

export default function PersonalSearch({ value, onChange, label, placeholder = "Buscar personal..." }) {
    const handleSearch = useCallback(async (query) => {
        if (!query) return [];
        return await inventoryService.searchPersonal(query);
    }, []);

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            onSearch={handleSearch}
            onChange={onChange}
            value={value}
            displayKey="nombre"
            valueKey="id"
        />
    );
}
