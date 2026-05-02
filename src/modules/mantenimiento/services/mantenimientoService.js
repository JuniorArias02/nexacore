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

    exportExcel: async (fechaInicio, fechaFin) => {
        const response = await api.get('/mantenimientos/exportar-excel', {
            params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte_mantenimientos_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    getStatistics: async () => {
        try {
            const response = await api.get('/mantenimientos/estadisticas');
            return response.data.objeto;
        } catch (error) {
            console.error("Error fetching maintenance statistics:", error);
            throw error;
        }
    }
};
