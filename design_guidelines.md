# NexaCore Design System (2026 Edition)

Use this guide for all future UI implementation to ensure consistency with the new "Ecosistema NEXA" aesthetic.

## Core Philosophy
- **Modern & Vibrant**: Use gradients and "glassmorphism" to create depth.
- **Friendly & Human**: Applications should greet the user (e.g., "Buenos días, Junior").
- **Clean & Spacious**: Increase padding (`p-6`, `p-8`), use rounded corners (`rounded-2xl`, `rounded-3xl`), and light backgrounds (`bg-gray-50/50`).

## Color Palettes (Role-Based)

### **Sistemas (Tech)**
- **Primary**: Blue (`text-blue-600`, `bg-blue-500`) & Cyan (`text-cyan-600`).
- **Gradient**: `from-blue-600 to-cyan-500`.
- **Vibe**: Clean, technical, precise.

### **Compras (Business)**
- **Primary**: Orange (`text-orange-600`) & Indigo (`text-indigo-600`).
- **Secondary**: Teal (for products), Purple (for providers).
- **Vibe**: Energetic, distinct, transactional.

### **Admin (Executive)**
- **Primary**: Purple (`text-purple-600`) & Pink (`text-pink-500`).
- **Gradient**: `from-indigo-600 via-purple-600 to-pink-500`.
- **Vibe**: Premium, authoritative, global.

## Component Patterns

### 1. Page Layout (Hero Section)
Every major module page should start with a Hero section:
```jsx
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r [ROLE_GRADIENT] p-8 md:p-12 text-white shadow-2xl">
    <div className="relative z-10">
        <span className="badge-glass">MODULE NAME</span>
        <h1 className="text-4xl font-extrabold">{Greeting}, {User Name}</h1>
        <p className="text-white/90">Description...</p>
    </div>
    {/* Decorative Blobs */}
    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
</div>
```

### 2. Action Cards (Navigation/Stats)
Use for dashboard items or main menu entries.
```jsx
<Link className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
    {/* Hover Hover Blob */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-[COLOR]-50 group-hover:bg-[COLOR]-100 transition-colors"></div>
    
    <div className="relative z-10">
        <div className="icon-container bg-[COLOR]-50 text-[COLOR]-600 group-hover:bg-[COLOR]-600 group-hover:text-white">
            <Icon />
        </div>
        <h3 className="font-bold text-gray-900">Title</h3>
        <p className="text-gray-500">Description</p>
    </div>
</Link>
```

### 3. Stat Cards (Data Display)
Simple, clean cards for numbers.
```jsx
<div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-[COLOR]-500">
    <h3>Title</h3>
    <p className="text-3xl font-bold">{value}</p>
</div>
```

## Typography
- **Headings**: `font-extrabold`, `tracking-tight`, `text-gray-900`.
- **Body**: `text-gray-600` or `text-gray-500` for secondary text.
