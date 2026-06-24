import { z } from 'zod';

export const dosisSchema = z.object({
  body: z.object({
    nombre: z.enum(['unica', '1era', '2da', '3era', 'refuerzo'])
  })
});
