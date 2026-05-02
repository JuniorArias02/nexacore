import api from '../../../services/api';

export const agendaMantenimientoService = {
    getAll: async () => {
        const response = await api.get('/agenda-mantenimientos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/agenda-mantenimientos/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/agenda-mantenimientos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/agenda-mantenimientos/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/agenda-mantenimientos/${id}`);
        return response.data;
    },

    getByMantenimiento: async (mantenimientoId) => {
        const response = await api.get(`/agenda-mantenimientos/mantenimiento/${mantenimientoId}`);
        return response.data;
    },

    getUsuariosPorPermiso: async (permiso) => {
        const response = await api.get(`/usuarios/por-permiso/${permiso}`);
        return response.data;
    },

    /**
     * Retorna los IDs de técnicos que ya tienen conflicto de horario
     * para el rango fecha_inicio → fecha_fin.
     */
    getDisponibilidad: async (fechaInicio, fechaFin, excludeId = null) => {
        const params = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };
        if (excludeId) params.exclude_id = excludeId;
        const response = await api.get('/agenda-mantenimientos/disponibilidad', { params });
        return response.data?.objeto?.tecnicos_ocupados ?? [];
    },
};

