import api from '../../../services/api';

const datosEmpresaService = {
    getAll: async () => {
        try {
            const response = await api.get('/datos-empresa');
            return response.data.objeto || [];
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw error;
        }
    }
};

export default datosEmpresaService;
