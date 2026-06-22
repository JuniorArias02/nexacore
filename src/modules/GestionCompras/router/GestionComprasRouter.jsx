import { Routes, Route } from 'react-router-dom';
import PermissionProtectedRoute from '../../../components/common/PermissionProtectedRoute';

import CpDependenciaList from '../Dependencia/pages/CpDependenciaList';
import CpDependenciaFormPage from '../Dependencia/pages/CpDependenciaFormPage';

import CpCentroCostoList from '../CentroCosto/pages/CpCentroCostoList';
import CpCentroCostoFormPage from '../CentroCosto/pages/CpCentroCostoFormPage';

import CpProductoList from '../Producto/pages/CpProductoList';
import CpProductoFormPage from '../Producto/pages/CpProductoFormPage';

import CpProductoServicioList from '../ProductoServicio/pages/CpProductoServicioList';
import CpProductoServicioFormPage from '../ProductoServicio/pages/CpProductoServicioFormPage';

import CpTipoSolicitudList from '../TipoSolicitud/pages/CpTipoSolicitudList';
import CpTipoSolicitudFormPage from '../TipoSolicitud/pages/CpTipoSolicitudFormPage';

import CpPedidoCreatePage from '../Pedidos/pages/CpPedidoCreatePage';
import CpPedidoEditPage from '../Pedidos/pages/CpPedidoEditPage';
import CpPedidoList from '../Pedidos/pages/CpPedidoList';
import CpPedidoDetail from '../Pedidos/pages/CpPedidoDetail';
import InformeConsolidadoPage from '../Pedidos/pages/InformeConsolidadoPage';
import CpPedidoEstadisticasPage from '../Pedidos/pages/CpPedidoEstadisticasPage';

import EntregaActivosFijosList from '../EntregaActivosFijos/pages/EntregaActivosFijosList';
import EntregaActivosFijosForm from '../EntregaActivosFijos/pages/EntregaActivosFijosForm';
import EntregaActivosFijosHistory from '../EntregaActivosFijos/pages/EntregaActivosFijosHistory';

const GestionComprasRouter = () => {
    return (
        <Routes>
            {/* CP Dependencias */}
            <Route path="cp-dependencias" element={
                <PermissionProtectedRoute requiredPermissions={['cp_dependencia.crear', 'cp_dependencia.actualizar', 'cp_dependencia.eliminar']}>
                    <CpDependenciaList />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-dependencias/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['cp_dependencia.crear']}>
                    <CpDependenciaFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-dependencias/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_dependencia.actualizar']}>
                    <CpDependenciaFormPage />
                </PermissionProtectedRoute>
            } />

            {/* CP Centro Costos */}
            <Route path="cp-centro-costos" element={
                <PermissionProtectedRoute requiredPermissions={['cp_centro_costo.crear', 'cp_centro_costo.actualizar', 'cp_centro_costo.eliminar']}>
                    <CpCentroCostoList />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-centro-costos/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['cp_centro_costo.crear']}>
                    <CpCentroCostoFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-centro-costos/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_centro_costo.actualizar']}>
                    <CpCentroCostoFormPage />
                </PermissionProtectedRoute>
            } />

            {/* CP Productos */}
            <Route path="cp-productos" element={
                <PermissionProtectedRoute requiredPermissions={['cp_producto.crear', 'cp_producto.actualizar', 'cp_producto.eliminar']}>
                    <CpProductoList />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-productos/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['cp_producto.crear']}>
                    <CpProductoFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-productos/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_producto.actualizar']}>
                    <CpProductoFormPage />
                </PermissionProtectedRoute>
            } />

            {/* CP Productos Servicios */}
            <Route path="cp-productos-servicios" element={
                <PermissionProtectedRoute requiredPermissions={['cp_producto_servicio.crear', 'cp_producto_servicio.actualizar', 'cp_producto_servicio.eliminar']}>
                    <CpProductoServicioList />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-productos-servicios/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['cp_producto_servicio.crear']}>
                    <CpProductoServicioFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-productos-servicios/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_producto_servicio.actualizar']}>
                    <CpProductoServicioFormPage />
                </PermissionProtectedRoute>
            } />

            {/* CP Tipos Solicitud */}
            <Route path="cp-tipos-solicitud" element={
                <PermissionProtectedRoute requiredPermissions={['cp_tipo_solicitud.crear', 'cp_tipo_solicitud.actualizar', 'cp_tipo_solicitud.eliminar']}>
                    <CpTipoSolicitudList />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-tipos-solicitud/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['cp_tipo_solicitud.crear']}>
                    <CpTipoSolicitudFormPage />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-tipos-solicitud/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_tipo_solicitud.actualizar']}>
                    <CpTipoSolicitudFormPage />
                </PermissionProtectedRoute>
            } />

            {/* Pedidos de Compra */}
            <Route path="cp-pedidos" element={
                <PermissionProtectedRoute requiredPermissions={['cp_pedido.listar', 'cp_pedido.listar.compras', 'cp_pedido.listar.responsable', 'cp_pedido.crear']}>
                    <CpPedidoList />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-pedidos/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['cp_pedido.crear']}>
                    <CpPedidoCreatePage />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-pedidos/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_pedido.listar', 'cp_pedido.crear']}>
                    <CpPedidoDetail />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-pedidos/:id/editar" element={
                <PermissionProtectedRoute requiredPermissions={['cp_pedido.crear']}>
                    <CpPedidoEditPage />
                </PermissionProtectedRoute>
            } />
            <Route path="informe-consolidado-pedidos" element={
                <PermissionProtectedRoute requiredPermissions={['cp_pedido.consolidado']}>
                    <InformeConsolidadoPage />
                </PermissionProtectedRoute>
            } />
            <Route path="cp-pedidos/:id/estadisticas" element={
                <PermissionProtectedRoute requiredPermissions={['cp_pedido.listar', 'cp_pedido.listar.compras', 'cp_pedido.listar.responsable']}>
                    <CpPedidoEstadisticasPage />
                </PermissionProtectedRoute>
            } />

            {/* Entrega de Activos Fijos */}
            <Route path="entrega-activos-fijos" element={
                <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.crear', 'cp_entrega_activos_fijos.actualizar', 'cp_entrega_activos_fijos.eliminar']}>
                    <EntregaActivosFijosList />
                </PermissionProtectedRoute>
            } />
            <Route path="entrega-activos-fijos/nuevo" element={
                <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.crear']}>
                    <EntregaActivosFijosForm />
                </PermissionProtectedRoute>
            } />
            <Route path="entrega-activos-fijos/editar/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.actualizar']}>
                    <EntregaActivosFijosForm />
                </PermissionProtectedRoute>
            } />
            <Route path="entrega-activos-fijos/actualizar-firma/:id" element={
                <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.actualizar']}>
                    <EntregaActivosFijosForm />
                </PermissionProtectedRoute>
            } />
            <Route path="entrega-activos-fijos/historial" element={
                <PermissionProtectedRoute requiredPermissions={['cp_entrega_activos_fijos.listar']}>
                    <EntregaActivosFijosHistory />
                </PermissionProtectedRoute>
            } />
        </Routes>
    );
};

export default GestionComprasRouter;
