import api from '../../../services/api';

export const cpPedidoService = {
    getAll: async () => {
        const response = await api.get('/cp-pedidos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cp-pedidos/${id}`);
        return response.data;
    },

    create: async (data) => {
        // Need to use FormData for file upload
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key === 'items') {
                data[key].forEach((item, index) => {
                    formData.append(`items[${index}][nombre]`, item.nombre);
                    formData.append(`items[${index}][cantidad]`, item.cantidad);
                    formData.append(`items[${index}][unidad_medida]`, item.unidad_medida);
                    if (item.referencia_items) formData.append(`items[${index}][referencia_items]`, item.referencia_items);
                    formData.append(`items[${index}][productos_id]`, item.productos_id);
                });
            } else if (key === 'elaborado_por_firma' && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (key === 'use_stored_signature') {
                formData.append(key, data[key] ? '1' : '0');
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/cp-pedidos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/cp-pedidos/${id}`);
        return response.data;
    },

    aprobarCompras: async (id, data) => {
        const formData = new FormData();
        if (data.firma) {
            formData.append('proceso_compra_firma', data.firma);
        }
        if (data.use_stored_signature) {
            formData.append('use_stored_signature', '1');
        }
        if (data.motivo) formData.append('motivo_aprobacion', data.motivo);

        if (data.items_comprados && Array.isArray(data.items_comprados)) {
            data.items_comprados.forEach((itemId, index) => {
                formData.append(`items_comprados[${index}]`, itemId);
            });
        }

        const response = await api.post(`/cp-pedidos/${id}/aprobar-compras`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    rechazarCompras: async (id, motivo) => {
        const response = await api.post(`/cp-pedidos/${id}/rechazar-compras`, { motivo });
        return response.data;
    },

    updateItems: async (id, items) => {
        const response = await api.post(`/cp-pedidos/${id}/update-items`, { items });
        return response.data;
    },

    aprobarGerencia: async (id, data) => {
        const formData = new FormData();
        if (data.firma) formData.append('responsable_aprobacion_firma', data.firma);
        if (data.use_stored_signature) formData.append('use_stored_signature', '1');
        if (data.observacion_gerencia) formData.append('observacion_gerencia', data.observacion_gerencia);

        const response = await api.post(`/cp-pedidos/${id}/aprobar-gerencia`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    rechazarGerencia: async (id, observacion) => {
        const response = await api.post(`/cp-pedidos/${id}/rechazar-gerencia`, { observacion_gerencia: observacion });
        return response.data;
    }
};
