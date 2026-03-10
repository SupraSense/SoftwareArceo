---
trigger: always_on
---

---
name: Backend Architecture & SOLID Patterns
description: Enforces folder structure, coding patterns, SOLID principles, and error handling conventions for the Express + Prisma + TypeScript backend.
---

# Backend Architecture & SOLID Patterns

Este documento define la arquitectura obligatoria del backend. **Todo código nuevo debe respetar estas convenciones sin excepción.**

---

## 1. Estructura de Carpetas (NO inventar rutas)

```
Backend/
├── app.ts                    # Entry point — registra middlewares y rutas
├── controllers/              # Handlers HTTP: valida input, delega al service, mapea errores a HTTP
│   └── {entidad}Controller.ts
├── services/                 # Lógica de negocio: operaciones de dominio con Prisma
│   └── {entidad}Service.ts
├── validators/               # Schemas Zod server-side para validar req.body
│   └── {entidad}Validation.ts
├── routes/                   # Definición de rutas Express + middlewares de auth
│   └── {entidad}Routes.ts
├── middleware/                # Middlewares reutilizables (auth, errorHandler)
│   ├── authMiddleware.ts     # checkJwt (JWT via Keycloak) y requireRole(role)
│   └── errorHandler.ts      # Middleware centralizado de errores (ÚLTIMO en app.ts)
├── lib/                      # Infraestructura compartida (singletons, errores custom)
│   ├── prisma.ts             # Singleton de PrismaClient (NUNCA crear instancias nuevas)
│   └── errors.ts             # ValidationError, NotFoundError, ConflictError
├── interfaces/               # Contratos/interfaces TypeScript (Principio de Inversión de Dependencias)
│   └── I{Nombre}.ts
├── providers/                # Implementaciones concretas de interfaces
│   └── {Nombre}Provider.ts
├── utils/                    # Funciones puras utilitarias (crypto, tokens, formatters)
│   └── {nombre}Utils.ts
└── prisma/
    ├── schema.prisma         # Modelo de datos
    ├── seed.ts               # Seeding de datos iniciales
    └── migrations/           # Migraciones generadas por Prisma
```

---

## 2. Flujo por Capa (Request → Response)

```
Route → [checkJwt] → [requireRole?] → Controller → Service → Prisma
                                          ↓ (valida con Zod)
                                          ↓ (catch custom errors → HTTP status)
```

### 2.1 Routes (`routes/{entidad}Routes.ts`)

- **SIEMPRE** importar `checkJwt` y aplicarlo a todas las rutas protegidas.
- Usar `requireRole('admin')` para operaciones sensibles.
- **NO** poner lógica en las rutas; solo wiring.

```typescript
import { Router } from 'express';
import * as controller from '../controllers/{entidad}Controller';
import { checkJwt } from '../middleware/authMiddleware';

const router = Router();

router.get('/', checkJwt, controller.getAll);
router.get('/:id', checkJwt, controller.getById);
router.post('/', checkJwt, controller.create);
router.put('/:id', checkJwt, controller.update);
router.delete('/:id', checkJwt, controller.remove);

export default router;
```

### 2.2 Controllers (`controllers/{entidad}Controller.ts`)

**Responsabilidad única**: Validar input con Zod, invocar el service, mapear errores custom a HTTP.

```typescript
import { Request, Response } from 'express';
import * as service from '../services/{entidad}Service';
import { createSchema, updateSchema } from '../validators/{entidad}Validation';
import { NotFoundError, ConflictError } from '../lib/errors';

export const create = async (req: Request, res: Response) => {
    // 1. Validar con Zod (safeParse, NUNCA parse directo)
    const parseResult = createSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ message: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        // 2. Delegar al service con datos tipados
        const result = await service.create(parseResult.data);
        return res.status(201).json(result);
    } catch (error) {
        // 3. Mapear errores custom a HTTP
        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error('[Controller] Error:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
```

**Reglas del controller:**
- **NUNCA** importar `PrismaClient` directamente.
- **NUNCA** poner lógica de negocio ni queries SQL/Prisma.
- **SIEMPRE** usar `safeParse`, nunca `parse` (evita excepciones no controladas).
- Mensajes de error en **español** para el usuario.
- Log técnico con `console.error('[NombreController] contexto:', error)`.

### 2.3 Services (`services/{entidad}Service.ts`)

**Responsabilidad única**: Lógica de negocio y acceso a datos vía el singleton de Prisma.

```typescript
import prisma from '../lib/prisma';
import { NotFoundError, ConflictError } from '../lib/errors';
import type { CreateInput } from '../validators/{entidad}Validation';

export const create = async (data: CreateInput) => {
    try {
        return await prisma.{entidad}.create({ data });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('Ya existe un registro con esos datos');
        }
        throw error;
    }
};
```

**Reglas del service:**
- **SIEMPRE** importar `prisma` desde `../lib/prisma` (singleton).
- **NUNCA** crear `new PrismaClient()`.
- **SIEMPRE** tipar los parámetros con los tipos inferidos de Zod (`CreateInput`, `UpdateInput`).
- Lanzar errores custom (`NotFoundError`, `ConflictError`, `ValidationError`) — el controller los atrapa.
- **PROHIBIDO** usar `any` excepto para capturar error codes de Prisma (`error.code`).

### 2.4 Validators (`validators/{entidad}Validation.ts`)

Un archivo por entidad con schemas de Zod y los tipos inferidos.

```typescript
import { z } from 'zod';

export const createSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().email('Formato de email inválido').optional().or(z.literal('')),
});

export const updateSchema = createSchema.partial();

export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
```

**Regla**: siempre exportar los tipos `Create{Entidad}Input` y `Update{Entidad}Input`.

---

## 3. Errores Centralizados

### 3.1 Clases (`lib/errors.ts`)

| Clase | HTTP | Uso |
|-------|------|-----|
| `ValidationError` | 400 | Reglas de negocio incumplidas |
| `NotFoundError` | 404 | Recurso no encontrado |
| `ConflictError` | 409 | Duplicados (unique constraints) |

**Para agregar un nuevo error**: crear la clase en `lib/errors.ts` y agregar el mapeo en `middleware/errorHandler.ts`.

### 3.2 Error Handler (`middleware/errorHandler.ts`)

- Registrado como **ÚLTIMO middleware** en `app.ts`.
- Mapea automáticamente errores de Prisma (`P2002`, `P2025`) y JWT (`UnauthorizedError`).
- **NUNCA** usar `window.alert()`, `window.confirm()`, ni `window.prompt()` en backend.
- **NUNCA** usar `@ts-ignore` ni `@ts-nocheck`.

---

## 4. Principios SOLID Aplicados

### S — Single Responsibility
- Controllers: solo HTTP (validar, responder).
- Services: solo lógica de negocio + Prisma.
- Validators: solo schemas Zod.
- Routes: solo wiring.

### O — Open/Closed
- Nuevos errores → agregar clase en `lib/errors.ts` + mapeo en `errorHandler.ts`, sin tocar los controllers existentes.

### L — Liskov Substitution
- Toda implementación de `IIdentityProvider` o `IEmailService` debe ser intercambiable sin romper el `UserManagementService`.

### I — Interface Segregation
- Interfaces en `interfaces/` tienen contratos mínimos y específicos.

### D — Dependency Inversion
- Servicios complejos (ej. `UserManagementService`) reciben interfaces por constructor, no instancias concretas.
- La instanciación concreta ocurre en el **Composition Root** (tope del controller).

```typescript
// Composition Root — en el controller
const identityProvider = new KeycloakIdentityProvider();
const emailService = new ConsoleEmailService();
const userService = new UserManagementService(identityProvider, emailService);
```

---

## 5. Seguridad

- **Todas las rutas** (excepto `/api/auth/login`) llevan `checkJwt`.
- Operaciones admin llevan `requireRole('admin')` adicional.
- JWT se extrae desde cookies (`access_token`), NO desde headers Authorization.
- Passwords temporales se generan con `crypto.randomBytes` en `utils/passwordUtils.ts`.
-Tokens de invitación como UUID v4 en `utils/tokenUtils.ts`.

---

## 6. Registrando un Nuevo Módulo (Checklist)

Cuando necesites crear un nuevo módulo (ej. `vehiculos`):

1. `validators/vehiculoValidation.ts` → Zod schemas + tipos exportados
2. `services/vehiculoService.ts` → import prisma singleton + custom errors
3. `controllers/vehiculoController.ts` → Zod safeParse + delegate to service
4. `routes/vehiculoRoutes.ts` → checkJwt en todas las rutas
5. `app.ts` → `app.use('/api/vehiculos', vehiculoRoutes);`
6. Si hay servicios externos → `interfaces/I{Servicio}.ts` + `providers/{Servicio}Provider.ts`

---

## 7. Prohibiciones Absolutas

| Prohibición | Razón |
|-------------|-------|
| `new PrismaClient()` en services/controllers | Usar `lib/prisma.ts` singleton |
| `any` como tipo de parámetro o retorno | Usar tipos de Zod o Prisma |
| `@ts-ignore` / `@ts-nocheck` | Corregir el tipo, no silenciarlo |
| `console.log()` en producción | Usar `console.error` solo para errores |
| Lógica de negocio en controllers | Toda lógica va en services |
| Queries Prisma en controllers | Toda interacción con BD va en services |
| Validación inline (regex manual en controllers) | Usar Zod schemas en `validators/` |
| Mensajes de error en inglés al usuario | Siempre en español |
| `window.alert` / `window.confirm` | Prohibido en todo el stack |
