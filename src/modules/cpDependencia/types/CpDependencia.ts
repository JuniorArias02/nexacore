export interface CpDependencia {
    id: number;
    codigo?: number;
    nombre: string;
    sede_id: number;
    sede?: {
        id: number;
        nombre: string;
    };
}
