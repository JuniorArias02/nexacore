import api from '../../../services/api';

export const cpTipoSolicitudService = {
    getAll: async () => {
        const response = await api.get('/cp-tipos-solicitud');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cp-tipos-solicitud/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/cp-tipos-solicitud', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/cp-tipos-solicitud/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/cp-tipos-solicitud/${id}`);
        return response.data;
    }
};
