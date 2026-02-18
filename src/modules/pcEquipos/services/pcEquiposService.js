import api from '../../../services/api';

const pcEquiposService = {
    getAll: async () => {
        const response = await api.get('/pc-equipos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/pc-equipos/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/pc-equipos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/pc-equipos/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/pc-equipos/${id}`);
        return response.data;
    },
};

export default pcEquiposService;
