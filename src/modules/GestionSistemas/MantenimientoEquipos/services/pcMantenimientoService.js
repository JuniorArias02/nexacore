import api from '../../../../services/api';

const pcMantenimientoService = {
    /**
     * Obtiene todos los mantenimientos de PC
     */
    getAll: async () => {
        try {
            const response = await api.get('/gestion-sistemas/pc-mantenimientos');
            return response.data.objeto || [];
        } catch (error) {
            console.error('Error in pcMantenimientoService.getAll:', error);
            throw error;
        }
    },

    /**
     * Obtiene un mantenimiento por ID
     */
    getById: async (id) => {
        try {
            const response = await api.get(`/gestion-sistemas/pc-mantenimientos/${id}`);
            return response.data.objeto;
        } catch (error) {
            console.error('Error in pcMantenimientoService.getById:', error);
            throw error;
        }
    },

    /**
     * Obtiene el historial de mantenimientos de un equipo específico
     */
    getByEquipo: async (equipoId) => {
        try {
            const response = await api.get(`/gestion-sistemas/pc-mantenimientos/equipo/${equipoId}`);
            return response.data.objeto || [];
        } catch (error) {
            console.error('Error in pcMantenimientoService.getByEquipo:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo registro de mantenimiento
     */
    create: async (data) => {
        try {
            const response = await api.post('/gestion-sistemas/pc-mantenimientos', data);
            return response.data.objeto;
        } catch (error) {
            console.error('Error in pcMantenimientoService.create:', error);
            throw error;
        }
    },

    /**
     * Actualiza un mantenimiento existente
     */
    update: async (id, data) => {
        try {
            const response = await api.put(`/gestion-sistemas/pc-mantenimientos/${id}`, data);
            return response.data.objeto;
        } catch (error) {
            console.error('Error in pcMantenimientoService.update:', error);
            throw error;
        }
    },

    /**
     * Actualiza firmas y/o estado de un mantenimiento
     */
    actualizarFirmas: async (id, data) => {
        try {
            const response = await api.post(`/gestion-sistemas/pc-mantenimientos/${id}/actualizar-firmas`, data);
            return response.data.objeto;
        } catch (error) {
            console.error('Error in pcMantenimientoService.actualizarFirmas:', error);
            throw error;
        }
    },

    /**
     * Elimina un registro de mantenimiento
     */
    delete: async (id) => {
        try {
            const response = await api.delete(`/gestion-sistemas/pc-mantenimientos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error in pcMantenimientoService.delete:', error);
            throw error;
        }
    },

    /**
     * Exporta un mantenimiento a Excel
     */
    exportExcel: async (id) => {
        try {
            const response = await api.get(`/gestion-sistemas/pc-mantenimientos/${id}/exportar-excel`);
            return response.data;
        } catch (error) {
            console.error('Error in pcMantenimientoService.exportExcel:', error);
            throw error;
        }
    },

    /**
     * Exporta un mantenimiento a PDF
     */
    exportPdf: async (id) => {
        try {
            const response = await api.get(`/gestion-sistemas/pc-mantenimientos/${id}/exportar-pdf`);
            return response.data;
        } catch (error) {
            console.error('Error in pcMantenimientoService.exportPdf:', error);
            throw error;
        }
    }
};

export default pcMantenimientoService;
