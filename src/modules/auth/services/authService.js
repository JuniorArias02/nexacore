import api from '../../../services/api';

export const authService = {
    login: async (usuario, contrasena) => {
        const response = await api.post('/auth/login', { usuario, contrasena });
        return response.data;
    },

    me: async () => {
        const response = await api.post('/auth/me');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    }
};
