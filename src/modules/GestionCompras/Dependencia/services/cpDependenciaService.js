import api from '../../../../services/api';

export const cpDependenciaService = {
    getAll: async (params = {}) => {
        const response = await api.get('/gestion-compras/cp-dependencias', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/gestion-compras/cp-dependencias/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/gestion-compras/cp-dependencias', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/gestion-compras/cp-dependencias/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/gestion-compras/cp-dependencias/${id}`);
        return response.data;
    }
};
