# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias
RUN npm ci

# ============================================
# Stage 2: Development
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para desarrollo con hot reload
# --host 0.0.0.0 permite acceso desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================
# Stage 3: Builder (para producción)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# ============================================
# Stage 4: Production
# ============================================
FROM nginx:alpine AS production

# Copiar archivos estáticos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Nginx se ejecuta automáticamente
CMD ["nginx", "-g", "daemon off;"]
