# US-001: Gestión de Usuarios del Sistema

## 📋 User Story

**Como** administrador del sistema,  
**Quiero** poder registrar nuevos usuarios, gestionar sus roles/permisos y dar de baja a usuarios existentes,  
**Para** mantener un control seguro y centralizado del acceso al sistema.

---

## 🎯 Criterios de Aceptación

### AC-1: Acceso a la funcionalidad
- [x] Existe un botón **"Agregar Nuevo Usuario"** visible dentro de la sección de configuración de usuarios (`/app/configuration/usuarios`).
- [x] El botón está disponible solo para usuarios con sesión activa (ruta protegida).
- [x] La sección se encuentra en el sidebar bajo **Configuración → Usuarios**.

### AC-2: Formulario de Alta de Usuario
- [x] El formulario contiene los siguientes campos:
  | Campo | Tipo | Requerido | Validación |
  |-------|------|-----------|------------|
  | Nombre | Text | ✅ | Mín. 2 caracteres, solo letras |
  | Apellido | Text | ✅ | Mín. 2 caracteres, solo letras |
  | DNI | Text | ✅ | 7-8 dígitos, solo numérico, único en BD |
  | Email | Email | ✅ | Formato email válido, único en BD |
  | Rol | Select | ✅ | ADMIN, OPERADOR, SUPERVISOR, CHOFER, TALLER |
  | Contraseña temporal | Automática | N/A | No se ingresa en el formulario |

### AC-3: Validaciones en Tiempo Real (Feedback Inmediato)
- [x] **Email**: Se valida formato (Zod) y unicidad contra la BD al escribir (debounce 600ms).
  - Indicador visual de estado: spinner (verificando), ✅ (disponible), ❌ (en uso).
- [x] **DNI**: Se valida que sea numérico (Zod) y único en BD al completar el campo (debounce 600ms).
  - Mismo sistema visual de indicadores.
- [x] **Contraseña temporal**: No se ingresa manualmente. Se genera automáticamente en el backend y se envía por email.
- [x] El formulario bloquea el envío si el email o DNI ya están registrados.

### AC-4: Flujo de Alta Segura
1. El administrador completa el formulario de alta.
2. Al confirmar, el backend:
   - Crea la cuenta del usuario con estado `PENDIENTE`.
   - Genera una contraseña temporal segura.
   - Envía un email al nuevo usuario con un **link único de primer inicio de sesión**.
3. El nuevo usuario accede al sistema mediante el link recibido y establece su contraseña definitiva.

### AC-5: Gestión de Usuarios Existentes
- [x] **Tabla de usuarios**: Lista todos los usuarios con nombre, DNI, email, rol y estado.
- [x] **Búsqueda**: Por nombre, email o DNI.
- [x] **Filtros**: Por estado (Activo/Inactivo/Pendiente) y por rol.
- [x] **Edición**: Modal para modificar datos personales, rol y estado.
- [x] **Dar de baja**: Soft delete con confirmación — el usuario pasa a estado `INACTIVO`.
- [x] **Reactivar**: Usuarios inactivos pueden ser reactivados a `ACTIVO`.
- [x] **Reenviar invitación**: Para usuarios en estado `PENDIENTE` que no recibieron el email.

---

## 🏗️ Arquitectura Frontend

### Archivos Creados/Modificados

```
Frontend/src/
├── types/
│   └── user.ts                          # Tipos, DTOs, constantes de roles/estados
├── schemasZod/
│   └── userSchema.ts                    # Validaciones Zod (create + update)
├── services/
│   └── userService.ts                   # API service (CRUD + validaciones)
├── hooks/
│   └── useUsers.ts                      # Custom hook de estado + operaciones
├── components/
│   ├── ui/
│   │   └── Input.tsx                    # ⚡ Modificado: forwardRef para react-hook-form
│   └── users/
│       ├── UserForm.tsx                 # Modal formulario de alta
│       ├── UserEditForm.tsx             # Modal formulario de edición
│       └── UserTable.tsx                # Tabla con filtros + acciones
├── pages/
│   └── configuration/
│       └── users/
│           └── UsersPage.tsx            # Página principal de gestión
└── App.tsx                              # ⚡ Modificado: nueva ruta
```

### Patrones Aplicados

| Patrón | Implementación |
|--------|----------------|
| **Service Layer** | `userService.ts` — Abstracción sobre `axios` vía `api.ts` |
| **Custom Hook** | `useUsers.ts` — Gestión de estado + notificaciones (patrón de `useClients`) |
| **Zod Schemas** | `userSchema.ts` — Validación client-side con mensajes en español |
| **react-hook-form** | Formularios con `resolver: zodResolver()` y `mode: 'onChange'` |
| **Debounced Validation** | Email/DNI verificados contra API con 600ms de debounce |
| **Confirm Dialog** | Reutilización de `ConfirmDialog` para baja/activación |
| **Toast Notifications** | Via `useNotification` hook (sonner) |

---

## 🔌 Endpoints de Backend Requeridos

> **⚠️ IMPORTANTE**: Estos endpoints deben implementarse en el backend para que la funcionalidad sea operativa.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/users` | Listar todos los usuarios |
| `GET` | `/api/users/:id` | Obtener usuario por ID |
| `POST` | `/api/users` | Crear nuevo usuario (trigger de email) |
| `PUT` | `/api/users/:id` | Actualizar datos del usuario |
| `PATCH` | `/api/users/:id/deactivate` | Dar de baja (soft delete) |
| `PATCH` | `/api/users/:id/activate` | Reactivar usuario |
| `GET` | `/api/users/validate/email` | Check unicidad de email (`?email=...&excludeId=...`) |
| `GET` | `/api/users/validate/dni` | Check unicidad de DNI (`?dni=...&excludeId=...`) |
| `POST` | `/api/users/:id/resend-invitation` | Reenviar email de invitación |

### Respuesta de validación esperada
```json
{
  "available": true,
  "message": "Email disponible"
}
```

### Modelo de base de datos (schema.prisma)
El modelo `User` existente necesita ampliarse:
```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  firstName String?
  lastName  String?
  dni       String?    @unique
  address   String?
  role      String?
  status    String     @default("PENDIENTE")
  password  String?    // Hash de contraseña temporal
  invToken  String?    @unique // Token único para primer login
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

---

## 🔒 Consideraciones de Seguridad

1. La contraseña temporal **nunca** se muestra en el frontend.
2. El link de invitación contiene un **token único** de un solo uso.
3. El token debe tener una **expiración** (sugerido: 48-72 horas).
4. Al primer login, se debe forzar el **cambio de contraseña**.
5. Solo usuarios con rol `ADMIN` deberían acceder a esta funcionalidad.

---

## 📝 Notas para Desarrollo

- Los componentes siguen los patrones existentes del proyecto (TipoTareaPage, ClientsPage).
- Se usa **Tailwind CSS** con soporte para **dark mode**.
- La validación asíncrona usa debounce de 600ms para evitar exceso de requests.
- El componente `Input.tsx` fue actualizado a `forwardRef` para compatibilidad con `react-hook-form`.
- Las acciones contextuales en la tabla aparecen al hover del row para una experiencia limpia.
