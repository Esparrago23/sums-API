import { z } from 'zod';

export const nucleoFamiliarSchema = z.object({
  body: z.object({
    jefe_persona_id: z.number().int().nullable().optional(),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" }),
    fecha_cierre: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de cierre inválida" }),
    comentarios: z.string().nullable().optional()
  })
});

export const nucleoPersonaSchema = z.object({
  body: z.object({
    nucleo_familiar_id: z.number().int(),
    persona_id: z.number().int(),
    parentesco_id: z.number().int().nullable().optional(),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" }),
    fecha_salida: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de salida inválida" }),
    comentarios: z.string().nullable().optional()
  })
});

export const nucleoPersonaPatchSchema = z.object({
  body: z.object({
    parentesco_id: z.number().int().nullable().optional(),
    fecha_salida: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de salida inválida" }),
    comentarios: z.string().nullable().optional()
  })
});
