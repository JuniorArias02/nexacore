import api from '../../../../services/api';

const pcEquiposService = {
    getAll: async (params = {}) => {
        const response = await api.get('/gestion-sistemas/pc-equipos', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/gestion-sistemas/pc-equipos/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/gestion-sistemas/pc-equipos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/gestion-sistemas/pc-equipos/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/gestion-sistemas/pc-equipos/${id}`);
        return response.data;
    },

    getHojaDeVida: async (id) => {
        const response = await api.get(`/gestion-sistemas/pc-equipos/${id}/hoja-vida`);
        return response.data;
    },
    
    buscar: async (query) => {
        const response = await api.get(`/gestion-sistemas/pc-equipos/buscar?q=${query}`);
        return response.data;
    },

    exportExcel: async (id) => {
        const response = await api.get(`/gestion-sistemas/pc-equipos/${id}/hoja-vida/exportar-excel`);
        return response.data;
    },

    exportPdf: async (id) => {
        const response = await api.get(`/gestion-sistemas/pc-equipos/${id}/hoja-vida/exportar-pdf`);
        return response.data;
    },
};

export default pcEquiposService;
