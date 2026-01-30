# 🎨 Guía de Tema Tailwind CSS - SupraSense

Esta guía documenta el sistema de diseño personalizado basado en el prototipo del Sistema de Gestión de Órdenes de Trabajo.

## 📋 Tabla de Contenidos
- [Paleta de Colores](#paleta-de-colores)
- [Tipografía](#tipografía)
- [Componentes](#componentes)
- [Espaciado y Sombras](#espaciado-y-sombras)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎨 Paleta de Colores

### Colores Principales (Primary)
Basados en el esquema violeta/índigo del prototipo:

```css
primary-50   #f0f4ff  /* Muy claro - fondos sutiles */
primary-100  #e0e9ff  /* Claro - hover states */
primary-200  #c7d7fe  /* Claro medio */
primary-300  #a5bbfc  /* Medio claro */
primary-400  #8196f8  /* Medio */
primary-500  #6366f1  /* Principal - botones, enlaces */
primary-600  #4f46e5  /* Oscuro - hover de botones */
primary-700  #4338ca  /* Más oscuro */
primary-800  #3730a3  /* Muy oscuro */
primary-900  #312e81  /* Casi negro */
```

**Uso en Tailwind:**
```jsx
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Botón Principal
</button>
```

---

### Colores de Estado (Status)
Basados en los badges del prototipo:

| Estado | Color | Hex | Uso |
|--------|-------|-----|-----|
| **Disponible** | `status-available` | `#10b981` | Personal disponible |
| **En Servicio** | `status-inService` | `#3b82f6` | Personal en servicio |
| **Licencia** | `status-onLeave` | `#f59e0b` | Personal con licencia |
| **Inactivo** | `status-inactive` | `#6b7280` | Personal inactivo |

**Uso en Tailwind:**
```jsx
<span className="badge badge-available">Disponible</span>
<span className="badge badge-in-service">En servicio</span>
<span className="badge badge-on-leave">Licencia</span>
```

---

### Colores de Superficie (Surface)
Para fondos y contenedores:

```css
surface          #ffffff  /* Fondo principal (blanco) */
surface-secondary #f9fafb  /* Fondo secundario (gris muy claro) */
surface-tertiary  #f3f4f6  /* Fondo terciario (gris claro) */
```

**Uso:**
```jsx
<div className="bg-surface">Contenido principal</div>
<div className="bg-surface-secondary">Sidebar o header</div>
```

---

### Colores de Texto (Text)
```css
text-primary   #111827  /* Texto principal (casi negro) */
text-secondary #6b7280  /* Texto secundario (gris medio) */
text-tertiary  #9ca3af  /* Texto terciario (gris claro) */
```

**Uso:**
```jsx
<h1 className="text-text-primary">Título Principal</h1>
<p className="text-text-secondary">Descripción secundaria</p>
```

---

### Colores de Borde (Border)
```css
border-light   #e5e7eb  /* Bordes sutiles */
border         #d1d5db  /* Bordes normales */
border-dark    #9ca3af  /* Bordes destacados */
```

---

## ✍️ Tipografía

### Fuentes
- **Sans (cuerpo):** Inter - Moderna, legible, profesional
- **Display (títulos):** Outfit - Elegante, impactante

```jsx
<h1 className="font-display">Título con Outfit</h1>
<p className="font-sans">Texto con Inter</p>
```

### Tamaños de Fuente
```jsx
text-xs    /* 0.75rem - 12px */
text-sm    /* 0.875rem - 14px */
text-base  /* 1rem - 16px */
text-lg    /* 1.125rem - 18px */
text-xl    /* 1.25rem - 20px */
text-2xl   /* 1.5rem - 24px */
text-3xl   /* 1.875rem - 30px */
text-4xl   /* 2.25rem - 36px */
```

---

## 🧩 Componentes

### 1. Botones

#### Botón Principal
```jsx
<button className="btn btn-primary">
  Guardar
</button>
```

#### Botón Secundario
```jsx
<button className="btn btn-secondary">
  Cancelar
</button>
```

#### Botón Ghost (transparente)
```jsx
<button className="btn btn-ghost">
  Más opciones
</button>
```

---

### 2. Cards (Tarjetas)

#### Card Básica
```jsx
<div className="card p-6">
  <h3 className="text-xl font-semibold mb-2">Título</h3>
  <p className="text-text-secondary">Contenido de la tarjeta</p>
</div>
```

#### Card con Hover
```jsx
<div className="card card-hover p-6 cursor-pointer">
  <h3>Tarjeta interactiva</h3>
</div>
```

---

### 3. Badges (Insignias de Estado)

```jsx
{/* Disponible */}
<span className="badge badge-available">
  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
  Disponible
</span>

{/* En Servicio */}
<span className="badge badge-in-service">
  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
  En servicio
</span>

{/* Licencia */}
<span className="badge badge-on-leave">
  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
  Licencia
</span>
```

---

### 4. Inputs (Campos de Entrada)

```jsx
<input 
  type="text" 
  className="input" 
  placeholder="Buscar por nombre o especialidad..."
/>

<select className="input">
  <option>Todos</option>
  <option>Disponible</option>
  <option>En servicio</option>
</select>
```

---

### 5. Tablas

```jsx
<table className="table">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Área</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Juan Pérez</td>
      <td>Logística</td>
      <td>
        <span className="badge badge-available">Disponible</span>
      </td>
      <td>
        <button className="btn btn-ghost btn-sm">Ver</button>
      </td>
    </tr>
  </tbody>
</table>
```

---

### 6. Sidebar (Barra Lateral)

```jsx
<aside className="sidebar">
  <div className="p-4">
    <h2 className="text-xl font-bold">SupraSense</h2>
  </div>
  
  <nav className="flex-1">
    <a href="#" className="sidebar-item active">
      <Icon />
      <span>Inicio</span>
    </a>
    <a href="#" className="sidebar-item">
      <Icon />
      <span>Órdenes de Trabajo</span>
    </a>
  </nav>
</aside>
```

---

## 📐 Espaciado y Sombras

### Espaciado Personalizado
```jsx
p-18   /* 4.5rem - 72px */
p-88   /* 22rem - 352px */
p-128  /* 32rem - 512px */
```

### Sombras
```jsx
shadow-card   /* Sombra sutil para cards */
shadow-hover  /* Sombra al hacer hover */
shadow-sm     /* Sombra pequeña */
shadow-md     /* Sombra media */
shadow-lg     /* Sombra grande */
shadow-xl     /* Sombra extra grande */
```

---

## 🎬 Animaciones

### Animaciones Disponibles
```jsx
animate-fade-in   /* Aparición gradual */
animate-slide-in  /* Deslizamiento desde arriba */
animate-scale-in  /* Escalado desde el centro */
```

**Ejemplo:**
```jsx
<div className="animate-fade-in">
  Contenido que aparece gradualmente
</div>
```

---

## 📝 Ejemplos de Uso Completos

### Ejemplo 1: Card de Personal
```jsx
<div className="card card-hover p-6">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-text-primary">Juan Pérez</h3>
      <p className="text-sm text-text-secondary">Logística</p>
    </div>
    <span className="badge badge-available">Disponible</span>
  </div>
  
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-text-secondary">Turno:</span>
      <span className="text-text-primary font-medium">Mañana</span>
    </div>
    <div className="flex justify-between">
      <span className="text-text-secondary">OT Activas:</span>
      <span className="text-text-primary font-medium">2</span>
    </div>
  </div>
  
  <div className="mt-4 flex gap-2">
    <button className="btn btn-primary flex-1">Ver Detalles</button>
    <button className="btn btn-secondary">Contactar</button>
  </div>
</div>
```

### Ejemplo 2: Barra de Búsqueda con Filtros
```jsx
<div className="card p-4">
  <div className="flex gap-4">
    <input 
      type="text" 
      className="input flex-1" 
      placeholder="Buscar por nombre o especialidad..."
    />
    
    <select className="input w-48">
      <option>Todos los estados</option>
      <option>Disponible</option>
      <option>En servicio</option>
      <option>Licencia</option>
    </select>
    
    <button className="btn btn-primary">
      Buscar
    </button>
  </div>
</div>
```

### Ejemplo 3: Layout Principal
```jsx
<div className="flex h-screen">
  {/* Sidebar */}
  <aside className="sidebar">
    <div className="p-4 border-b border-border-light">
      <h1 className="text-xl font-bold">SupraSense</h1>
    </div>
    <nav className="flex-1 p-2">
      <a href="#" className="sidebar-item active">Inicio</a>
      <a href="#" className="sidebar-item">Personal</a>
      <a href="#" className="sidebar-item">Órdenes</a>
    </nav>
  </aside>
  
  {/* Main Content */}
  <main className="flex-1 overflow-auto bg-surface-secondary">
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Personal</h1>
      {/* Contenido */}
    </div>
  </main>
</div>
```

---

## 🚀 Consejos de Uso

1. **Consistencia:** Usa siempre las clases predefinidas en lugar de crear estilos inline
2. **Responsive:** Utiliza los prefijos de Tailwind (`sm:`, `md:`, `lg:`, `xl:`) para diseño responsive
3. **Accesibilidad:** Incluye siempre `focus:` states en elementos interactivos
4. **Performance:** Usa `hover:` y `transition-` para animaciones suaves

---

## 📚 Recursos Adicionales

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Paleta de Colores Interactiva](https://tailwindcss.com/docs/customizing-colors)
- [Guía de Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

**Última actualización:** 2026-01-29
**Versión:** 1.0.0
