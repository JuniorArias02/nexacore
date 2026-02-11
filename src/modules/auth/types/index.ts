export interface User {
    id: number;
    nombre_completo: string;
    usuario: string;
    rol_id: number;
    correo: string | null;
    telefono: string | null;
    estado: number;
    sede_id: number | null;
    firma_digital: string | null;
}

export interface LoginResponse {
    mensaje: string;
    objeto: {
        access_token: string;
        token_type: string;
        expires_in: number;
    };
    status: number;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}
