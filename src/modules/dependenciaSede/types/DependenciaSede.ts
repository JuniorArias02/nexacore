export interface DependenciaSede {
    id: number;
    sede_id: number;
    nombre: string;
    sede?: {
        id: number;
        nombre: string;
    };
}
