import api from '../../../../services/api';

export const cpProductoService = {
    getAll: async () => {
        const response = await api.get('/gestion-compras/cp-productos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/gestion-compras/cp-productos/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/gestion-compras/cp-productos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/gestion-compras/cp-productos/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/gestion-compras/cp-productos/${id}`);
        return response.data;
    }
};
