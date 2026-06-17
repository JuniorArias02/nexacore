import api from '../../../../services/api';

const BASE_URL = '/gestion-sistemas/actas-entrega';

const actasEntregaService = {
    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data.data;
    },

    create: async (formData) => {
        const response = await api.post(BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    update: async (id, formData) => {
        formData.append('_method', 'PUT');
        const response = await api.post(`${BASE_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    
    search: async (query) => {
        const response = await api.get(`${BASE_URL}?q=${query}`);
        return response.data; 
    },
    
    delete: async (id) => {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    },

    exportExcel: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}/exportar-excel`);
        return response.data;
    },

    exportPdf: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}/exportar-pdf`);
        return response.data;
    }
};

export default actasEntregaService;
