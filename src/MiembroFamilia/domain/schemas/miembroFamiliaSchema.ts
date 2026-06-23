import { z } from 'zod';

export const miembroFamiliaSchema = z.object({
  body: z.object({
    datos_personales_id: z.number().int({ message: "datos_personales_id debe ser un entero" }),
    salud_id: z.number().int({ message: "salud_id debe ser un entero" }),
    educacion_id: z.number().int({ message: "educacion_id debe ser un entero" })
  })
});
