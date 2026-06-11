import api from '../../../../services/api';

export const cpProductoServicioService = {
    getAll: async (params = {}) => {
        const response = await api.get('/gestion-compras/cp-productos-servicios', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/gestion-compras/cp-productos-servicios/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/gestion-compras/cp-productos-servicios', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/gestion-compras/cp-productos-servicios/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/gestion-compras/cp-productos-servicios/${id}`);
        return response.data;
    }
};
