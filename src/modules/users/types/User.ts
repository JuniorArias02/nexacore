export interface User {
    id: number;
    nombre_completo: string;
    usuario: string;
    correo?: string;
    telefono?: string;
    rol_id?: number;
    sede_id?: number;
    estado: boolean;
    rol?: {
        id: number;
        nombre: string;
    };
    sede?: {
        id: number;
        nombre: string;
    };
}
