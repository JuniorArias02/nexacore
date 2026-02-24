import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Extract permission names from user data
    const extractPermissions = (userData) => {
        const permisos = userData?.rol?.permisos || [];
        return permisos.map((p) => p.nombre);
    };

    // Check if user has a specific permission
    const hasPermission = (permName) => {
        if (permName === 'all') return true;
        return permissions.includes(permName);
    };

    // Check if user has ANY of the given permissions
    const hasAnyPermission = (permNames) => {
        if (!permNames || permNames.length === 0) return true;
        if (permNames.includes('all')) return true;
        return permNames.some((p) => permissions.includes(p));
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Verificar el token obteniendo los datos del usuario
                const response = await api.post('/auth/me');
                if (response.data.status === 'success' || response.data.objeto) {
                    const userData = response.data.objeto;
                    setUser(userData);
                    setPermissions(extractPermissions(userData));
                    setIsAuthenticated(true);
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Error verificando sesión:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (usuario, contrasena) => {
        try {
            const response = await api.post('/auth/login', { usuario, contrasena });

            if (response.data.objeto && response.data.objeto.access_token) {
                const token = response.data.objeto.access_token;
                localStorage.setItem('token', token);
                setIsAuthenticated(true);

                // Obtener datos del usuario inmediatamente después del login
                const userResponse = await api.post('/auth/me');
                const userData = userResponse.data.objeto;
                setUser(userData);
                setPermissions(extractPermissions(userData));

                return { success: true };
            } else {
                return { success: false, message: 'Respuesta inválida del servidor' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.mensaje || 'Error al iniciar sesión'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error (token might be expired):", error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setPermissions([]);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (userData) => {
        setUser(prevUser => ({ ...prevUser, ...userData }));
    };

    const refreshPermissions = async () => {
        try {
            const userResponse = await api.post('/auth/me');
            if (userResponse.data.objeto) {
                const userData = userResponse.data.objeto;
                setUser(userData);
                setPermissions(extractPermissions(userData));
                return { success: true };
            }
            return { success: false, message: 'No se pudo obtener la información del usuario' };
        } catch (error) {
            console.error("Error refreshing permissions:", error);
            return {
                success: false,
                message: error.response?.data?.mensaje || 'Error al sincronizar permisos'
            };
        }
    };

    const value = {
        user,
        permissions,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
        refreshPermissions,
        hasPermission,
        hasAnyPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
