import api from '../../../services/api';

export const cpDependenciaService = {
    getAll: async (params = {}) => {
        const response = await api.get('/cp-dependencias', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cp-dependencias/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/cp-dependencias', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/cp-dependencias/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/cp-dependencias/${id}`);
        return response.data;
    }
};
