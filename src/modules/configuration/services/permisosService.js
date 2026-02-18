import api from '../../../services/api';

export const permisosService = {
    getAll: async () => {
        const response = await api.get('/permisos');
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/permisos', data);
        return response.data.objeto;
    },

    update: async (id, data) => {
        const response = await api.put(`/permisos/${id}`, data);
        return response.data.objeto;
    },

    delete: async (id) => {
        const response = await api.delete(`/permisos/${id}`);
        return response.data;
    },

    getRolesWithPermisos: async () => {
        const response = await api.get('/permisos/roles-assignments/list');
        return response.data.objeto;
    },

    assignPermisos: async (rolId, permisosIds) => {
        const response = await api.post('/permisos/assign', {
            rol_id: rolId,
            permisos: permisosIds
        });
        return response.data.objeto;
    }
};
