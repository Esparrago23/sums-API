import { z } from 'zod';

export const saludFamiliarSchema = z.object({
  body: z.object({
    persona_id: z.number().int().positive("persona_id debe ser un entero positivo"),
    seguridad_social: z.boolean(),
    enfermedades: z.boolean(),
    embarazo_atencion: z.boolean(),
    alimentacion: z.string().min(1, "La alimentación es obligatoria"),
    higiene_familiar: z.boolean(),
    alcoholismo: z.boolean(),
    tabaquismo: z.boolean(),
    tamizaje_cervico_uterino: z.boolean(),
    tamizaje_cancer_mama: z.boolean(),
    discapacidad: z.boolean(),
    servicio_salud_frecuencia: z.boolean(),
    motivo_uso_servicio_salud: z.boolean()
  })
});
