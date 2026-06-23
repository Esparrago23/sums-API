import { z } from 'zod';

export const materialesViviendaSchema = z.object({
  vivienda_id: z.number().int().positive("El ID de la vivienda debe ser un número positivo"),
  tipo: z.string().min(1, "El tipo es requerido"),
  material: z.string().min(1, "El material es requerido"),
  especificacion: z.string().optional(),
});
