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
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const menuConfig = [
    {
        title: "Principal",
        roles: ['all'],
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['all'] },
        ]
    },
    {
        title: "Gestión de Sistemas",
        roles: ['administrador', 'admin', 'sistemas'],
        items: [
            { name: 'Inventario', href: '/inventario', icon: ClipboardDocumentListIcon, roles: ['administrador', 'admin', 'sistemas', 'compras'] },
            { name: 'Equipos PC', href: '/pc-equipos', icon: ComputerDesktopIcon, roles: ['administrador', 'admin', 'sistemas'] },
            { name: 'Entregas PC', href: '/pc-entregas', icon: TruckIcon, roles: ['administrador', 'admin', 'sistemas'] },
            { name: 'Devoluciones PC', href: '/pc-devueltos', icon: ArrowPathRoundedSquareIcon, roles: ['administrador', 'admin', 'sistemas'] },
            { name: 'Entrega Activos Fijos', href: '/entrega-activos-fijos', icon: DocumentTextIcon, roles: ['administrador', 'admin', 'sistemas'] },
            // { name: 'Mantenimientos', href: '/pc-mantenimientos', icon: WrenchScrewdriverIcon, roles: ['administrador', 'admin', 'sistemas'] },
            // { name: 'Licencias Software', href: '/pc-licencias', icon: KeyIcon, roles: ['administrador', 'admin', 'sistemas'] },
            // { name: 'Config. Cronograma', href: '/pc-cronograma', icon: CalendarDaysIcon, roles: ['administrador', 'admin', 'sistemas'] },
        ]
    },
    {
        title: "Gestión de Compras",
        roles: ['administrador', 'admin', 'compras'],
        items: [
            { name: 'Inventario', href: '/inventario', icon: ClipboardDocumentListIcon, roles: ['administrador', 'admin', 'sistemas', 'compras'] },
            { name: 'Pedidos de Compra', href: '/cp-pedidos', icon: ShoppingCartIcon, roles: ['administrador', 'admin', 'compras'] },
            { name: 'Entrega Activos Fijos', href: '/entrega-activos-fijos', icon: DocumentTextIcon, roles: ['administrador', 'admin', 'compras'] },
            { name: 'Productos', href: '/cp-productos', icon: TagIcon, roles: ['administrador', 'admin', 'compras'] },
            { name: 'Proveedores', href: '/cp-proveedores', icon: UsersIcon, roles: ['administrador', 'admin', 'compras'] },
            { name: 'Centro de Costos', href: '/cp-centro-costos', icon: BuildingOfficeIcon, roles: ['administrador', 'admin', 'compras'] },
            { name: 'Dependencias', href: '/cp-dependencias', icon: BuildingOfficeIcon, roles: ['administrador', 'admin', 'compras'] },
            { name: 'Tipos Solicitud', href: '/cp-tipos-solicitud', icon: DocumentTextIcon, roles: ['administrador', 'admin', 'compras'] },
            { name: 'Servicios', href: '/cp-productos-servicios', icon: WrenchScrewdriverIcon, roles: ['administrador', 'admin', 'compras'] },
        ]
    },
    {
        title: "Administración General",
        roles: ['administrador', 'admin'],
        items: [
            { name: 'Usuarios', href: '/usuarios', icon: UserGroupIcon, roles: ['administrador', 'admin'] },
            { name: 'Personal', href: '/personal', icon: IdentificationIcon, roles: ['administrador', 'admin'] },
            { name: 'Cargos', href: '/p-cargos', icon: BriefcaseIcon, roles: ['administrador', 'admin'] },
            { name: 'Sedes', href: '/sedes', icon: BuildingOfficeIcon, roles: ['administrador', 'admin'] }, // Route assumed, check AppRouter
            { name: 'Dependencias Sedes', href: '/dependencias-sedes', icon: BuildingOfficeIcon, roles: ['administrador', 'admin'] },
            { name: 'Áreas', href: '/areas', icon: BuildingOfficeIcon, roles: ['administrador', 'admin'] },
            { name: 'Roles', href: '/roles', icon: ShieldCheckIcon, roles: ['administrador', 'admin'] },
            { name: 'Gestión de Permisos', href: '/permisos', icon: KeyIcon, roles: ['administrador', 'admin'] },
        ]
    }
];

export default menuConfig;
