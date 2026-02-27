import api from '../../../services/api';

export const inventoryService = {
    // Productos / Servicios
    searchProductos: async (query) => {
        const response = await api.get('/cp-productos-servicios', { params: { q: query } });
        const obj = response.data.objeto;
        return Array.isArray(obj) ? obj : (obj?.data || []);
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

    // Areas (from areas table - for Dependencia field)
    getAreas: async () => {
        const response = await api.get('/areas');
        return response.data.objeto || response.data;
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

    // Update Inventario
    updateInventario: async (id, data) => {
        // Use JSON for updates usually, unless file upload is needed.
        // If file upload support is needed in update, we must use FormData and POST with _method=PUT mechanism or just PUT with JSON if no file.
        // Given current controller accepts Request, let's try standard PUT with JSON first, as implementation plan implies JSON updates for most fields.
        // However, if we need to update 'soporte_adjunto', we might need FormData.
        // Let's stick to JSON for now as commonly defined in Swagger component, 
        // BUT if file update is required we might need special handling.
        // For simplicity and common Laravel patterns for API Resources:
        const response = await api.put(`/inventario/${id}`, data);
        return response.data;
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
