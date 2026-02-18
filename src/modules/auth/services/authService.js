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
    },

    sendResetCode: async (usuario) => {
        const response = await api.post('/auth/forgot-password', { usuario });
        return response.data;
    },

    verifyResetCode: async (usuario, codigo) => {
        const response = await api.post('/auth/verify-code', { usuario, codigo });
        return response.data;
    },

    resetPassword: async (usuario, codigo, password, password_confirmation) => {
        const response = await api.post('/auth/reset-password', { usuario, codigo, password, password_confirmation });
        return response.data;
    }
};
