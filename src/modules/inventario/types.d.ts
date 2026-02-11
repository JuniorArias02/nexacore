export interface Sede {
    id: number;
    nombre: string;
}

export interface Producto {
    codigo_producto: string;
    nombre: string;
    marca?: string;
    modelo?: string;
    serial?: string;
}

export interface Personal {
    id: number;
    nombre: string;
    cargo?: string;
}

export interface Dependencia {
    id: number;
    nombre: string;
    sede_id: number;
}

export interface Proceso {
    id: number;
    nombre: string;
    sede_id: number;
}

export interface CentroCosto {
    id: number;
    codigo: number;
    nombre: string;
}

export interface InventarioItem {
    id?: number;
    codigo: string;
    nombre: string;
    dependencia: string;
    responsable: string;
    responsable_id: number;
    coordinador_id?: number;
    marca?: string;
    modelo?: string;
    serial?: string;
    proceso_id?: number;
    sede_id: number;
    creado_por?: number;
    // ... add other fields as needed
}

export interface ApiResponse<T> {
    mensaje: string;
    objeto: T;
    status: number;
}
