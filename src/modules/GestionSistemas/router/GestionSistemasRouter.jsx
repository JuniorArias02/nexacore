import { Routes, Route } from 'react-router-dom';
import PermissionProtectedRoute from '../../../components/common/PermissionProtectedRoute';
import ActasEntregaListPage from '../ActasEntrega/pages/ActasEntregaListPage';
import ActasEntregaFormPage from '../ActasEntrega/pages/ActasEntregaFormPage';
import ActasEntregaDetallePage from '../ActasEntrega/pages/ActasEntregaDetallePage';

import ActasDevolucionListPage from '../ActasDevolucion/pages/ActasDevolucionListPage';
import ActasDevolucionFormPage from '../ActasDevolucion/pages/ActasDevolucionFormPage';
import ActasDevolucionDetallePage from '../ActasDevolucion/pages/ActasDevolucionDetallePage';

import PcEquiposList from '../EquiposComputo/pages/PcEquiposList';
import PcEquiposForm from '../EquiposComputo/pages/PcEquiposForm';
import HojaDeVidaEquipoPage from '../EquiposComputo/pages/HojaDeVidaEquipoPage';

import PcMantenimientoList from '../MantenimientoEquipos/pages/PcMantenimientoList';
import CrearNuevoManteminetoPc from '../MantenimientoEquipos/pages/CrearNuevoManteminetoPc';
import PcMantenimientoCronograma from '../MantenimientoEquipos/pages/PcMantenimientoCronograma';

const GestionSistemasRouter = () => {
    return (
        <Routes>
            {/* Actas de Entrega */}
            <Route path="actas-entrega" element={
                <PermissionProtectedRoute requiredPermissions={['pc_entrega.crear', 'pc_entrega.actualizar', 'pc_entrega.eliminar']}>
                    <ActasEntregaListPage />
                </PermissionProtectedRoute>
            } />
            <Route path="actas-entrega/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['pc_entrega.crear']}>
                    <ActasEntregaFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="actas-entrega/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['pc_entrega.actualizar']}>
                    <ActasEntregaFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="actas-entrega/detalles/:id" element={
                <PermissionProtectedRoute requiredPermissions={['pc_entrega.crear', 'pc_entrega.actualizar', 'pc_entrega.eliminar']}>
                    <ActasEntregaDetallePage />
                </PermissionProtectedRoute>
            } />
            
            {/* Actas de Devolución */}
            <Route path="actas-devolucion" element={
                <PermissionProtectedRoute requiredPermissions={['pc_devuelto.crear', 'pc_devuelto.actualizar', 'pc_devuelto.eliminar']}>
                    <ActasDevolucionListPage />
                </PermissionProtectedRoute>
            } />
            <Route path="actas-devolucion/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['pc_devuelto.crear']}>
                    <ActasDevolucionFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="actas-devolucion/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['pc_devuelto.actualizar']}>
                    <ActasDevolucionFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="actas-devolucion/detalles/:id" element={
                <PermissionProtectedRoute requiredPermissions={['pc_devuelto.crear', 'pc_devuelto.actualizar', 'pc_devuelto.eliminar']}>
                    <ActasDevolucionDetallePage />
                </PermissionProtectedRoute>
            } />
            {/* Equipos de Cómputo */}
            <Route path="pc-equipos" element={
                <PermissionProtectedRoute requiredPermissions={['pc_equipo.crear', 'pc_equipo.actualizar', 'pc_equipo.eliminar']}>
                    <PcEquiposList />
                </PermissionProtectedRoute>
            } />
            <Route path="pc-equipos/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['pc_equipo.crear']}>
                    <PcEquiposForm />
                </PermissionProtectedRoute>
            } />
            <Route path="pc-equipos/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['pc_equipo.actualizar']}>
                    <PcEquiposForm />
                </PermissionProtectedRoute>
            } />
            <Route path="pc-equipos/hoja-de-vida/:id" element={
                <PermissionProtectedRoute requiredPermissions={['pc_equipo.crear', 'pc_equipo.actualizar']}>
                    <HojaDeVidaEquipoPage />
                </PermissionProtectedRoute>
            } />
            
            {/* Mantenimiento de Equipos */}
            <Route path="pc-mantenimientos/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['pc_mantenimiento.crear']}>
                    <CrearNuevoManteminetoPc />
                </PermissionProtectedRoute>
            } />
            <Route path="pc-mantenimientos" element={
                <PermissionProtectedRoute requiredPermissions={['pc_mantenimiento.listar', 'pc_mantenimiento.crear', 'pc_mantenimiento.actualizar', 'pc_mantenimiento.eliminar']}>
                    <PcMantenimientoList />
                </PermissionProtectedRoute>
            } />
            <Route path="pc-mantenimientos/cronograma" element={
                <PermissionProtectedRoute requiredPermissions={['pc_mantenimiento.listar']}>
                    <PcMantenimientoCronograma />
                </PermissionProtectedRoute>
            } />
        </Routes>
    );
};

export default GestionSistemasRouter;
