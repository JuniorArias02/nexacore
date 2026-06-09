import api from '../../../../services/api';

const pcCaracteristicasTecnicasService = {
    getByEquipoId: async (equipoId) => {
        const response = await api.get(`/gestion-sistemas/pc-caracteristicas-tecnicas/equipo/${equipoId}`);
        return response.data;
    },

    updateByEquipoId: async (equipoId, data) => {
        try {
            const response = await api.get(`/gestion-sistemas/pc-caracteristicas-tecnicas/equipo/${equipoId}`);
            const existingId = response.data.objeto?.id || response.data.data?.id;

            if (existingId) {
                const updateResponse = await api.put(`/gestion-sistemas/pc-caracteristicas-tecnicas/${existingId}`, { ...data, equipo_id: equipoId });
                return updateResponse.data;
            } else {
                throw new Error("No existe");
            }
        } catch (error) {
            if (error.response?.status === 404 || error.message === "No existe") {
                const createResponse = await api.post('/gestion-sistemas/pc-caracteristicas-tecnicas', { ...data, equipo_id: equipoId });
                return createResponse.data;
            }
            throw error;
        }
    }
};

export default pcCaracteristicasTecnicasService;
