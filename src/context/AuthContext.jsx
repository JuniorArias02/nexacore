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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

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
                    // Ajustar según la estructura real de ApiResponse (objeto contains user data)
                    setUser(response.data.objeto);
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
                setUser(userResponse.data.objeto);

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
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
