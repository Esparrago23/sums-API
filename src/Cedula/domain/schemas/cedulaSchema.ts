import { z } from 'zod';

export const cedulaSchema = z.object({
  body: z.object({
    unidad_salud_id: z.number().int().positive("unidad_salud_id debe ser un entero positivo"),
    entrevistador_id: z.number().int().positive("entrevistador_id debe ser un entero positivo"),
    levantamiento_id: z.number().int().positive().nullable().optional(),
    nucleo_familiar_id: z.number().int().positive("nucleo_familiar_id debe ser un entero positivo"),
    fecha_registro: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    estado: z.enum(['borrador', 'sincronizada', 'validada', 'cerrada']),
    observaciones: z.string().nullable().optional()
  })
});
