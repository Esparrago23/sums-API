import { z } from 'zod';

export const catalogoSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().nullable().optional()
  })
});
