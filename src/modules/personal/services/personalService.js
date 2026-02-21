import api from '../../../services/api';

export const personalService = {
    getAll: async () => {
        const response = await api.get('/personal');
        return response.data.objeto || response.data;
    },

    /**
     * Search personal by name/cedula. Backend will fallback to Kubapp
     * if no local results are found, auto-saving new entries.
     */
    search: async (query) => {
        const response = await api.get('/personal', { params: { q: query } });
        return response.data.objeto || response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/personal/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/personal', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/personal/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/personal/${id}`);
        return response.data;
    }
};
