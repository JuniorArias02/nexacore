import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../modules/auth/pages/LoginPage';
import ForgotPasswordPage from '../modules/auth/pages/ForgotPasswordPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import InventoryFormPage from '../modules/inventario/pages/InventoryFormPage';
import InventoryListPage from '../modules/inventario/pages/InventoryListPage';
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
import MainLayout from '../layout/MainLayout';

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

                {/* Rutas Privadas */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Inventario */}
                    <Route path="/inventario" element={<InventoryListPage />} />

                    {/* PcEntregas */}
                    <Route path="/pc-entregas" element={<PcEntregasList />} />
                    <Route path="/pc-entregas/crear" element={<PcEntregasForm />} />
                    <Route path="/pc-entregas/editar/:id" element={<PcEntregasForm />} />

                    {/* PcDevueltos */}
                    <Route path="/pc-devueltos" element={<PcDevueltoList />} />
                    <Route path="/pc-devueltos/crear" element={<PcDevueltoForm />} />
                    <Route path="/pc-devueltos/editar/:id" element={<PcDevueltoForm />} />

                    <Route path="/inventario/nuevo" element={<InventoryFormPage />} />
                    <Route path="/inventario/editar/:id" element={<InventoryFormPage />} />

                    {/* PC Equipos */}
                    <Route path="/pc-equipos" element={<PcEquiposList />} />
                    <Route path="/pc-equipos/nuevo" element={<PcEquiposForm />} />
                    <Route path="/pc-equipos/editar/:id" element={<PcEquiposForm />} />
                    <Route path="/pc-equipos/hoja-de-vida/:id" element={<HojaDeVidaEquipoPage />} />

                    {/* Dependencias Sedes */}
                    <Route path="/dependencias-sedes" element={<DependenciaSedeList />} />
                    <Route path="/dependencias-sedes/nuevo" element={<DependenciaSedeFormPage />} />
                    <Route path="/dependencias-sedes/editar/:id" element={<DependenciaSedeFormPage />} />

                    {/* CP Dependencias */}
                    <Route path="/cp-dependencias" element={<CpDependenciaList />} />
                    <Route path="/cp-dependencias/nuevo" element={<CpDependenciaFormPage />} />
                    <Route path="/cp-dependencias/editar/:id" element={<CpDependenciaFormPage />} />

                    {/* CP Centro Costos */}
                    <Route path="/cp-centro-costos" element={<CpCentroCostoList />} />
                    <Route path="/cp-centro-costos/nuevo" element={<CpCentroCostoFormPage />} />
                    <Route path="/cp-centro-costos/editar/:id" element={<CpCentroCostoFormPage />} />

                    {/* CP Productos */}
                    <Route path="/cp-productos" element={<CpProductoList />} />
                    <Route path="/cp-productos/nuevo" element={<CpProductoFormPage />} />
                    <Route path="/cp-productos/editar/:id" element={<CpProductoFormPage />} />

                    {/* CP Productos Servicios */}
                    <Route path="/cp-productos-servicios" element={<CpProductoServicioList />} />
                    <Route path="/cp-productos-servicios/nuevo" element={<CpProductoServicioFormPage />} />
                    <Route path="/cp-productos-servicios/editar/:id" element={<CpProductoServicioFormPage />} />

                    {/* CP Tipos Solicitud */}
                    <Route path="/cp-tipos-solicitud" element={<CpTipoSolicitudList />} />
                    <Route path="/cp-tipos-solicitud/nuevo" element={<CpTipoSolicitudFormPage />} />
                    <Route path="/cp-tipos-solicitud/editar/:id" element={<CpTipoSolicitudFormPage />} />

                    {/* P Cargos */}
                    <Route path="/p-cargos" element={<PCargoList />} />
                    <Route path="/p-cargos/nuevo" element={<PCargoFormPage />} />
                    <Route path="/p-cargos/editar/:id" element={<PCargoFormPage />} />

                    {/* Personal */}
                    <Route path="/personal" element={<PersonalList />} />
                    <Route path="/personal/nuevo" element={<PersonalFormPage />} />
                    <Route path="/personal/editar/:id" element={<PersonalFormPage />} />

                    {/* Roles */}
                    <Route path="/roles" element={<RoleList />} />
                    <Route path="/roles/nuevo" element={<RoleFormPage />} />
                    <Route path="/roles/editar/:id" element={<RoleFormPage />} />

                    {/* Usuarios */}
                    <Route path="/usuarios" element={<UserList />} />
                    <Route path="/usuarios/nuevo" element={<UserFormPage />} />
                    <Route path="/usuarios/editar/:id" element={<UserFormPage />} />

                    {/* Pedidos de Compra */}
                    <Route path="/cp-pedidos" element={<CpPedidoList />} />
                    <Route path="/cp-pedidos/nuevo" element={<CpPedidoCreatePage />} />
                    <Route path="/cp-pedidos/:id" element={<CpPedidoDetail />} />
                    <Route path="/informe-consolidado-pedidos" element={<InformeConsolidadoPage />} />

                    {/* Entrega de Activos Fijos */}
                    <Route path="/entrega-activos-fijos" element={<EntregaActivosFijosList />} />
                    <Route path="/entrega-activos-fijos/nuevo" element={<EntregaActivosFijosForm />} />
                    <Route path="/entrega-activos-fijos/editar/:id" element={<EntregaActivosFijosForm />} />

                    {/* Áreas */}
                    <Route path="/areas" element={<AreasList />} />
                    <Route path="/areas/nuevo" element={<AreasForm />} />
                    <Route path="/areas/editar/:id" element={<AreasForm />} />

                    {/* Profile & Configuration */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/configuration" element={<ConfigurationPage />} />
                    <Route path="/permisos" element={<PermisosPage />} />

                    {/* Mantenimientos */}
                    <Route path="/mantenimientos" element={<MantenimientoList />} />
                    <Route path="/mantenimientos/nuevo" element={<MantenimientoFormPage />} />
                    <Route path="/mantenimientos/editar/:id" element={<MantenimientoFormPage />} />
                    <Route path="/mis-mantenimientos" element={<MantenimientoReceptorPage />} />

                    {/* Agenda Mantenimientos */}
                    <Route path="/agenda-mantenimientos" element={<AgendaMantenimientoList />} />
                    <Route path="/agenda-mantenimientos/nuevo" element={<AgendaMantenimientoFormPage />} />
                    <Route path="/agenda-mantenimientos/editar/:id" element={<AgendaMantenimientoFormPage />} />
                </Route>

                {/* Redirecciones por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
