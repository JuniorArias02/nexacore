import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../modules/auth/pages/LoginPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import InventoryFormPage from '../modules/inventario/pages/InventoryFormPage';
import InventoryListPage from '../modules/inventario/pages/InventoryListPage';
import DependenciaSedeList from '../modules/dependenciaSede/pages/DependenciaSedeList';
import DependenciaSedeFormPage from '../modules/dependenciaSede/pages/DependenciaSedeFormPage';
import CpDependenciaList from '../modules/cpDependencia/pages/CpDependenciaList';
import CpDependenciaFormPage from '../modules/cpDependencia/pages/CpDependenciaFormPage';
import CpCentroCostoList from '../modules/cpCentroCosto/pages/CpCentroCostoList';
import CpCentroCostoFormPage from '../modules/cpCentroCosto/pages/CpCentroCostoFormPage';
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
                    <Route path="/inventario/nuevo" element={<InventoryFormPage />} />
                    <Route path="/inventario/editar/:id" element={<InventoryFormPage />} />

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
                </Route>

                {/* Redirecciones por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
