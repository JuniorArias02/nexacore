import api from '../../../services/api';

export const dependenciaSedeService = {
    getAll: async (params = {}) => {
        const response = await api.get('/dependencias-sedes', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/dependencias-sedes/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/dependencias-sedes', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/dependencias-sedes/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/dependencias-sedes/${id}`);
        return response.data;
    }
};
