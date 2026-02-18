import api from '../../../services/api';

const pcCaracteristicasTecnicasService = {
    getByEquipoId: async (equipoId) => {
        const response = await api.get(`/pc-caracteristicas-tecnicas/equipo/${equipoId}`);
        return response.data;
    },

    updateByEquipoId: async (equipoId, data) => {
        try {
            const response = await api.get(`/pc-caracteristicas-tecnicas/equipo/${equipoId}`);
            if (response.data && response.data.objeto && response.data.objeto.id) {
                const id = response.data.objeto.id;
                const updateResponse = await api.put(`/pc-caracteristicas-tecnicas/${id}`, { ...data, equipo_id: equipoId });
                return updateResponse.data;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const createResponse = await api.post('/pc-caracteristicas-tecnicas', { ...data, equipo_id: equipoId });
                return createResponse.data;
            }
            throw error;
        }
    }
};

export default pcCaracteristicasTecnicasService;
