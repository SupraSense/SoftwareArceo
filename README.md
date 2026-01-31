# 🚀 SoftwareArceo - SupraSense Platform

Plataforma fullstack TypeScript para SupraSense.

> 📚 **[Ver Índice Completo de Documentación](./DOCUMENTATION_INDEX.md)** - Guía completa de toda la documentación disponible

## 📚 Documentación

Para información completa sobre la infraestructura Docker, consulta:

👉 **[DOCKER_INFRASTRUCTURE.md](./DOCKER_INFRASTRUCTURE.md)**

## ⚡ Quick Start

### Opción 1: Usando el Helper Script (Recomendado para Windows)

```powershell
# 1. Configuración inicial
.\docker-helper.ps1 setup

# 2. Editar credenciales (opcional)
# code .env

# 3. Levantar el entorno completo
.\docker-helper.ps1 start

# 4. Ver logs
.\docker-helper.ps1 logs

# Ver todos los comandos disponibles
.\docker-helper.ps1 help
```

### Opción 2: Usando Docker Compose directamente

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Editar credenciales (opcional)
# code .env

# 3. Levantar el entorno completo
docker-compose up -d --build

# 4. Ver logs
docker-compose logs -f
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Keycloak**: http://localhost:8080 (admin / AdminPassword123!)
- **PostgreSQL**: localhost:5432

## 🛑 Detener el Entorno

```bash
docker-compose down
```

## 📖 Stack Tecnológico

- **Frontend**: React + Tailwind CSS (Vite)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16
- **Auth**: Keycloak 24+

---

**SupraSense © 2026**