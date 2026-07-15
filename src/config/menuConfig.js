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
    FolderIcon,
    ExclamationTriangleIcon,
    ClipboardDocumentCheckIcon,
    PresentationChartLineIcon,
    ServerStackIcon,
    Cog6ToothIcon,
    ArrowDownTrayIcon,
    CloudArrowDownIcon,
    PhotoIcon,
    InboxIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';


const menuConfig = [
    {
        title: "Principal",
        icon: HomeIcon,
        iconBg: "bg-white border border-violet-100",
        iconColor: "text-violet-600",
        groupBg: "bg-violet-50 border border-violet-200",
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, permissions: ['all'] },
        ]
    },
    {
        title: "Gestión de Sistemas",
        icon: ComputerDesktopIcon,
        iconBg: "bg-white border border-blue-100",
        iconColor: "text-blue-600",
        groupBg: "bg-blue-50 border border-blue-200",
        items: [
            {
                name: 'Equipos PC', href: '/gestion-sistemas/pc-equipos', icon: ComputerDesktopIcon,
                permissions: ['pc_equipo.crear', 'pc_equipo.actualizar', 'pc_equipo.eliminar'],
                children: [
                    { name: 'Crear Equipo PC', href: '/gestion-sistemas/pc-equipos/nuevo', icon: PlusCircleIcon, permissions: ['pc_equipo.crear'] },
                    { name: 'Hoja de Vida', href: '/gestion-sistemas/pc-equipos', icon: DocumentChartBarIcon, permissions: ['pc_equipo.crear', 'pc_equipo.actualizar'] },
                ]
            },
            {
                name: 'Actas de Entrega', href: '/gestion-sistemas/actas-entrega', icon: TruckIcon,
                permissions: ['pc_entrega.crear', 'pc_entrega.actualizar', 'pc_entrega.eliminar'],
                children: [
                    { name: 'Nueva Acta', href: '/gestion-sistemas/actas-entrega/nuevo', icon: PlusCircleIcon, permissions: ['pc_entrega.crear'] },
                ]
            },
            {
                name: 'Actas de Devolución', href: '/gestion-sistemas/actas-devolucion', icon: ArrowPathRoundedSquareIcon,
                permissions: ['pc_devuelto.crear', 'pc_devuelto.actualizar', 'pc_devuelto.eliminar'],
                children: [
                    { name: 'Nueva Devolución', href: '/gestion-sistemas/actas-devolucion/nuevo', icon: PlusCircleIcon, permissions: ['pc_devuelto.crear'] },
                ]
            },
            {
                name: 'Mantenimientos PC', href: '/gestion-sistemas/pc-mantenimientos', icon: WrenchScrewdriverIcon,
                permissions: ['pc_mantenimiento.listar', 'pc_mantenimiento.crear', 'pc_mantenimiento.actualizar', 'pc_mantenimiento.eliminar'],
                children: [
                    { name: 'Crear Mantenimiento', href: '/gestion-sistemas/pc-mantenimientos/nuevo', icon: PlusCircleIcon, permissions: ['pc_mantenimiento.crear'] },
                    { name: 'Cronograma', href: '/gestion-sistemas/pc-mantenimientos/cronograma', icon: CalendarDaysIcon, permissions: ['pc_mantenimiento.listar'] },
                    { name: 'Historial', href: '/gestion-sistemas/pc-mantenimientos', icon: DocumentTextIcon, permissions: ['pc_mantenimiento.listar'] },
                ]
            }
        ]
    },
    {
        title: "Gestión Infraestructura",
        icon: ServerStackIcon,
        iconBg: "bg-white border border-emerald-100",
        iconColor: "text-emerald-600",
        groupBg: "bg-emerald-50 border border-emerald-200",
        items: [
            {
                name: 'Mantenimientos', href: '/mantenimientos', icon: WrenchScrewdriverIcon,
                permissions: ['mantenimiento.listar', 'mantenimiento.crear'],
                children: [
                    { name: 'Crear Mantenimiento', href: '/mantenimientos/nuevo', icon: PlusCircleIcon, permissions: ['mantenimiento.crear'] },
                ]
            },
            { name: 'Mis Mantenimientos', href: '/mis-mantenimientos', icon: ClipboardDocumentListIcon, permissions: ['mantenimiento.seleccion_coordinador', 'mantenimiento.listar_todos'] },
            {
                name: 'Agenda', href: '/agenda-mantenimientos', icon: CalendarDaysIcon,
                permissions: ['agenda_mantenimiento.listar', 'agenda_mantenimiento.crear', 'agenda_mantenimiento.listar_tecnico', 'agenda_mantenimiento.listar_coordinador'],
            },
            { name: 'Reportes', href: '/mantenimientos/reportes', icon: DocumentChartBarIcon, permissions: ['mantenimiento.reportes'] },
        ]
    },
    {
        title: "Gestión de Compras",
        icon: ShoppingCartIcon,
        iconBg: "bg-white border border-amber-100",
        iconColor: "text-amber-600",
        groupBg: "bg-amber-50 border border-amber-200",
        items: [
            {
                name: 'Inventario', href: '/inventario', icon: ClipboardDocumentListIcon,
                permissions: ['inventario.crear', 'inventario.actualizar', 'inventario.eliminar'],
                children: [
                    { name: 'Crear Inventario', href: '/inventario/nuevo', icon: PlusCircleIcon, permissions: ['inventario.crear'] },
                ]
            },
            {
                name: 'Pedidos de Compra', href: '/gestion-compras/cp-pedidos', icon: ShoppingCartIcon,
                permissions: ['cp_pedido.listar', 'cp_pedido.listar.compras', 'cp_pedido.listar.responsable', 'cp_pedido.crear'],
                children: [
                    { name: 'Crear Pedido', href: '/gestion-compras/cp-pedidos/nuevo', icon: PlusCircleIcon, permissions: ['cp_pedido.crear'] },
                ]
            },
            {
                name: 'Pedidos Programados', href: '/gestion-compras/cp-pedidos-programados', icon: ClockIcon,
                permissions: ['cp_pedido.listar', 'cp_pedido.crear'],
            },
            {
                name: 'Informe Consolidado', href: '/gestion-compras/informe-consolidado-pedidos', icon: DocumentChartBarIcon,
                permissions: ['cp_pedido.consolidado'],
            }, {
                name: 'Entrega Activos Fijos', href: '/gestion-compras/entrega-activos-fijos', icon: DocumentTextIcon,
                permissions: ['cp_entrega_activos_fijos.crear', 'cp_entrega_activos_fijos.actualizar', 'cp_entrega_activos_fijos.eliminar'],
                children: [
                    { name: 'Crear Entrega Activos', href: '/gestion-compras/entrega-activos-fijos/nuevo', icon: PlusCircleIcon, permissions: ['cp_entrega_activos_fijos.crear'] },
                    { name: 'Historial', href: '/gestion-compras/entrega-activos-fijos/historial', icon: FolderIcon, permissions: ['cp_entrega_activos_fijos.listar'] },
                ]

            },
            {
                name: 'Productos', href: '/gestion-compras/cp-productos', icon: TagIcon,
                permissions: ['cp_producto.crear', 'cp_producto.actualizar', 'cp_producto.eliminar'],
                children: [
                    { name: 'Crear Producto', href: '/gestion-compras/cp-productos/nuevo', icon: PlusCircleIcon, permissions: ['cp_producto.crear'] },
                ]
            },
            {
                name: 'Proveedores', href: '/gestion-compras/cp-proveedores', icon: UsersIcon,
                permissions: ['cp_proveedor.crear', 'cp_proveedor.actualizar', 'cp_proveedor.eliminar'],
            },
            {
                name: 'Centro de Costos', href: '/gestion-compras/cp-centro-costos', icon: BuildingOfficeIcon,
                permissions: ['cp_centro_costo.crear', 'cp_centro_costo.actualizar', 'cp_centro_costo.eliminar'],
            },
            {
                name: 'Dependencias', href: '/gestion-compras/cp-dependencias', icon: BuildingOfficeIcon,
                permissions: ['cp_dependencia.crear', 'cp_dependencia.actualizar', 'cp_dependencia.eliminar'],
            },
            {
                name: 'Tipos Solicitud', href: '/gestion-compras/cp-tipos-solicitud', icon: DocumentTextIcon,
                permissions: ['cp_tipo_solicitud.crear', 'cp_tipo_solicitud.actualizar', 'cp_tipo_solicitud.eliminar'],
            },
            {
                name: 'Producto / Servicios', href: '/gestion-compras/cp-productos-servicios', icon: WrenchScrewdriverIcon,
                permissions: ['cp_producto_servicio.crear', 'cp_producto_servicio.actualizar', 'cp_producto_servicio.eliminar'],
            }
        ]
    },
    {
        title: "Administración General",
        icon: Cog6ToothIcon,
        iconBg: "bg-white border border-rose-100",
        iconColor: "text-rose-600",
        groupBg: "bg-rose-50 border border-rose-200",
        items: [
            {
                name: 'Usuarios', href: '/usuarios', icon: UserGroupIcon,
                permissions: ['usuario.listar', 'usuario.crear'],
                children: [
                    { name: 'Crear Usuario', href: '/usuarios/nuevo', icon: PlusCircleIcon, permissions: ['usuario.crear'] },
                ]
            },
            {
                name: 'Personal', href: '/personal', icon: IdentificationIcon,
                permissions: ['personal.listar', 'personal.crear'],
                children: [
                    { name: 'Crear Personal', href: '/personal/nuevo', icon: PlusCircleIcon, permissions: ['personal.crear'] },
                ]
            },
            {
                name: 'Cargos', href: '/p-cargos', icon: BriefcaseIcon,
                permissions: ['p_cargo.crear', 'p_cargo.actualizar', 'p_cargo.eliminar'],
                children: [
                    { name: 'Crear Cargo', href: '/p-cargos/nuevo', icon: PlusCircleIcon, permissions: ['p_cargo.crear'] },
                ]
            },
            {
                name: 'Sedes', href: '/sedes', icon: BuildingOfficeIcon,
                permissions: ['sede.crear', 'sede.actualizar', 'sede.eliminar'],
                children: [
                    { name: 'Crear Sede', href: '/sedes/nuevo', icon: PlusCircleIcon, permissions: ['sede.crear'] },
                ]
            },
            {
                name: 'Dependencias Sedes', href: '/dependencias-sedes', icon: BuildingOfficeIcon,
                permissions: ['dependencia_sede.crear', 'dependencia_sede.actualizar', 'dependencia_sede.eliminar'],
                children: [
                    { name: 'Crear Dependencia Sede', href: '/dependencias-sedes/nuevo', icon: PlusCircleIcon, permissions: ['dependencia_sede.crear'] },
                ]
            },
            {
                name: 'Áreas', href: '/areas', icon: BuildingOfficeIcon,
                permissions: ['area.crear', 'area.actualizar', 'area.eliminar'],
                children: [
                    { name: 'Crear Área', href: '/areas/nuevo', icon: PlusCircleIcon, permissions: ['area.crear'] },
                ]
            },
            {
                name: 'Roles', href: '/roles', icon: ShieldCheckIcon,
                permissions: ['rol.crear', 'rol.actualizar', 'rol.eliminar'],
                children: [
                    { name: 'Crear Rol', href: '/roles/nuevo', icon: PlusCircleIcon, permissions: ['rol.crear'] },
                ]
            },
            {
                name: 'Gestión de Permisos', href: '/permisos', icon: KeyIcon,
                permissions: ['permiso.crear', 'permiso.actualizar', 'permiso.eliminar'],
            },
            {
                name: 'Imagen Mensual', href: '/imagen-mensual', icon: PhotoIcon,
                permissions: ['imagen_mensual.crud'],
            },
        ]
    },
    {
        title: "Buzón de Sugerencias",
        icon: InboxIcon,
        iconBg: "bg-white border border-fuchsia-100",
        iconColor: "text-fuchsia-600",
        groupBg: "bg-fuchsia-50 border border-fuchsia-200",
        items: [
            {
                name: 'Mis Sugerencias', href: '/buzon', icon: InboxIcon,
                permissions: ['buzon.mias'],
                children: [
                    { name: 'Crear Sugerencia', href: '/buzon/nuevo', icon: PlusCircleIcon, permissions: ['buzon.mias'] },
                ]
            },
            {
                name: 'Bandeja de Agente', href: '/buzon/agente', icon: ChatBubbleLeftRightIcon,
                permissions: ['buzon.agente']
            }
        ]
    },{
        title: "Otros",
        icon: FolderIcon,
        iconBg: "bg-white border border-slate-200",
        iconColor: "text-slate-600",
        groupBg: "bg-slate-50 border border-slate-200",
        items: [
            {
                name: 'Descargar Fondo App', 
                href: 'https://clinicalhouse.co/deparSistemApi/public/fondoAppv1.exe', 
                icon: ArrowDownTrayIcon,
                permissions: [],
                external: true
            },
            {
                name: 'Restaurar Fondo', 
                href: 'https://clinicalhouse.co/deparSistemApi/public/RestaurarFondo.exe', 
                icon: CloudArrowDownIcon,
                permissions: [],
                external: true
            },
            {
                name: 'Imagen Mensual', 
                href: `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/imagen-mensual`, 
                icon: PhotoIcon,
                permissions: [],
                external: true,
                isApiDownload: true
            },
            {
                name: 'Descargar Hosts (Bloqueo Redes)',
                href: '/hosts',
                icon: ShieldCheckIcon,
                permissions: [],
                external: true,
                download: 'hosts'
            }
        ]
    }
];

export default menuConfig;
