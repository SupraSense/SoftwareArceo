# 🚀 SoftwareArceo - SupraSense Platform

> 📚 **[Ver Índice Completo de Documentación](./DOCUMENTATION_INDEX.md)** - Guía completa de toda la documentación disponible

## 📚 Documentación

Para información completa sobre la infraestructura Docker, consulta:

👉 **[DOCKER_INFRASTRUCTURE.md](./DOCKER_INFRASTRUCTURE.md)**

### Generar todos los contenedores:

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


### Guía de Desarrollo: 
Flujo "Hot" e InfraestructuraPara maximizar la productividad y aprovechar el Hot Reload nativo, utilizamos un enfoque híbrido: la infraestructura pesada corre en Docker, mientras que el código de la aplicación se ejecuta de forma Local.
1. Levantar la Infraestructura (Docker)Este comando inicia los servicios base que el sistema necesita para funcionar. Solo es necesario ejecutarlo una vez al iniciar la jornada:Bash# Inicia PostgreSQL, Keycloak y Prisma Studio
docker compose up -d postgres keycloak prisma-studio
PostgreSQL: Base de datos central para OTs y Recursos.
Keycloak: Gestiona la autenticación y roles (Admin, Coordinador, Chofer) .
Prisma Studio: Interfaz visual de la DB en http://localhost:5555.
2. Ejecutar la Aplicación (Local)Al ejecutar el código localmente, el refresco de cambios es instantáneo, evitando la latencia de las capas de red de Docker.
Backend (Node.js/Express):
npm run dev
Frontend (React/Vite):
npm run dev
### 🛠️ Comandos Esenciales de Prisma

Prisma es nuestro "puente" hacia la base de datos de SoftwareArceo. Estos comandos aseguran que tu código TypeScript siempre reconozca los modelos de datos (como `OrdenTrabajo` o `Recurso`).

| Comando | Propósito | Cuándo usarlo |
| :--- | :--- | :--- |
| `npx prisma migrate dev` | Sincroniza el `schema.prisma` con la DB real. | Al añadir campos (ej. Patente del camión o estados de recursos). |
| `npx prisma generate` | Regenera los tipos de TypeScript para el cliente. | Después de cualquier cambio en el esquema si el IDE marca errores. |
| `npx prisma db seed` | Carga los datos maestros iniciales del sistema. | Al configurar el entorno por primera vez para tener Clientes y Choferes de prueba. |
| `npx prisma studio` | Abre un explorador visual de la base de datos. | Para auditar rápidamente si los remitos o OTs se guardaron correctamente. |

Si salta el error:
EPERM: operation not permitted, unlink 'C:\Users\usuario\SoftwareArceo\Backend\node_modules\.prisma\client\query_engine-windows.dll.node'
ejecuta: Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

#### ⚠️ Notas Importantes

- **Networking**: Si trabajas en modo local, asegúrate de que tu `DATABASE_URL` apunte a `localhost:5432` y no al nombre del servicio de Docker.
- **Estructura**: Mantener la arquitectura en capas para asegurar la trazabilidad de cada servicio prestado.

## 📖 Stack Tecnológico

- **Frontend**: React + Tailwind CSS (Vite)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16
- **Auth**: Keycloak 24+

---

**SupraSense © 2026**