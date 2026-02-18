import api from '../../../services/api';

const pcDevueltoService = {
    getAll: async () => {
        try {
            const response = await api.get('/pc-devueltos');
            return response.data.objeto;
        } catch (error) {
            console.error('Error fetching pc devueltos:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/pc-devueltos/${id}`);
            return response.data.objeto;
        } catch (error) {
            console.error('Error fetching pc devuelto:', error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/pc-devueltos', data);
            return response.data.objeto;
        } catch (error) {
            console.error('Error creating pc devuelto:', error);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`/pc-devueltos/${id}`, data);
            return response.data.objeto;
        } catch (error) {
            console.error('Error updating pc devuelto:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/pc-devueltos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting pc devuelto:', error);
            throw error;
        }
    }
};

export default pcDevueltoService;
