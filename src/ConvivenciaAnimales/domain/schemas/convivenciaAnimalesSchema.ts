import { z } from 'zod';

export const convivenciaAnimalesSchema = z.object({
  familia_id: z.number().int().positive("El ID de la familia debe ser un número positivo"),
  perros_gatos: z.boolean(),
  vacunacion_mascotas: z.boolean(),
  esterilizacion_mascotas: z.boolean(),
  aves_corral: z.boolean(),
  bovinos: z.boolean(),
  porcinos: z.boolean(),
  comentarios_perros_gatos: z.string().optional(),
  comentarios_vacunacion: z.string().optional(),
  comentarios_esterilizacion: z.string().optional(),
  otros_animales: z.string().optional()
});
