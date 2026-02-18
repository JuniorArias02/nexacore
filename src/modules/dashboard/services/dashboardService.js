import api from '../../../services/api';

const dashboardService = {
    getStats: async (type = 'admin') => {
        try {
            const response = await api.get(`/dashboard/stats`, {
                params: { type }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
};

export default dashboardService;
