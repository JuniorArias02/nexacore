import api from '../../../services/api';

export const buzonSugerenciasService = {
    // Obtener mis sugerencias
    getMias: async () => {
        const response = await api.get('/buzon-sugerencias', { params: { mias: true } });
        return response.data.objeto || response.data;
    },

    // Obtener sugerencias pendientes para el agente
    getPendientes: async () => {
        const response = await api.get('/buzon-sugerencias', { params: { pendientes: true } });
        return response.data.objeto || response.data;
    },

    // Obtener detalle por codigo
    getByCodigo: async (codigo) => {
        const response = await api.get(`/buzon-sugerencias/${codigo}`);
        return response.data.objeto || response.data;
    },

    // Crear nueva sugerencia
    create: async (formData) => {
        const response = await api.post('/buzon-sugerencias', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Subir adjuntos
    uploadAdjuntos: async (id, files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('archivos[]', file));
        
        const response = await api.post(`/buzon-sugerencias/${id}/adjuntos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Agregar comentario
    addComentario: async (id, mensaje) => {
        const response = await api.post(`/buzon-sugerencias/${id}/comentarios`, { mensaje });
        return response.data;
    },

    // Cambiar estado
    updateEstado: async (id, estado_id) => {
        const response = await api.patch(`/buzon-sugerencias/${id}/estado`, { estado_id });
        return response.data;
    },

    // Asignar agente
    asignarResponsable: async (id, usuario_id) => {
        const response = await api.patch(`/buzon-sugerencias/${id}/asignar`, { usuario_id });
        return response.data;
    },

    // Obtener cantidad de mensajes no leídos
    getNoLeidosCount: async () => {
        const response = await api.get('/buzon-sugerencias/no-leidos-count');
        return response.data.objeto?.count || response.data.count || 0;
    },

    // Obtener tickets con mensajes no leídos
    getTicketsNoLeidos: async () => {
        const response = await api.get('/buzon-sugerencias/tickets-no-leidos');
        return response.data.objeto || response.data;
    },

    // Marcar comentarios como leídos
    marcarComentariosLeidos: async (id) => {
        const response = await api.post(`/buzon-sugerencias/${id}/leer-comentarios`);
        return response.data;
    }
};
