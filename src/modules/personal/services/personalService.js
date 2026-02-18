import api from '../../../services/api';

export const personalService = {
    getAll: async () => {
        const response = await api.get('/personal');
        return response.data.objeto || response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/personal/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/personal', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/personal/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/personal/${id}`);
        return response.data;
    }
};
