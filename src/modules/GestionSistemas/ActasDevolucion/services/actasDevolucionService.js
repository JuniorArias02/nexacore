import api from '../../../../services/api';

const BASE_URL = '/gestion-sistemas/actas-devolucion';

const actasDevolucionService = {
    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data; // O response.data.data dependiendo de cómo envíes
    },

    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data.data || response.data;
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
        // En Laravel, actualizar con FormData (archivos) a veces requiere _method='PUT'
        formData.append('_method', 'PUT');
        const response = await api.post(`${BASE_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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

export default actasDevolucionService;
