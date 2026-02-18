import api from '../../../services/api';

export const areasService = {
    getAll: async () => {
        const response = await api.get('/areas');
        return response.data.objeto || response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/areas/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/areas', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/areas/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/areas/${id}`);
        return response.data;
    }
};
