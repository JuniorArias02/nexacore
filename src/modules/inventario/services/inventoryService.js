import api from '../../../services/api';

export const inventoryService = {
    // Productos / Servicios
    searchProductos: async (query) => {
        const response = await api.get('/cp-productos-servicios', { params: { q: query } });
        return response.data.objeto;
    },

    // Personal
    searchPersonal: async (query) => {
        const response = await api.get('/personal', { params: { q: query } });
        return response.data.objeto;
    },

    // Sedes
    getSedes: async () => {
        const response = await api.get('/sedes');
        return response.data.objeto;
    },

    // Dependencias (from dependencias_sedes - PROCESOS)
    getProcesos: async (sedeId) => {
        const response = await api.get('/dependencias-sedes', { params: { sede_id: sedeId } });
        return response.data.objeto;
    },

    // Dependencias (from cp_dependencias - DEPENDENCIAS)
    getCpDependencias: async (sedeId) => {
        const response = await api.get('/cp-dependencias', { params: { sede_id: sedeId } });
        return response.data.objeto;
    },

    // Centros de Costo
    getCentrosCosto: async () => {
        const response = await api.get('/cp-centro-costos');
        return response.data.objeto;
    },

    // Inventario
    createInventario: async (data) => {
        const formData = new FormData();

        // Append all fields to FormData
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/inventario', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Return full response to get message and status
    },

    // Get All Inventory
    getAllInventario: async (params = {}) => {
        const response = await api.get('/inventario', { params });
        return response.data; // Assuming ApiResponse wrapper, so .objeto might be needed if it returns wrapped list
    },

    // Delete Inventory
    deleteInventario: async (id) => {
        const response = await api.delete(`/inventario/${id}`);
        return response.data;
    },

    // Get One
    getInventarioById: async (id) => {
        const response = await api.get(`/inventario/${id}`);
        return response.data.objeto;
    }
};
