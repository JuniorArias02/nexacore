# NexaCore Premium Design System (v2.0 - 2026)

Este sistema de diseño define la estética "Ultra-Premium" para el ecosistema NexaCore, enfocándose en la jerarquía visual, tipografía moderna y una experiencia de usuario fluida.

## 🎨 Principios de Diseño
- **Estética Vibrante**: Uso de gradientes profundos (`violet-indigo-blue`) y sombras pesadas (`shadow-2xl`).
- **Tipografía "High-End"**: Uso exclusivo de la fuente **Outfit** con tracking variado según el nivel.
- **Micro-interacciones**: Efectos de escala (`hover:scale-105`), animaciones de entrada (`animate-fade-in-up`) y pulses en indicadores de estado.

## 💎 Identidad Visual (Brand Colors)

### **Paleta Maestra (Seguridad & Core)**
- **Gradiente Principal**: `bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700`.
- **Accentos**: Indigo-600 para acciones principales, Slate-900 para textos base, Slate-400 para metadatos.

## 🏗️ Patrones de Componentes

### 1. Hero Header (Listas)
Todas las vistas de catálogo deben iniciar con una sección Hero expansiva:
```jsx
<div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl mb-10 group">
    <div className="relative z-10">
        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/20 mb-6 backdrop-blur-md">
            [CATEGORÍA]
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
            [Título del Módulo]
        </h1>
        <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
            [Descripción descriptiva...]
        </p>
    </div>
    {/* Icono Decorativo Flotante */}
    <Icon className="absolute right-12 bottom-0 h-64 w-64 text-white/5 -mb-20 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
</div>
```

### 2. Form Cards (Centradas)
Los formularios deben presentarse en contenedores centrados con cabeceras de icono:
- **Max-Width**: `max-w-4xl` para formularios estándar, `max-w-5xl` para usuarios/personal.
- **Header**: Div blanco con sombra, bordes redondeados `rounded-3xl`, icono en caja `bg-indigo-100`.
- **Inputs**: Background `bg-slate-50`, bordes `border-slate-100`, focus con ring `focus:ring-indigo-500/10`.

### 3. Tablas NEXA
- **Header**: Background `bg-slate-50/50`, texto `text-[10px]`, `font-black`, `tracking-[0.2em]`.
- **Rows**: Hover con `hover:bg-indigo-50/30`, transiciones suaves.
- **Badges**: Bordes redondeados `rounded-full`, colores pastel con texto fuerte y bordes sutiles.

## 🖋️ Tipografía & Estilo
- **Títulos de Formulario**: `text-3xl font-extrabold tracking-tight`.
- **Labels de Input**: `text-[10px] font-black uppercase tracking-[0.2em] text-slate-400`.
- **Botones**: `rounded-2xl`, `font-black`, `tracking-widest`, sombras de color (`shadow-indigo-200`).
