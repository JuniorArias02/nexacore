export interface Personal {
    id: number;
    nombre: string;
    cedula?: string;
    telefono?: string;
    cargo_id: number;
    cargo?: {
        id: number;
        nombre: string;
    };
}
