# Guía de Arquitectura de Frontend (NexaCore)

Este documento establece las convenciones arquitectónicas y de desarrollo para el frontend de este proyecto (NexaCore).

## 🛠️ Stack Tecnológico
El ecosistema de herramientas utilizado se basa en tecnologías modernas para asegurar velocidad y rendimiento:
- **Gestor de paquetes:** `pnpm` (Rápido, estricto y eficiente en disco). Siempre utiliza `pnpm install` o `pnpm add`, nunca `npm` o `yarn`.
- **Librería UI:** `React` (con Vite).
- **Estilos:** `Tailwind CSS`. Todo el estilizado debe construirse utilizando clases utilitarias directamente en los componentes, adhiriéndose a las convenciones de diseño (Nexa Style).
- **Ruteo:** `react-router-dom` v6.

### Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | 19.x | Framework UI principal |
| **Vite** | 7.x | Bundler y servidor de desarrollo |
| **Tailwind CSS** | 4.x | Framework de estilos utilitarios |
| **React Router DOM** | 7.x | Enrutamiento SPA |
| **Axios** | 1.x | Cliente HTTP para llamadas a la API |
| **SweetAlert2** | 11.x | Diálogos de confirmación y alertas |
| **Heroicons** | 2.x | Librería de íconos SVG |
| **FullCalendar** | 6.x | Componente de calendario para la agenda |
| **react-easy-crop** | 5.x | Recorte de imágenes (perfiles) |
| **react-signature-canvas** | 1.x | Captura de firmas digitales |
| **pnpm** | (gestor) | Instalación y gestión de dependencias |
---

## 🏗️ Arquitectura: Vertical Slices (Feature-Sliced Design)

A medida que la aplicación escala, organizar los archivos por su "tipo" (todas las `pages/` juntas, todos los `hooks/` juntos) resulta inmanejable. En NexaCore, utilizamos una arquitectura modular orientada al Dominio o **Vertical Slices**.

### 1. Estructura de Directorios

Dentro de `src/modules/`, el código se agrupa por el **Dominio de Negocio** (ej. `GestionSistemas`, `RecursosHumanos`). Dentro de cada Dominio, se separan las **Funcionalidades** o **Submódulos** (ej. `ActasEntrega`, `EquiposComputo`).

**Ejemplo de la estructura ideal:**

```text
src/
 ┣ shared/                    <-- Lógica genérica y reutilizable
 ┃ ┣ components/              # Botones, Modales, Tablas Nexa genéricas
 ┃ ┣ hooks/                   # useAuth, useTheme
 ┃ ┗ services/                # Configuración global de Axios
 ┃
 ┗ modules/                   <-- Módulos de negocio (Vertical Slices)
   ┗ GestionSistemas/         # <- Dominio Principal
     ┣ router/
     ┃ ┗ GestionSistemasRouter.jsx  # Enrutador exclusivo del módulo
     ┃
     ┣ ActasEntrega/          # <- Submódulo (Slice)
     ┃ ┣ components/          # Componentes visuales únicos de actas
     ┃ ┣ hooks/               # useActasEntrega, useCrearActa
     ┃ ┣ services/            # Llamadas a la API específicas (/actas-entrega)
     ┃ ┗ pages/               # Vistas (ActasEntregaListPage, ActasEntregaFormPage)
     ┃
     ┗ EquiposComputo/        # <- Otro Submódulo
       ┣ components/
       ┣ hooks/
       ┣ services/
       ┗ pages/
```

### 2. Reglas de Implementación

- **Alta Cohesión:** Todo lo que pertenece exclusivamente a `ActasEntrega` debe vivir dentro de la carpeta `ActasEntrega/`. Un hook llamado `useActasEntrega` **NO** debe estar en `src/hooks/`, debe estar en `src/modules/GestionSistemas/ActasEntrega/hooks/`.
- **Evitar Nombres Redundantes:** Al estar dentro de la carpeta `ActasEntrega/components/`, un archivo puede llamarse simplemente `Formulario.jsx` en lugar de `ActasEntregaFormularioPrincipal.jsx`.
- **Aislamiento de Rutas:** Cada Dominio Principal debe tener su propio archivo de enrutamiento (ej. `GestionSistemasRouter.jsx`). Este archivo declara los componentes que envuelven su dominio y luego es inyectado de manera anidada en el `AppRouter.jsx` global usando el path base con `/*` (ej. `<Route path="/gestion-sistemas/*" element={<GestionSistemasRouter />} />`).

### 3. Tailwind y Diseño
Se debe respetar la guía de diseño (`design_guidelines.md`). Usa utilidades modernas de Tailwind, fomenta el diseño Glassmorphism, fondos degradados y sombras de colores. No uses CSS puro o archivos `.css` separados a menos que sea para configuraciones globales muy específicas (`index.css`).

### 4. Convenciones de Nomenclatura (Frontend)
De ahora en adelante, todo el código del **frontend** debe seguir las siguientes reglas estrictas para nombrar elementos:
- **Idioma:** Todos los nombres de carpetas, funciones, variables y métodos deben escribirse en **Español** (ej. `obtenerDatos`, `MantenimientoEquipos`).
- **Nombres de Carpetas (Módulos):** Las carpetas de Dominio Principal y Submódulos deben usar **PascalCase** (ej. `GestionSistemas`, `BuzonSugerencias`, `PerfilUsuario`).
- **camelCase:** Utilizar para funciones regulares, métodos, variables, props y Custom Hooks (ej. `useObtenerInventario`, `cargarUsuarios()`, `manejarClick()`, `datosFormulario`).
- **PascalCase:** Utilizar exclusivamente para Componentes de React y Archivos de Componentes (ej. `BotonSecundario.jsx`, `FormularioUsuario`, `TablaRegistros`).

### 5. Estilo de Comunicación del Agente (AI)
Al interactuar con el sistema o generar respuestas, el agente debe:
- **Ser Directo y Conciso:** Evitar textos genéricos, saludos extensos o explicaciones teóricas innecesarias.
- **Ir al Grano:** Responder directamente con el código o la acción requerida. El tiempo es valioso; no agregues relleno.
- **Enfoque Nexa:** Mantener un tono profesional, técnico y minimalista, acorde con la filosofía de diseño y arquitectura de NexaCore.
