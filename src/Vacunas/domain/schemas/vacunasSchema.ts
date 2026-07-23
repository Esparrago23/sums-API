import { z } from 'zod';

export const vacunasSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    descripcion: z.string().trim().nullable().optional()
  })
});
