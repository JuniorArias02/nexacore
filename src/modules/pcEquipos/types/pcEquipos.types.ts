export interface ApiResponse<T> {
    status: string;
    message: string;
    objeto: T;
}

export interface PcEquipo {
    id?: number;
    tipo_equipo: string;
    marca: string;
    modelo: string;
    serial: string;
    activo_fijo?: string;
    sede_id?: number | null;
    area_id?: number | null;
    responsable_id?: number | null;
    estado: 'operativo' | 'en_reparacion' | 'baja' | 'asignado';
    creado_por_id?: number;
    caracteristicas_tecnicas?: PcCaracteristicasTecnicas;
    sede?: {
        id: number;
        nombre: string;
    };
    area?: {
        id: number;
        nombre: string;
    };
    responsable?: {
        id: number;
        nombres: string;
        apellidos: string;
    };
    creado_por?: {
        id: number;
        name: string;
    };
}

export interface PcCaracteristicasTecnicas {
    id?: number;
    equipo_id: number;
    procesador?: string;
    generacion?: string;
    ram_gb?: number;
    disco_duro?: string;
    tipo_disco?: 'HDD' | 'SSD' | 'M.2' | 'NVMe';
    sistema_operativo?: string;
    observaciones?: string;
}

export interface PcEquipoFormData {
    tipo_equipo: string;
    marca: string;
    modelo: string;
    serial: string;
    activo_fijo: string;
    sede_id: number | string;
    area_id: number | string;
    responsable_id: number | string;
    estado: string;
}
