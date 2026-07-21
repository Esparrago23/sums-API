import { z } from 'zod';

// Contraseña: mínimo 8 caracteres + mezcla de mayúscula, minúscula y número.
// Exportado para reutilizarse en otros schemas que también crean usuarios
// (p.ej. createEntrevistadorUserSchema.ts para POST /register-entrevistador).
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .refine((pwd) => /[A-Z]/.test(pwd), { message: "La contraseña debe incluir al menos una letra mayúscula" })
  .refine((pwd) => /[a-z]/.test(pwd), { message: "La contraseña debe incluir al menos una letra minúscula" })
  .refine((pwd) => /[0-9]/.test(pwd), { message: "La contraseña debe incluir al menos un número" });

// Usado en POST /register (público). rol_id deliberadamente NO forma parte de este
// schema: la ruta pública nunca debe leer el rol del cliente (ver
// CreateUserUseCase, que fuerza server-side el rol mínimo por defecto).
export const createUserSchema = z.object({
  body: z.object({
    nombre_usuario: z.string().trim().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    contrasena: passwordSchema,
    activo: z.boolean().optional(),
    unidad_salud_id: z.number().int().positive().optional().nullable(),
    datos_laborales_id: z.number().int().positive().optional().nullable(),
    entrevistador_id: z.number().int().positive().optional().nullable()
  })
});

// Usado en POST /users/admin/register, protegida con roleMiddleware([1, 2]).
export const createUserAdminSchema = z.object({
  body: z.object({
    nombre_usuario: z.string().trim().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    contrasena: passwordSchema,
    rol_id: z.number().int().positive("El rol debe ser un ID válido"),
    activo: z.boolean().optional(),
    unidad_salud_id: z.number().int().positive().optional().nullable(),
    datos_laborales_id: z.number().int().positive().optional().nullable(),
    entrevistador_id: z.number().int().positive().optional().nullable()
  })
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número entero")
  }),
  body: z.object({
    rol_id: z.number().int().positive("El rol debe ser un ID válido")
  })
});
