import api from '../../../services/api';

export const profileService = {
    updateProfile: async (data) => {
        const response = await api.post('/profile/update', data);
        return response.data;
    },

    changePassword: async (currentPassword, newPassword, newPasswordConfirmation) => {
        const response = await api.post('/profile/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation
        });
        return response.data;
    },

    uploadSignature: async (file) => {
        const formData = new FormData();
        formData.append('firma', file);

        const response = await api.post('/profile/upload-signature', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    uploadPhoto: async (file) => {
        const formData = new FormData();
        formData.append('foto', file);

        const response = await api.post('/profile/upload-photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deletePhoto: async () => {
        const response = await api.post('/profile/delete-photo');
        return response.data;
    }
};
