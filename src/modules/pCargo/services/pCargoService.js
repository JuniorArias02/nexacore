import api from '../../../services/api';

export const pCargoService = {
    getAll: async () => {
        const response = await api.get('/p-cargos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/p-cargos/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/p-cargos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/p-cargos/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/p-cargos/${id}`);
        return response.data;
    }
};
