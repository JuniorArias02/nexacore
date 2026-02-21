import {
    HomeIcon,
    ClipboardDocumentListIcon,
    ComputerDesktopIcon,
    ShoppingCartIcon,
    UsersIcon,
    TagIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    WrenchScrewdriverIcon,
    TruckIcon,
    ArrowPathRoundedSquareIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    BriefcaseIcon,
    IdentificationIcon,
    KeyIcon,
    ShieldCheckIcon,
    PlusCircleIcon,
    DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

const menuConfig = [
    {
        title: "Principal",
        permissions: ['all'],
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, permissions: ['all'] },
        ]
    },
    {
        title: "Gestión de Sistemas",
        permissions: ['configuracion.dashboard_sistemas'],
        items: [
            {
                name: 'Inventario', href: '/inventario', icon: ClipboardDocumentListIcon,
                permissions: ['inventario.crear', 'inventario.actualizar', 'inventario.eliminar'],
                children: [
                    { name: 'Crear', href: '/inventario/nuevo', icon: PlusCircleIcon, permissions: ['inventario.crear'] },
                ]
            },
            {
                name: 'Equipos PC', href: '/pc-equipos', icon: ComputerDesktopIcon,
                permissions: ['pc_equipo.crear', 'pc_equipo.actualizar', 'pc_equipo.eliminar'],
                children: [
                    { name: 'Crear', href: '/pc-equipos/nuevo', icon: PlusCircleIcon, permissions: ['pc_equipo.crear'] },
                    { name: 'Hoja de Vida', href: '/pc-equipos', icon: DocumentChartBarIcon, permissions: ['pc_equipo.crear', 'pc_equipo.actualizar'] },
                ]
            },
            {
                name: 'Entregas PC', href: '/pc-entregas', icon: TruckIcon,
                permissions: ['pc_entrega.crear', 'pc_entrega.actualizar', 'pc_entrega.eliminar'],
                children: [
                    { name: 'Crear', href: '/pc-entregas/crear', icon: PlusCircleIcon, permissions: ['pc_entrega.crear'] },
                ]
            },
            {
                name: 'Devoluciones PC', href: '/pc-devueltos', icon: ArrowPathRoundedSquareIcon,
                permissions: ['pc_devuelto.crear', 'pc_devuelto.actualizar', 'pc_devuelto.eliminar'],
                children: [
                    { name: 'Crear', href: '/pc-devueltos/crear', icon: PlusCircleIcon, permissions: ['pc_devuelto.crear'] },
                ]
            }
        ]
    },
    {
        title: "Mantenimiento",
        permissions: ['configuracion.dashboard_mantenimiento'],
        items: [
            {
                name: 'Mantenimientos', href: '/mantenimientos', icon: WrenchScrewdriverIcon,
                permissions: ['mantenimiento.listar', 'mantenimiento.crear'],
                children: [
                    { name: 'Crear', href: '/mantenimientos/nuevo', icon: PlusCircleIcon, permissions: ['mantenimiento.crear'] },
                ]
            },
            { name: 'Mis Mantenimientos', href: '/mis-mantenimientos', icon: ClipboardDocumentListIcon, permissions: ['all'] },
            {
                name: 'Agenda', href: '/agenda-mantenimientos', icon: CalendarDaysIcon,
                permissions: ['agenda_mantenimiento.listar', 'agenda_mantenimiento.crear'],
            },
        ]
    },
    {
        title: "Gestión de Compras",
        permissions: ['configuracion.dashboard_compras'],
        items: [
            {
                name: 'Pedidos de Compra', href: '/cp-pedidos', icon: ShoppingCartIcon,
                permissions: ['cp_pedido.listar', 'cp_pedido.listar.compras', 'cp_pedido.listar.responsable', 'cp_pedido.crear'],
                children: [
                    { name: 'Crear', href: '/cp-pedidos/nuevo', icon: PlusCircleIcon, permissions: ['cp_pedido.crear'] },
                ]
            },
            {
                name: 'Productos', href: '/cp-productos', icon: TagIcon,
                permissions: ['cp_producto.crear', 'cp_producto.actualizar', 'cp_producto.eliminar'],
                children: [
                    { name: 'Crear', href: '/cp-productos/nuevo', icon: PlusCircleIcon, permissions: ['cp_producto.crear'] },
                ]
            },
            {
                name: 'Proveedores', href: '/cp-proveedores', icon: UsersIcon,
                permissions: ['cp_proveedor.crear', 'cp_proveedor.actualizar', 'cp_proveedor.eliminar'],
            },
            {
                name: 'Centro de Costos', href: '/cp-centro-costos', icon: BuildingOfficeIcon,
                permissions: ['cp_centro_costo.crear', 'cp_centro_costo.actualizar', 'cp_centro_costo.eliminar'],
            },
            {
                name: 'Dependencias', href: '/cp-dependencias', icon: BuildingOfficeIcon,
                permissions: ['cp_dependencia.crear', 'cp_dependencia.actualizar', 'cp_dependencia.eliminar'],
            },
            {
                name: 'Tipos Solicitud', href: '/cp-tipos-solicitud', icon: DocumentTextIcon,
                permissions: ['cp_tipo_solicitud.crear', 'cp_tipo_solicitud.actualizar', 'cp_tipo_solicitud.eliminar'],
            },
            {
                name: 'Servicios', href: '/cp-productos-servicios', icon: WrenchScrewdriverIcon,
                permissions: ['cp_producto_servicio.crear', 'cp_producto_servicio.actualizar', 'cp_producto_servicio.eliminar'],
            },
            {
                name: 'Informe Consolidado', href: '/informe-consolidado-pedidos', icon: DocumentChartBarIcon,
                permissions: ['cp_pedido.listar', 'cp_pedido.listar.compras'],
            }, {
                name: 'Entrega Activos Fijos', href: '/entrega-activos-fijos', icon: DocumentTextIcon,
                permissions: ['cp_entrega_activos_fijos.crear', 'cp_entrega_activos_fijos.actualizar', 'cp_entrega_activos_fijos.eliminar'],
                children: [
                    { name: 'Crear', href: '/entrega-activos-fijos/nuevo', icon: PlusCircleIcon, permissions: ['cp_entrega_activos_fijos.crear'] },
                ]
            },
        ]
    },
    {
        title: "Administración General",
        permissions: ['configuracion.dashboard_administrador'],
        items: [
            {
                name: 'Usuarios', href: '/usuarios', icon: UserGroupIcon,
                permissions: ['usuario.listar', 'usuario.crear'],
                children: [
                    { name: 'Crear', href: '/usuarios/nuevo', icon: PlusCircleIcon, permissions: ['usuario.crear'] },
                ]
            },
            {
                name: 'Personal', href: '/personal', icon: IdentificationIcon,
                permissions: ['personal.listar', 'personal.crear'],
                children: [
                    { name: 'Crear', href: '/personal/nuevo', icon: PlusCircleIcon, permissions: ['personal.crear'] },
                ]
            },
            {
                name: 'Cargos', href: '/p-cargos', icon: BriefcaseIcon,
                permissions: ['p_cargo.crear', 'p_cargo.actualizar', 'p_cargo.eliminar'],
                children: [
                    { name: 'Crear', href: '/p-cargos/nuevo', icon: PlusCircleIcon, permissions: ['p_cargo.crear'] },
                ]
            },
            {
                name: 'Sedes', href: '/sedes', icon: BuildingOfficeIcon,
                permissions: ['sede.crear', 'sede.actualizar', 'sede.eliminar'],
            },
            {
                name: 'Dependencias Sedes', href: '/dependencias-sedes', icon: BuildingOfficeIcon,
                permissions: ['dependencia_sede.crear', 'dependencia_sede.actualizar', 'dependencia_sede.eliminar'],
                children: [
                    { name: 'Crear', href: '/dependencias-sedes/nuevo', icon: PlusCircleIcon, permissions: ['dependencia_sede.crear'] },
                ]
            },
            {
                name: 'Áreas', href: '/areas', icon: BuildingOfficeIcon,
                permissions: ['area.crear', 'area.actualizar', 'area.eliminar'],
                children: [
                    { name: 'Crear', href: '/areas/nuevo', icon: PlusCircleIcon, permissions: ['area.crear'] },
                ]
            },
            {
                name: 'Roles', href: '/roles', icon: ShieldCheckIcon,
                permissions: ['rol.crear', 'rol.actualizar', 'rol.eliminar'],
                children: [
                    { name: 'Crear', href: '/roles/nuevo', icon: PlusCircleIcon, permissions: ['rol.crear'] },
                ]
            },
            {
                name: 'Gestión de Permisos', href: '/permisos', icon: KeyIcon,
                permissions: ['permiso.crear', 'permiso.actualizar', 'permiso.eliminar'],
            },
        ]
    }
];

export default menuConfig;
