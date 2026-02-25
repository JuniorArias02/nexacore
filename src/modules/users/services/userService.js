import api from '../../../services/api';

export const userService = {
    getAll: async () => {
        const response = await api.get('/usuarios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/usuarios', data);
        return response.data;
    },

    update: async (id, data) => {
        // If data is FormData, we use POST with _method=PUT since PHP has issues with PUT + multipart/form-data
        if (data instanceof FormData) {
            data.append('_method', 'PUT');
            const response = await api.post(`/usuarios/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }
        const response = await api.put(`/usuarios/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    }
};
