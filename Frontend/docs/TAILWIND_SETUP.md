# ⚙️ Configuración de Tailwind CSS - SupraSense

## 📦 Instalación Completada

La configuración de Tailwind CSS ha sido completada exitosamente. Este documento describe todos los archivos creados y cómo utilizarlos.

---

## 📁 Archivos Creados

### 1. **tailwind.config.js**
Archivo de configuración principal de Tailwind CSS con tema personalizado.

**Características:**
- ✅ Paleta de colores basada en el prototipo
- ✅ Colores de estado (Disponible, En servicio, Licencia, Inactivo)
- ✅ Tipografía personalizada (Inter, Outfit)
- ✅ Espaciado y sombras personalizadas
- ✅ Animaciones predefinidas

### 2. **postcss.config.js**
Configuración de PostCSS para procesar Tailwind CSS.

### 3. **src/index.css**
Estilos globales con directivas de Tailwind y componentes personalizados.

**Incluye:**
- Directivas `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- Importación de fuentes Google (Inter, Outfit)
- Componentes reutilizables (botones, cards, badges, inputs, tablas)
- Estilos base personalizados

### 4. **src/components/ThemeDemo.tsx**
Componente de demostración que muestra todos los estilos y componentes disponibles.

### 5. **THEME_GUIDE.md**
Documentación completa del tema con ejemplos de uso.

### 6. **.vscode/settings.json**
Configuración de VSCode para suprimir warnings de Tailwind.

---

## 🚀 Cómo Usar

### 1. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El servidor compilará automáticamente los estilos de Tailwind CSS.

### 2. Ver la Demostración

Abre tu navegador en `http://localhost:5173` (o el puerto que te indique Vite).

Verás la página de demostración con:
- Paleta de colores
- Botones
- Badges de estado
- Cards de personal
- Tablas
- Formularios

### 3. Usar en tus Componentes

#### Ejemplo: Botón Principal
```tsx
<button className="btn btn-primary">
  Guardar
</button>
```

#### Ejemplo: Card de Personal
```tsx
<div className="card card-hover p-6">
  <h3 className="text-lg font-semibold">Juan Pérez</h3>
  <span className="badge badge-available">Disponible</span>
</div>
```

#### Ejemplo: Input
```tsx
<input 
  type="text" 
  className="input" 
  placeholder="Buscar..."
/>
```

---

## 🎨 Paleta de Colores Principales

### Colores Primary (Violeta/Índigo)
```
primary-500  #6366f1  (Principal)
primary-600  #4f46e5  (Hover)
primary-700  #4338ca  (Active)
```

### Colores de Estado
```
status-available   #10b981  (Verde - Disponible)
status-inService   #3b82f6  (Azul - En servicio)
status-onLeave     #f59e0b  (Amarillo - Licencia)
status-inactive    #6b7280  (Gris - Inactivo)
```

---

## 📚 Documentación

Para ver la documentación completa del tema, consulta:
- **[THEME_GUIDE.md](./THEME_GUIDE.md)** - Guía completa con todos los componentes y ejemplos

---

## 🔧 Personalización

### Modificar Colores

Edita `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#TU_COLOR_AQUI',
        // ...
      }
    }
  }
}
```

### Agregar Nuevos Componentes

Edita `src/index.css` en la sección `@layer components`:

```css
@layer components {
  .mi-componente {
    @apply bg-primary-500 text-white p-4 rounded-lg;
  }
}
```

---

## 🐛 Solución de Problemas

### Los estilos no se aplican

1. Verifica que el servidor de desarrollo esté corriendo
2. Asegúrate de que `src/index.css` esté importado en `main.tsx`
3. Limpia la caché de Vite: `npm run dev -- --force`

### Warnings en VSCode

Los warnings de "Unknown at rule @tailwind" son normales. Se han configurado en `.vscode/settings.json` para ser ignorados.

### Autocompletado no funciona

Instala la extensión oficial de Tailwind CSS para VSCode:
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)

---

## 📦 Dependencias Instaladas

```json
{
  "tailwindcss": "^3.x.x",
  "postcss": "^8.x.x",
  "autoprefixer": "^10.x.x"
}
```

---

## 🎯 Próximos Pasos

1. **Explorar la demostración** - Abre el navegador y revisa todos los componentes
2. **Leer la guía del tema** - Consulta `THEME_GUIDE.md` para ejemplos detallados
3. **Crear tus componentes** - Usa las clases predefinidas para construir tu interfaz
4. **Personalizar el tema** - Ajusta colores y estilos según tus necesidades

---

## 📞 Recursos Adicionales

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Guía de Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Customización del Tema](https://tailwindcss.com/docs/theme)

---

**¡Configuración completada exitosamente! 🎉**

Fecha: 2026-01-29
Versión: 1.0.0
