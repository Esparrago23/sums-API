import { z } from 'zod';

export const educacionSchema = z.object({
  body: z.object({
    persona_id: z.number().int().positive("persona_id debe ser un entero positivo"),
    escolaridad: z.string().min(1, "La escolaridad es obligatoria"),
    ocupacion: z.string().min(1, "La ocupación es obligatoria")
  })
});
