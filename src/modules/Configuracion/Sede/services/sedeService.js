import api from '../../../../services/api';

export const sedeService = {
    getAll: async () => {
        const response = await api.get('/sedes');
        return response.data.objeto || response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/sedes/${id}`);
        return response.data.objeto || response.data;
    },
    create: async (data) => {
        const response = await api.post('/sedes', data);
        return response.data.objeto || response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/sedes/${id}`, data);
        return response.data.objeto || response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/sedes/${id}`);
        return response.data;
    }
};
