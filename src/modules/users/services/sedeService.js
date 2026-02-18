import api from '../../../services/api';

export const sedeService = {
    getAll: async () => {
        const response = await api.get('/sedes');
        return response.data.objeto || response.data;
    }
};
