# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias del sistema
RUN apk add --no-cache openssl

# Instalar dependencias (incluyendo devDependencies para desarrollo)
RUN npm ci

# ============================================
# Stage 2: Development
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

RUN apk add --no-cache openssl

# Copiar dependencias desde la etapa anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto del backend
EXPOSE 3000

# Comando para desarrollo con hot reload
CMD ["npm", "run", "dev"]

# ============================================
# Stage 3: Builder (para producción)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npx prisma generate
RUN npm run build

# ============================================
# Stage 4: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar archivos compilados
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Usuario no root para seguridad
USER node

# Comando de producción
CMD ["npm", "start"]
