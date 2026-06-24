import { z } from 'zod';

export const familiaSchema = z.object({
  body: z.object({
    jefe_persona_id: z.number().int().nullable().optional(),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" }),
    fecha_cierre: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de cierre inválida" }),
    comentarios: z.string().nullable().optional()
  })
});
