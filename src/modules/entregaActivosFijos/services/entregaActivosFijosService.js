import api from '../../../services/api';

export const entregaActivosFijosService = {
    getAll: async () => {
        const response = await api.get('/cp-entrega-activos-fijos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cp-entrega-activos-fijos/${id}`);
        return response.data;
    },

    create: async (data) => {
        // Need to use FormData for file upload (signatures)
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key === 'items') {
                data[key].forEach((item, index) => {
                    formData.append(`items[${index}][item_id]`, item.item_id);
                    if (item.es_accesorio !== undefined) {
                        formData.append(`items[${index}][es_accesorio]`, item.es_accesorio ? '1' : '0');
                    }
                    if (item.accesorio_descripcion) {
                        formData.append(`items[${index}][accesorio_descripcion]`, item.accesorio_descripcion);
                    }
                });
            } else if ((key === 'firma_quien_entrega' || key === 'firma_quien_recibe') && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/cp-entrega-activos-fijos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id, data) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');

        Object.keys(data).forEach(key => {
            if (key === 'items') {
                data[key].forEach((item, index) => {
                    formData.append(`items[${index}][item_id]`, item.item_id);
                    if (item.es_accesorio !== undefined) {
                        formData.append(`items[${index}][es_accesorio]`, item.es_accesorio ? '1' : '0');
                    }
                    if (item.accesorio_descripcion) {
                        formData.append(`items[${index}][accesorio_descripcion]`, item.accesorio_descripcion);
                    }
                });
            } else if ((key === 'firma_quien_entrega' || key === 'firma_quien_recibe') && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post(`/cp-entrega-activos-fijos/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/cp-entrega-activos-fijos/${id}`);
        return response.data;
    },

    exportExcel: async (id) => {
        const response = await api.get(`/cp-entrega-activos-fijos/${id}/exportar-excel`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `entrega_activos_${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
