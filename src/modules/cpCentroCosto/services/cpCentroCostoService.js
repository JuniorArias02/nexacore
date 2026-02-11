import api from '../../../services/api';

export const cpCentroCostoService = {
    getAll: async () => {
        const response = await api.get('/cp-centro-costos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cp-centro-costos/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/cp-centro-costos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/cp-centro-costos/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/cp-centro-costos/${id}`);
        return response.data;
    }
};
