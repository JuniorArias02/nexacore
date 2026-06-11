import api from '../../../../services/api';

const pcLicenciasSoftwareService = {
    getByEquipoId: async (equipoId) => {
        try {
            const response = await api.get(`/gestion-sistemas/pc-licencias-software/equipo/${equipoId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },

    saveByEquipoId: async (data) => {
        const response = await api.post('/gestion-sistemas/pc-licencias-software', data);
        return response.data;
    }
};

export default pcLicenciasSoftwareService;
