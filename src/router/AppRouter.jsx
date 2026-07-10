import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../modules/Autenticacion/pages/LoginPage';
import ForgotPasswordPage from '../modules/Autenticacion/pages/ForgotPasswordPage';
import InformacionWebPage from '../modules/InformacionWeb/pages/InformacionWebPage';
import DashboardPage from '../modules/Tablero/pages/DashboardPage';
import InventoryFormPage from '../modules/GestionCompras/Inventario/pages/InventoryFormPage';
import InventoryListPage from '../modules/GestionCompras/Inventario/pages/InventoryListPage';
import InventoryDetailPage from '../modules/GestionCompras/Inventario/pages/InventoryDetailPage';
import DependenciaSedeList from '../modules/Configuracion/DependenciaSede/pages/DependenciaSedeList';
import DependenciaSedeFormPage from '../modules/Configuracion/DependenciaSede/pages/DependenciaSedeFormPage';

import PCargoList from '../modules/Configuracion/PCargo/pages/PCargoList';
import PCargoFormPage from '../modules/Configuracion/PCargo/pages/PCargoFormPage';
import PersonalList from '../modules/Configuracion/Personal/pages/PersonalList';
import PersonalFormPage from '../modules/Configuracion/Personal/pages/PersonalFormPage';
import RoleList from '../modules/Configuracion/Roles/pages/RoleList';
import RoleFormPage from '../modules/Configuracion/Roles/pages/RoleFormPage';
import UserList from '../modules/Configuracion/Usuarios/pages/UserList';
import UserFormPage from '../modules/Configuracion/Usuarios/pages/UserFormPage';


import AreasList from '../modules/Configuracion/Areas/pages/AreasList';
import AreasForm from '../modules/Configuracion/Areas/pages/AreasForm';

import SedesList from '../modules/Configuracion/Sede/pages/SedesList';
import SedesForm from '../modules/Configuracion/Sede/pages/SedesForm';

import ProfilePage from '../modules/PerfilUsuario/pages/ProfilePage';
import ConfigurationPage from '../modules/Configuracion/Tablero/pages/ConfigurationPage';
import PermisosPage from '../modules/Configuracion/Permisos/pages/PermisosPage';
import ImagenMensualPage from '../modules/Configuracion/ImagenMensual/pages/ImagenMensualPage';
import MantenimientoList from '../modules/GestionInfraestructura/Mantenimiento/pages/MantenimientoList';
import MantenimientoFormPage from '../modules/GestionInfraestructura/Mantenimiento/pages/MantenimientoFormPage';
import MantenimientoReceptorPage from '../modules/GestionInfraestructura/Mantenimiento/pages/MantenimientoReceptorPage';
import AgendaMantenimientoList from '../modules/GestionInfraestructura/AgendaMantenimiento/pages/AgendaMantenimientoList';
import AgendaMantenimientoFormPage from '../modules/GestionInfraestructura/AgendaMantenimiento/pages/AgendaMantenimientoFormPage';
import ReportesMantenimientos from '../modules/GestionInfraestructura/AgendaMantenimiento/pages/ReportesMantenimientos';

import MainLayout from '../layout/MainLayout';
import PermissionProtectedRoute from '../components/common/PermissionProtectedRoute';
import Error404 from '../modules/PaginasError/pages/Error404';
import Error500 from '../modules/PaginasError/pages/Error500';
import Error403 from '../modules/PaginasError/pages/Error403';
import ComingSoon from '../modules/PaginasError/pages/ComingSoon';
import BuzonSugerenciasList from '../modules/BuzonSugerencias/pages/BuzonSugerenciasList';
import BuzonAgenteList from '../modules/BuzonSugerencias/pages/BuzonAgenteList';
import BuzonSugerenciasFormPage from '../modules/BuzonSugerencias/pages/BuzonSugerenciasFormPage';
import BuzonSugerenciaDetailPage from '../modules/BuzonSugerencias/pages/BuzonSugerenciaDetailPage';

// Nuevo Módulo DDD (Vertical Slices)
import GestionSistemasRouter from '../modules/GestionSistemas/router/GestionSistemasRouter';
import GestionComprasRouter from '../modules/GestionCompras/router/GestionComprasRouter';

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

                    {/* Sedes */}
                    <Route path="/sedes" element={
                        <PermissionProtectedRoute requiredPermissions={['sede.crear', 'sede.actualizar', 'sede.eliminar']}>
                            <SedesList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/sedes/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['sede.crear']}>
                            <SedesForm />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/sedes/editar/:id" element={
                        <PermissionProtectedRoute requiredPermissions={['sede.actualizar']}>
                            <SedesForm />
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
                    <Route path="/imagen-mensual" element={
                        <PermissionProtectedRoute requiredPermissions={['imagen_mensual.crud']}>
                            <ImagenMensualPage />
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
                        <PermissionProtectedRoute requiredPermissions={['mantenimiento.seleccion_coordinador', 'mantenimiento.listar_todos']}>
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

                    {/* Buzon Sugerencias */}
                    <Route path="/buzon" element={
                        <PermissionProtectedRoute requiredPermissions={['buzon.mias']}>
                            <BuzonSugerenciasList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/buzon/nuevo" element={
                        <PermissionProtectedRoute requiredPermissions={['buzon.mias']}>
                            <BuzonSugerenciasFormPage />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/buzon/agente" element={
                        <PermissionProtectedRoute requiredPermissions={['buzon.agente']}>
                            <BuzonAgenteList />
                        </PermissionProtectedRoute>
                    } />
                    <Route path="/buzon/:codigo" element={
                        <PermissionProtectedRoute requiredPermissions={['buzon.mias', 'buzon.agente']}>
                            <BuzonSugerenciaDetailPage />
                        </PermissionProtectedRoute>
                    } />

                    {/* Gestión de Sistemas (Nuevo Módulo Vertical Slices) */}
                    <Route path="/gestion-sistemas/*" element={<GestionSistemasRouter />} />
                    <Route path="/gestion-compras/*" element={<GestionComprasRouter />} />

                    {/* Rutas de Estado y Error */}
                    <Route path="/mantenimiento" element={<Error500 />} />
                    <Route path="/403" element={<Error403 />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />

                    {/* Capturar rutas no encontradas DENTRO del layout (para autenticados) */}
                    <Route path="*" element={<Error404 />} />
                </Route>

                {/* Redirecciones y catch-all fuera del layout */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
