import api from '../../../services/api';

export const cpProductoServicioService = {
    getAll: async () => {
        const response = await api.get('/cp-productos-servicios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cp-productos-servicios/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/cp-productos-servicios', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/cp-productos-servicios/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/cp-productos-servicios/${id}`);
        return response.data;
    }
};
