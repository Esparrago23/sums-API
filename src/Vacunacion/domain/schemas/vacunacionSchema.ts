import { z } from 'zod';

export const vacunacionSchema = z.object({
  body: z.object({
    esquema_vacunacion_id: z.number().int().positive("esquema_vacunacion_id debe ser un entero positivo"),
    cedula_id: z.number().int().positive("cedula_id debe ser un entero positivo").nullable().optional(),
    vacuna_id: z.number().int().positive("vacuna_id debe ser un entero positivo"),
    dosis_id: z.number().int().positive("dosis_id debe ser un entero positivo").nullable().optional(),
    otra_vacuna_especificar: z.string().nullable().optional(),
    fecha_aplicacion: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).nullable().optional(),
    persona_id: z.number().int().positive("persona_id debe ser un entero positivo").optional(),
    unidad_salud_id: z.number().int().positive("unidad_salud_id debe ser un entero positivo").nullable().optional(),
  })
});
