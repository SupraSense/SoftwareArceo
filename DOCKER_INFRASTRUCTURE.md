# 🐳 Infraestructura Docker - SoftwareArceo

## 📋 Resumen Ejecutivo

Este documento describe la arquitectura de contenedores para **SoftwareArceo**, una plataforma fullstack TypeScript desarrollada para **SupraSense**. La infraestructura está diseñada para permitir que cualquier desarrollador levante el entorno completo con un solo comando.

### Stack Tecnológico
- **Frontend**: React + Tailwind CSS (Vite)
- **Backend**: Node.js + Express (Arquitectura en capas)
- **Base de Datos**: PostgreSQL 16
- **Autenticación**: Keycloak 24+

### Arquitectura de Contenedores

```
┌─────────────────────────────────────────────────────────────┐
│                    suprasense-network                        │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  PostgreSQL  │───▶│   Keycloak   │───▶│   Backend    │  │
│  │   :5432      │    │    :8080     │    │    :3000     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                        │          │
│         │                                        │          │
│         │                  ┌──────────────┐      │          │
│         └─────────────────▶│   Frontend   │◀─────┘          │
│                            │    :5173     │                 │
│                            └──────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Orden de Encendido
1. **PostgreSQL** (Base de datos) - Primero
2. **Keycloak** (Autenticación) - Espera a PostgreSQL
3. **Backend** (API) - Espera a PostgreSQL y Keycloak
4. **Frontend** (UI) - Último en iniciar

### Características Principales
✅ **Multi-stage builds** para optimización de imágenes  
✅ **Health checks** para garantizar disponibilidad  
✅ **Volúmenes persistentes** para datos críticos  
✅ **Red interna aislada** para seguridad  
✅ **Variables de entorno** para configuración flexible  
✅ **Hot reload** en desarrollo (Frontend y Backend)

---

## 🐋 Dockerfiles

### 1. Dockerfile - Backend

**Ubicación**: `Backend/Dockerfile`

```dockerfile
# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para desarrollo)
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
RUN npm run build

# ============================================
# Stage 4: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

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
```

---

### 2. Dockerfile - Frontend

**Ubicación**: `Frontend/Dockerfile`

```dockerfile
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
```

---

## 🎼 Docker Compose

**Ubicación**: `docker-compose.yml` (raíz del proyecto)

```yaml
version: '3.9'

# ============================================
# NETWORKS
# ============================================
networks:
  suprasense-network:
    driver: bridge
    name: suprasense-network

# ============================================
# VOLUMES
# ============================================
volumes:
  postgres_data:
    name: suprasense_postgres_data
  keycloak_data:
    name: suprasense_keycloak_data

# ============================================
# SERVICES
# ============================================
services:
  # ------------------------------------------
  # PostgreSQL Database
  # ------------------------------------------
  postgres:
    image: postgres:16-alpine
    container_name: suprasense-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - suprasense-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # ------------------------------------------
  # Keycloak Authentication Server
  # ------------------------------------------
  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    container_name: suprasense-keycloak
    restart: unless-stopped
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/${KEYCLOAK_DB}
      KC_DB_USERNAME: ${POSTGRES_USER}
      KC_DB_PASSWORD: ${POSTGRES_PASSWORD}
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN_USER}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_HOSTNAME_STRICT: false
      KC_HTTP_ENABLED: true
      KC_HEALTH_ENABLED: true
    ports:
      - "${KEYCLOAK_PORT:-8080}:8080"
    volumes:
      - keycloak_data:/opt/keycloak/data
    networks:
      - suprasense-network
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "exec 3<>/dev/tcp/127.0.0.1/8080;echo -e 'GET /health/ready HTTP/1.1\r\nhost: http://localhost\r\nConnection: close\r\n\r\n' >&3;if [ $? -eq 0 ]; then echo 'Healthcheck Successful';exit 0;else echo 'Healthcheck Failed';exit 1;fi;"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  # ------------------------------------------
  # Backend API (Node.js + Express)
  # ------------------------------------------
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
      target: development
    container_name: suprasense-backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      KEYCLOAK_URL: http://keycloak:8080
      KEYCLOAK_REALM: ${KEYCLOAK_REALM}
      KEYCLOAK_CLIENT_ID: ${KEYCLOAK_CLIENT_ID}
      KEYCLOAK_CLIENT_SECRET: ${KEYCLOAK_CLIENT_SECRET}
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    volumes:
      # Hot reload: montar código fuente
      - ./Backend:/app
      - /app/node_modules
    networks:
      - suprasense-network
    depends_on:
      postgres:
        condition: service_healthy
      keycloak:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ------------------------------------------
  # Frontend (React + Vite)
  # ------------------------------------------
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
      target: development
    container_name: suprasense-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:${BACKEND_PORT:-3000}
      VITE_KEYCLOAK_URL: http://localhost:${KEYCLOAK_PORT:-8080}
      VITE_KEYCLOAK_REALM: ${KEYCLOAK_REALM}
      VITE_KEYCLOAK_CLIENT_ID: ${KEYCLOAK_CLIENT_ID}
    ports:
      - "${FRONTEND_PORT:-5173}:5173"
    volumes:
      # Hot reload: montar código fuente
      - ./Frontend:/app
      - /app/node_modules
    networks:
      - suprasense-network
    depends_on:
      - backend
    stdin_open: true
    tty: true
```

---

## 🔐 Archivo de Variables de Entorno

**Ubicación**: `.env.example` (raíz del proyecto)

```env
# ============================================
# PostgreSQL Configuration
# ============================================
POSTGRES_DB=suprasense_db
POSTGRES_USER=suprasense_admin
POSTGRES_PASSWORD=SuperSecurePassword123!
POSTGRES_PORT=5432

# ============================================
# Keycloak Configuration
# ============================================
KEYCLOAK_DB=keycloak_db
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=AdminPassword123!
KEYCLOAK_PORT=8080
KEYCLOAK_REALM=suprasense
KEYCLOAK_CLIENT_ID=suprasense-app
KEYCLOAK_CLIENT_SECRET=your-client-secret-here

# ============================================
# Backend Configuration
# ============================================
BACKEND_PORT=3000
NODE_ENV=development

# ============================================
# Frontend Configuration
# ============================================
FRONTEND_PORT=5173
```

---

## 🚀 Comandos de Uso

### Configuración Inicial

```bash
# 1. Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env

# 2. Editar el archivo .env con tus credenciales
# (Usa tu editor favorito: nano, vim, code, etc.)
code .env
```

### Levantar el Entorno Completo

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# O en modo detached (segundo plano)
docker-compose up -d --build
```

### Comandos de Gestión

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f keycloak

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ CUIDADO: Borra datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir un servicio específico
docker-compose up -d --build backend

# Ver estado de los servicios
docker-compose ps

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U suprasense_admin -d suprasense_db
```

### Comandos de Desarrollo

```bash
# Instalar nuevas dependencias en el backend
docker-compose exec backend npm install <paquete>

# Instalar nuevas dependencias en el frontend
docker-compose exec frontend npm install <paquete>

# Ejecutar migraciones de base de datos (cuando las tengas)
docker-compose exec backend npm run migrate

# Ejecutar tests
docker-compose exec backend npm test
docker-compose exec frontend npm test
```

### Limpieza Completa

```bash
# Detener todo y limpiar
docker-compose down -v --remove-orphans

# Limpiar imágenes no utilizadas
docker image prune -a

# Limpiar todo el sistema Docker (⚠️ CUIDADO)
docker system prune -a --volumes
```

---

## 🔍 Verificación del Entorno

Una vez levantado el entorno, verifica que todo funciona correctamente:

### URLs de Acceso

| Servicio   | URL                          | Credenciales                    |
|------------|------------------------------|---------------------------------|
| Frontend   | http://localhost:5173        | N/A                             |
| Backend    | http://localhost:3000        | N/A                             |
| Keycloak   | http://localhost:8080        | admin / AdminPassword123!       |
| PostgreSQL | localhost:5432               | suprasense_admin / SuperSecure… |

### Health Checks

```bash
# Verificar salud de PostgreSQL
docker-compose exec postgres pg_isready -U suprasense_admin

# Verificar salud de Keycloak
curl http://localhost:8080/health/ready

# Verificar salud del Backend
curl http://localhost:3000

# Ver estado de todos los health checks
docker-compose ps
```

---

## 📝 Notas Importantes

### Desarrollo vs Producción

Este `docker-compose.yml` está configurado para **desarrollo**. Para producción:

1. Cambia `target: development` a `target: production` en los servicios
2. Usa `command: start` en Keycloak en lugar de `start-dev`
3. Configura variables de entorno específicas de producción
4. Usa secretos de Docker en lugar de archivos `.env`
5. Configura certificados SSL/TLS

### Seguridad

⚠️ **NUNCA** subas el archivo `.env` a Git. Está incluido en `.gitignore`.

```bash
# Verificar que .env está ignorado
echo ".env" >> .gitignore
```

### Persistencia de Datos

Los volúmenes `postgres_data` y `keycloak_data` persisten los datos incluso si detienes los contenedores. Para eliminarlos completamente, usa:

```bash
docker-compose down -v
```

### Hot Reload

Tanto el Frontend como el Backend tienen **hot reload** activado:
- Los cambios en el código se reflejan automáticamente
- No necesitas reconstruir las imágenes para cada cambio
- Los `node_modules` están en un volumen anónimo para mejor rendimiento

---

## 🐛 Troubleshooting

### Problema: Puerto ya en uso

```bash
# Cambiar puertos en el archivo .env
FRONTEND_PORT=5174
BACKEND_PORT=3001
POSTGRES_PORT=5433
KEYCLOAK_PORT=8081
```

### Problema: Keycloak no inicia

```bash
# Ver logs detallados
docker-compose logs -f keycloak

# Verificar que PostgreSQL está saludable
docker-compose ps postgres
```

### Problema: Backend no conecta a la base de datos

```bash
# Verificar la URL de conexión
docker-compose exec backend env | grep DATABASE_URL

# Probar conexión manual
docker-compose exec postgres psql -U suprasense_admin -d suprasense_db
```

### Problema: Cambios no se reflejan (Hot Reload)

```bash
# Reiniciar el servicio
docker-compose restart frontend
docker-compose restart backend

# Si persiste, reconstruir
docker-compose up -d --build frontend
```

---

## 📚 Próximos Pasos

1. **Configurar Keycloak**:
   - Crear un realm llamado `suprasense`
   - Crear un client `suprasense-app`
   - Configurar usuarios y roles

2. **Configurar Base de Datos**:
   - Crear esquemas y tablas necesarias
   - Configurar migraciones (Prisma, TypeORM, etc.)

3. **Integrar Autenticación**:
   - Implementar Keycloak en el Backend
   - Implementar Keycloak en el Frontend

4. **CI/CD**:
   - Configurar GitHub Actions
   - Automatizar builds y tests

---

## 👨‍💻 Autor

**SupraSense - SoftwareArceo Team**

Para cualquier duda o sugerencia, contacta al equipo de DevOps.

---

**¡Happy Coding! 🚀**
