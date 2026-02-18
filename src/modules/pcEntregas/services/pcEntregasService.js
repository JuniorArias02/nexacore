import api from '../../../services/api';

const pcEntregasService = {
    getAll: async () => {
        const response = await api.get('/pc-entregas');
        return response.data.objeto;
    },

    getById: async (id) => {
        const response = await api.get(`/pc-entregas/${id}`);
        return response.data.objeto;
    },

    create: async (data) => {
        const response = await api.post('/pc-entregas', data);
        return response.data.objeto;
    },

    update: async (id, data) => {
        const response = await api.put(`/pc-entregas/${id}`, data);
        return response.data.objeto;
    },

    delete: async (id) => {
        const response = await api.delete(`/pc-entregas/${id}`);
        return response.data;
    },

    getByEquipoId: async (equipoId) => {
        // Assuming we might need filtering by equipo, using the general list for now or separate endpoint if exists.
        // Controller didn't show specific filter, but usually getAll params or a specific endpoint is used.
        // For now, let's assume we filter on client side or the controller needs update.
        // But wait, standard is usually /pc-entregas?equipo_id=X if supported.
        // Controller index calls service->getAll(). Service getAll uses PcEntrega::all().
        // So no filtering yet! I will assume I need to implement filtering later or filter on frontend.
        // Let's just implement the basic calls.
        const response = await api.get('/pc-entregas');
        return response.data.objeto ? response.data.objeto.filter(e => e.equipo_id === parseInt(equipoId)) : [];
    }
};

export default pcEntregasService;
