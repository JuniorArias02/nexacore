import api from '../../../../services/api';

export const imagenMensualService = {
    obtenerImagenBlob: async () => {
        const response = await api.get('/imagen-mensual', { responseType: 'blob' });
        return response.data;
    },
    subirImagen: async (file) => {
        const formData = new FormData();
        formData.append('imagen', file);
        const response = await api.post('/imagen-mensual', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    eliminarImagen: async () => {
        const response = await api.delete('/imagen-mensual');
        return response.data;
    }
};
