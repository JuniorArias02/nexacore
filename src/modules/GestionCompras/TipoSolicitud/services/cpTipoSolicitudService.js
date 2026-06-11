import api from '../../../../services/api';

export const cpTipoSolicitudService = {
    getAll: async () => {
        const response = await api.get('/gestion-compras/cp-tipos-solicitud');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/gestion-compras/cp-tipos-solicitud/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/gestion-compras/cp-tipos-solicitud', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/gestion-compras/cp-tipos-solicitud/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/gestion-compras/cp-tipos-solicitud/${id}`);
        return response.data;
    }
};
