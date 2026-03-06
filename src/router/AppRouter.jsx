import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../modules/auth/pages/LoginPage';
import ForgotPasswordPage from '../modules/auth/pages/ForgotPasswordPage';
import InformacionWebPage from '../modules/informacionWeb/pages/InformacionWebPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import InventoryFormPage from '../modules/inventario/pages/InventoryFormPage';
import InventoryListPage from '../modules/inventario/pages/InventoryListPage';
import InventoryDetailPage from '../modules/inventario/pages/InventoryDetailPage';
import DependenciaSedeList from '../modules/dependenciaSede/pages/DependenciaSedeList';
import DependenciaSedeFormPage from '../modules/dependenciaSede/pages/DependenciaSedeFormPage';
import CpDependenciaList from '../modules/cpDependencia/pages/CpDependenciaList';
import CpDependenciaFormPage from '../modules/cpDependencia/pages/CpDependenciaFormPage';
import CpCentroCostoList from '../modules/cpCentroCosto/pages/CpCentroCostoList';
import CpCentroCostoFormPage from '../modules/cpCentroCosto/pages/CpCentroCostoFormPage';
import CpProductoList from '../modules/cpProducto/pages/CpProductoList';
import CpProductoFormPage from '../modules/cpProducto/pages/CpProductoFormPage';
import CpProductoServicioList from '../modules/cpProductoServicio/pages/CpProductoServicioList';
import CpProductoServicioFormPage from '../modules/cpProductoServicio/pages/CpProductoServicioFormPage';
import CpTipoSolicitudList from '../modules/cpTipoSolicitud/pages/CpTipoSolicitudList';
import CpTipoSolicitudFormPage from '../modules/cpTipoSolicitud/pages/CpTipoSolicitudFormPage';
import PCargoList from '../modules/pCargo/pages/PCargoList';
import PCargoFormPage from '../modules/pCargo/pages/PCargoFormPage';
import PersonalList from '../modules/personal/pages/PersonalList';
import PersonalFormPage from '../modules/personal/pages/PersonalFormPage';
import RoleList from '../modules/roles/pages/RoleList';
import RoleFormPage from '../modules/roles/pages/RoleFormPage';
import UserList from '../modules/users/pages/UserList';
import UserFormPage from '../modules/users/pages/UserFormPage';
import CpPedidoCreatePage from '../modules/cpPedidos/pages/CpPedidoCreatePage';
import CpPedidoEditPage from '../modules/cpPedidos/pages/CpPedidoEditPage';
import CpPedidoList from '../modules/cpPedidos/pages/CpPedidoList';
import CpPedidoDetail from '../modules/cpPedidos/pages/CpPedidoDetail';
import InformeConsolidadoPage from '../modules/cpPedidos/pages/InformeConsolidadoPage';
import EntregaActivosFijosList from '../modules/entregaActivosFijos/pages/EntregaActivosFijosList';
import EntregaActivosFijosForm from '../modules/entregaActivosFijos/pages/EntregaActivosFijosForm';
import AreasList from '../modules/areas/pages/AreasList';
import AreasForm from '../modules/areas/pages/AreasForm';
import PcEquiposList from '../modules/pcEquipos/pages/PcEquiposList';
import PcEquiposForm from '../modules/pcEquipos/pages/PcEquiposForm';
import HojaDeVidaEquipoPage from '../modules/pcEquipos/pages/HojaDeVidaEquipoPage';
import PcEntregasList from '../modules/pcEntregas/pages/PcEntregasList';
import PcEntregasForm from '../modules/pcEntregas/pages/PcEntregasForm';
import PcDevueltoList from '../modules/pcDevuelto/pages/PcDevueltoList';
import PcDevueltoForm from '../modules/pcDevuelto/pages/PcDevueltoForm';
import ProfilePage from '../modules/profile/pages/ProfilePage';
import ConfigurationPage from '../modules/configuration/pages/ConfigurationPage';
import PermisosPage from '../modules/configuration/pages/PermisosPage';
import MantenimientoList from '../modules/mantenimiento/pages/MantenimientoList';
import MantenimientoFormPage from '../modules/mantenimiento/pages/MantenimientoFormPage';
import MantenimientoReceptorPage from '../modules/mantenimiento/pages/MantenimientoReceptorPage';
import AgendaMantenimientoList from '../modules/agendaMantenimiento/pages/AgendaMantenimientoList';
import AgendaMantenimientoFormPage from '../modules/agendaMantenimiento/pages/AgendaMantenimientoFormPage';
import ReportesMantenimientos from '../modules/agendaMantenimiento/pages/ReportesMantenimientos';
import MainLayout from '../layout/MainLayout';
import PermissionProtectedRoute from '../components/common/PermissionProtectedRoute';

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600 animate-pulse">Cargando aplicación...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Componente para redirigir si ya está autenticado (para login)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600 animate-pulse">Cargando...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Rutas Públicas */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <PublicRoute>
                            <ForgotPasswordPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/info-sistema"
                    element={
                        <PublicRoute>
                            <InformacionWebPage />
                        </PublicRoute>
                    }
                />

                {/* Rutas Privadas */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* PC Equipos */}
                    <Route path="/pc-equipos" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_equipo.crear', 'pc_equipo.actualizar', 'pc_equipo.eliminar']}>
                            <PcEquiposList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/pc-equipos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_equipo.crear']}>
                            <PcEquiposForm />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/pc-equipos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_equipo.actualizar']}>
                            <PcEquiposForm />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/pc-equipos/hoja-de-vida/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_equipo.crear', 'pc_equipo.actualizar']}>
                            <HojaDeVidaEquipoPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* PcEntregas */}
                    <Route path="/pc-entregas" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_entrega.crear', 'pc_entrega.actualizar', 'pc_entrega.eliminar']}>
                            <PcEntregasList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/pc-entregas/crear" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_entrega.crear']}>
                            <PcEntregasForm />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/pc-entregas/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_entrega.actualizar']}>
                            <PcEntregasForm />
                        </PermissionProtectedRoute>
                    } />

                    {/* PcDevueltos */}
                    <Route path="/pc-devueltos" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_devuelto.crear', 'pc_devuelto.actualizar', 'pc_devuelto.eliminar']}>
                            <PcDevueltoList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/pc-devueltos/crear" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_devuelto.crear']}>
                            <PcDevueltoForm />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/pc-devueltos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['pc_devuelto.actualizar']}>
                            <PcDevueltoForm />
                        </PermissionProtectedRoute>
                    } />

                    {/* Inventario */}
                    <Route path="/inventario" element={
                        <PermissionProtectedRoute requiredPermissions={['inventario.crear', 'inventario.actualizar', 'inventario.eliminar']}>
                            <InventoryListPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/inventario/detalle/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['inventario.crear', 'inventario.actualizar']}>
                            <InventoryDetailPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/inventario/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['inventario.crear']}>
                            <InventoryFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/inventario/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['inventario.actualizar']}>
                            <InventoryFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Dependencias Sedes */}
                    <Route path="/dependencias-sedes" element={
                        <PermissionProtectedRoute requiredPermissions={['dependencia_sede.crear', 'dependencia_sede.actualizar', 'dependencia_sede.eliminar']}>
                            <DependenciaSedeList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/dependencias-sedes/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['dependencia_sede.crear']}>
                            <DependenciaSedeFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/dependencias-sedes/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['dependencia_sede.actualizar']}>
                            <DependenciaSedeFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* CP Dependencias */}
                    <Route path="/cp-dependencias" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_dependencia.crear', 'cp_dependencia.actualizar', 'cp_dependencia.eliminar']}>
                            <CpDependenciaList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-dependencias/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_dependencia.crear']}>
                            <CpDependenciaFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-dependencias/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_dependencia.actualizar']}>
                            <CpDependenciaFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* CP Centro Costos */}
                    <Route path="/cp-centro-costos" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_centro_costo.crear', 'cp_centro_costo.actualizar', 'cp_centro_costo.eliminar']}>
                            <CpCentroCostoList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-centro-costos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_centro_costo.crear']}>
                            <CpCentroCostoFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-centro-costos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_centro_costo.actualizar']}>
                            <CpCentroCostoFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* CP Productos */}
                    <Route path="/cp-productos" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_producto.crear', 'cp_producto.actualizar', 'cp_producto.eliminar']}>
                            <CpProductoList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-productos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_producto.crear']}>
                            <CpProductoFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-productos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_producto.actualizar']}>
                            <CpProductoFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* CP Productos Servicios */}
                    <Route path="/cp-productos-servicios" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_producto_servicio.crear', 'cp_producto_servicio.actualizar', 'cp_producto_servicio.eliminar']}>
                            <CpProductoServicioList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-productos-servicios/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_producto_servicio.crear']}>
                            <CpProductoServicioFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-productos-servicios/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_producto_servicio.actualizar']}>
                            <CpProductoServicioFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* CP Tipos Solicitud */}
                    <Route path="/cp-tipos-solicitud" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_tipo_solicitud.crear', 'cp_tipo_solicitud.actualizar', 'cp_tipo_solicitud.eliminar']}>
                            <CpTipoSolicitudList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-tipos-solicitud/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_tipo_solicitud.crear']}>
                            <CpTipoSolicitudFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-tipos-solicitud/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_tipo_solicitud.actualizar']}>
                            <CpTipoSolicitudFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* P Cargos */}
                    <Route path="/p-cargos" element={
                        <PermissionProtectedRoute requiredPermissions={['p_cargo.crear', 'p_cargo.actualizar', 'p_cargo.eliminar']}>
                            <PCargoList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/p-cargos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['p_cargo.crear']}>
                            <PCargoFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/p-cargos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['p_cargo.actualizar']}>
                            <PCargoFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Personal */}
                    <Route path="/personal" element={
                        <PermissionProtectedRoute requiredPermissions={['personal.listar', 'personal.crear']}>
                            <PersonalList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/personal/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['personal.crear']}>
                            <PersonalFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/personal/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['personal.crear']}>
                            <PersonalFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Roles */}
                    <Route path="/roles" element={
                        <PermissionProtectedRoute requiredPermissions={['rol.crear', 'rol.actualizar', 'rol.eliminar']}>
                            <RoleList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/roles/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['rol.crear']}>
                            <RoleFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/roles/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['rol.actualizar']}>
                            <RoleFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Usuarios */}
                    <Route path="/usuarios" element={
                        <PermissionProtectedRoute requiredPermissions={['usuario.listar', 'usuario.crear']}>
                            <UserList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/usuarios/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['usuario.crear']}>
                            <UserFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/usuarios/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['usuario.crear']}>
                            <UserFormPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Pedidos de Compra */}
                    <Route path="/cp-pedidos" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_pedido.listar', 'cp_pedido.listar.compras', 'cp_pedido.listar.responsable', 'cp_pedido.crear']}>
                            <CpPedidoList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-pedidos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_pedido.crear']}>
                            <CpPedidoCreatePage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-pedidos/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_pedido.listar', 'cp_pedido.crear']}>
                            <CpPedidoDetail />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/cp-pedidos/:id/editar" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_pedido.crear']}>
                            <CpPedidoEditPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/informe-consolidado-pedidos" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_pedido.listar', 'cp_pedido.listar.compras']}>
                            <InformeConsolidadoPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Entrega de Activos Fijos */}
                    <Route path="/entrega-activos-fijos" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.crear', 'cp_entrega_activos_fijos.actualizar', 'cp_entrega_activos_fijos.eliminar']}>
                            <EntregaActivosFijosList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/entrega-activos-fijos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.crear']}>
                            <EntregaActivosFijosForm />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/entrega-activos-fijos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.actualizar']}>
                            <EntregaActivosFijosForm />
                        </PermissionProtectedRoute>
                    } />

                    {/* Áreas */}
                    <Route path="/areas" element={
                        <PermissionProtectedRoute requiredPermissions={['area.crear', 'area.actualizar', 'area.eliminar']}>
                            <AreasList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/areas/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['area.crear']}>
                            <AreasForm />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/areas/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['area.actualizar']}>
                            <AreasForm />
                        </PermissionProtectedRoute>
                    } />

                    {/* Profile & Configuration */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/configuration" element={
                        <PermissionProtectedRoute requiredPermissions={['permiso.crear', 'permiso.actualizar', 'permiso.eliminar']}>
                            <ConfigurationPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/permisos" element={
                        <PermissionProtectedRoute requiredPermissions={['permiso.crear', 'permiso.actualizar', 'permiso.eliminar']}>
                            <PermisosPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Mantenimientos */}
                    <Route path="/mantenimientos" element={
                        <PermissionProtectedRoute requiredPermissions={['mantenimiento.listar', 'mantenimiento.crear']}>
                            <MantenimientoList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/mantenimientos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['mantenimiento.crear']}>
                            <MantenimientoFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/mantenimientos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['mantenimiento.crear']}>
                            <MantenimientoFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/mantenimientos/reportes" element={
                        <PermissionProtectedRoute requiredPermissions={['mantenimiento.reportes']}>
                            <ReportesMantenimientos />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/mis-mantenimientos" element={
                        <PermissionProtectedRoute requiredPermissions={['mantenimiento.seleccion_coordinador', 'mantenimiento.seleccion_tecnico', 'mantenimiento.listar_todos']}>
                            <MantenimientoReceptorPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Agenda Mantenimientos */}
                    <Route path="/agenda-mantenimientos" element={
                        <PermissionProtectedRoute requiredPermissions={['agenda_mantenimiento.listar', 'agenda_mantenimiento.crear', 'agenda_mantenimiento.listar_tecnico', 'agenda_mantenimiento.listar_coordinador']}>
                            <AgendaMantenimientoList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/agenda-mantenimientos/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['agenda_mantenimiento.crear']}>
                            <AgendaMantenimientoFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/agenda-mantenimientos/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['agenda_mantenimiento.crear']}>
                            <AgendaMantenimientoFormPage />
                        </PermissionProtectedRoute>
                    } />
                </Route>

                {/* Redirecciones por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
