import { z } from 'zod';

export const datosLaboralesSchema = z.object({
  body: z.object({
    turno_id: z.number().int().positive("El turno_id debe ser un número entero válido").optional().nullable(),
    horario_inicio: z.string().trim().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "El horario_inicio debe tener el formato HH:MM o HH:MM:SS").optional().nullable(),
    horario_fin: z.string().trim().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "El horario_fin debe tener el formato HH:MM o HH:MM:SS").optional().nullable(),
    cargo: z.string().trim().optional().nullable(),
    especialidad: z.string().trim().optional().nullable()
  }).refine((data) => {
    if (!data.horario_inicio || !data.horario_fin) return true;
    return data.horario_inicio <= data.horario_fin;
  }, {
    message: "horario_inicio debe ser anterior o igual a horario_fin",
    path: ["horario_fin"]
  })
});
