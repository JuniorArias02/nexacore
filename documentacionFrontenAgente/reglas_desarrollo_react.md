# Reglas de Desarrollo y Buenas Prácticas (React)

Este documento complementa la guía de arquitectura y establece las reglas de codificación, manejo de estado y comunicación con el backend para el frontend de NexaCore.

## 1. Peticiones a la API y Servicios
- **Capa de Red Centralizada:** Todas las peticiones HTTP deben realizarse utilizando la instancia global de Axios (`src/services/api.js`), la cual ya maneja la inyección del token y la interceptación de errores 401.
- **Servicios por Módulo:** Nunca se debe llamar a Axios directamente desde un componente. Las llamadas deben encapsularse en archivos de servicio dentro del módulo correspondiente (ej. `src/modules/Inventario/services/inventoryService.js`).
- **Retorno de Datos:** Los servicios deben desempaquetar la respuesta de la API (ej. devolver `response.data` o `response.data.objeto` según la convención del backend) para que los componentes reciban la data limpia.

## 2. Manejo de Estado (State Management)
- **Estado Local:** Utilizar `useState` para el manejo del estado de UI (modales, inputs) y `useEffect` (con precaución) para la carga inicial de datos del módulo.
- **Estado Global:** El proyecto utiliza **React Context API** (`AuthContext`) para datos globales como el usuario autenticado y sus permisos. No se deben usar librerías externas (Redux, Zustand) a menos que el estado global se vuelva inmanejable.
- **Prop Drilling:** Evitar pasar props más de 2 o 3 niveles hacia abajo. Si un dato es necesario en todo un sub-árbol profundo, considere crear un Contexto específico para ese módulo.

## 3. Manejo de Formularios
- Para formularios sencillos, se permite el uso de componentes controlados (`useState` enlazado a `value` y `onChange`).
- Para formularios complejos con múltiples validaciones, se deben manejar los errores para evitar envíos incompletos, utilizando preferiblemente custom hooks.

## 4. Alertas y Manejo de Errores
- **Retroalimentación Visual:** Es obligatorio el uso de **SweetAlert2** (`Swal`) para notificar al usuario sobre:
  - Creación, actualización o eliminación exitosa.
  - Confirmaciones de acciones destructivas (ej. "¿Estás seguro de eliminar este registro?").
  - Errores provenientes del servidor (validaciones o fallos 500).
- **Consistencia:** No utilizar los `alert()` nativos del navegador bajo ninguna circunstancia.

## 5. Autenticación y Permisos
- **Rutas Protegidas:** Todas las páginas privadas deben estar envueltas por el `<ProtectedRoute>` en el enrutador.
- **Validación Granular:** Utilizar el componente `<Can permission="nombre.permiso">` para ocultar o mostrar botones y secciones enteras dependiendo del rol del usuario. Evitar lógica manual de validación de roles en el JSX.
