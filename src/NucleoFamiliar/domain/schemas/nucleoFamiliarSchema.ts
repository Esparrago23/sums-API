import { z } from 'zod';

export const nucleoFamiliarSchema = z.object({
  body: z.object({
    jefe_persona_id: z.number().int().nullable().optional(),
    fecha_registro: z.string().trim().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" }),
    fecha_cierre: z.string().trim().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de cierre inválida" }),
    comentarios: z.string().trim().nullable().optional()
  }).refine((data) => {
    if (!data.fecha_registro || !data.fecha_cierre) return true;
    return new Date(data.fecha_registro).getTime() <= new Date(data.fecha_cierre).getTime();
  }, {
    message: "fecha_registro debe ser anterior o igual a fecha_cierre",
    path: ["fecha_cierre"]
  })
});

export const nucleoPersonaSchema = z.object({
  body: z.object({
    nucleo_familiar_id: z.number().int(),
    persona_id: z.number().int(),
    parentesco_id: z.number().int().nullable().optional(),
    fecha_registro: z.string().trim().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" }),
    fecha_salida: z.string().trim().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de salida inválida" }),
    comentarios: z.string().trim().nullable().optional()
  })
});

export const nucleoPersonaPatchSchema = z.object({
  body: z.object({
    parentesco_id: z.number().int().nullable().optional(),
    fecha_salida: z.string().trim().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de salida inválida" }),
    comentarios: z.string().trim().nullable().optional()
  })
});
