import { z } from 'zod';

export const visitaSchema = z.object({
  fecha: z.string(),
  profesional: z.string().min(1),
  tipo: z.string().min(1),
  observaciones: z.string().optional(),
  actividades: z.array(z.string()).optional()
});

export const servicioSaludSchema = z.object({
  persona_id: z.number().int().positive("El ID de la persona debe ser un número positivo"),
  visitas: z.array(visitaSchema),
  frecuencia: z.string().optional()
});
