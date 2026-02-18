import api from '../../../services/api';

export const inventarioService = {
    getByResponsableAndCoordinador: async (responsableId, coordinadorId) => {
        const response = await api.get('/inventario/by-responsable-coordinador', {
            params: {
                responsable_id: responsableId,
                coordinador_id: coordinadorId
            }
        });
        return response.data;
    }
};
