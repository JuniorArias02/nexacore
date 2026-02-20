import api from '../../../services/api';

export const mantenimientoService = {
    getAll: async () => {
        const response = await api.get('/mantenimientos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/mantenimientos/${id}`);
        return response.data.objeto;
    },

    create: async (formData) => {
        const response = await api.post('/mantenimientos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    update: async (id, formData) => {
        // FormData doesn't work with PUT in PHP, use POST with _method trick
        formData.append('_method', 'PUT');
        const response = await api.post(`/mantenimientos/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/mantenimientos/${id}`);
        return response.data;
    },

    marcarRevisado: async (id) => {
        const response = await api.post(`/mantenimientos/${id}/marcar-revisado`);
        return response.data;
    },

    getMisMantenimientos: async () => {
        const response = await api.get('/mantenimientos/mis-mantenimientos');
        return response.data;
    },

    getUsuariosPorPermiso: async (permiso) => {
        const response = await api.get(`/usuarios/por-permiso/${permiso}`);
        return response.data;
    },
};
