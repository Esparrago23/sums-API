import { z } from 'zod';

export const unidadSaludSchema = z.object({
  body: z.object({
    clues: z.string().regex(/^[A-Za-z]{5}\d{6}$/, "CLUES debe tener exactamente 11 caracteres: 5 letras seguidas de 6 números"),
    nombre: z.string().min(1, "El nombre de la unidad de salud es requerido"),
    distrito: z.string().optional(),
    municipio_id: z.number().int().positive("El municipio_id debe ser un ID válido").optional(),
    numero_nucleos: z.number().int().min(0).optional()
  })
});
