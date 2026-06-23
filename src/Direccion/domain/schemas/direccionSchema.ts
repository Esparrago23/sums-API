import { z } from 'zod';

export const direccionSchema = z.object({
  calle: z.string().nullable().optional(),
  numero_exterior: z.string().nullable().optional(),
  numero_interior: z.string().nullable().optional(),
  colonia: z.string().nullable().optional(),
  codigo_postal: z.string().nullable().optional(),
  localidad: z.string().nullable().optional(),
  manzana: z.string().nullable().optional(),
  vivienda_referencia: z.string().nullable().optional(),
  asentamiento_id: z.number().int().positive().nullable().optional()
});
