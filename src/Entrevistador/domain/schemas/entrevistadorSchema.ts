import { z } from 'zod';

export const entrevistadorSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    unidad_salud_id: z.number().int().positive("unidad_salud_id debe ser un entero positivo"),
    datos_laborales_id: z.number().int().positive().nullable().optional(),
    fecha_registro: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).nullable().optional()
  })
});
