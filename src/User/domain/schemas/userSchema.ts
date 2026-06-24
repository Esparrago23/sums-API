import { z } from 'zod';

export const createUserAdminSchema = z.object({
  body: z.object({
    nombre_usuario: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
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
