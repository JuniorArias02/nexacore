export interface CpItemPedido {
    id?: number;
    nombre: string;
    cantidad: number;
    unidad_medida: string;
    referencia_items?: string;
    productos_id: number;
    comprado?: number; // 0 or 1
}

export interface CpPedido {
    id?: number;
    estado_compras?: 'pendiente' | 'aprobado' | 'rechazado' | 'en proceso';
    fecha_solicitud?: string;
    proceso_solicitante: number; // DependenciaSede ID
    tipo_solicitud: number; // CpTipoSolicitud ID
    consecutivo: number;
    observacion?: string;
    sede_id: number; // Sede ID
    elaborado_por: number; // Usuario ID
    elaborado_por_firma?: string | File; // Path string or File object
    creador_por?: number; // Usuario ID
    items: CpItemPedido[];

    // Approval fields
    proceso_compra?: number;
    proceso_compra_firma?: string;
    responsable_aprobacion?: number;
    responsable_aprobacion_firma?: string;
    estado_gerencia?: 'pendiente' | 'aprobado' | 'rechazado';
    observacion_gerencia?: string;
}
