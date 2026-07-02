import api from '../../../../services/api';

export const pedidosProgramadosService = {
    getAll: async (params = {}) => {
        const response = await api.get('/gestion-compras/pedidos-programados', { params });
        return response.data.data || response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/gestion-compras/pedidos-programados/${id}`);
        return response.data.data || response.data;
    },
    update: async (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'datos_pedido') {
                formData.append('datos_pedido', typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]));
            } else if (key === 'firma_file' && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (key === 'use_stored_signature') {
                formData.append(key, data[key] ? '1' : '0');
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        const response = await api.post(`/gestion-compras/pedidos-programados/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/gestion-compras/pedidos-programados/${id}`);
        return response.data;
    }
};
