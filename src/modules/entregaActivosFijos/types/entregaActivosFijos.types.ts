export interface EntregaActivosFijosItem {
    id?: number;
    item_id: number;
    es_accesorio: boolean;
    accesorio_descripcion?: string;
    entrega_activos_id?: number;
    inventario?: {
        id: number;
        nombre_activo: string;
        serial_inventario: string;
    };
}

export interface EntregaActivosFijos {
    id?: number;
    personal_id: number;
    sede_id: number;
    proceso_solicitante: number;
    coordinador_id: number;
    fecha_entrega: string;
    firma_quien_entrega?: string;
    firma_quien_recibe?: string;
    items?: EntregaActivosFijosItem[];
    personal?: {
        id: number;
        nombre: string;
    };
    sede?: {
        id: number;
        nombre: string;
    };
    procesoSolicitante?: {
        id: number;
        nombre: string;
    };
    coordinador?: {
        id: number;
        nombre: string;
    };
}

export interface EntregaActivosFijosFormData {
    personal_id: number | null;
    sede_id: number | null;
    proceso_solicitante: number | null;
    coordinador_id: number | null;
    fecha_entrega: string;
    firma_quien_entrega: File | null;
    firma_quien_recibe: File | null;
    items: EntregaActivosFijosItem[];
}
