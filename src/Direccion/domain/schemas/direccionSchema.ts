import { z } from 'zod';

// El shape se envuelve en "body: z.object({...})" porque validateMiddleware
// siempre valida { body, query, params }. Sin este envoltorio, parseAsync recibía
// { body: req.body, query, params } contra un schema que esperaba las propiedades
// (calle, codigo_postal, ...) en la raíz: como todas son opcionales/nullable, el
// objeto pasaba a estar "vacío" para el validador y siempre validaba sin importar
// el contenido real de req.body.
export const direccionSchema = z.object({
  body: z.object({
    calle: z.string().trim().nullable().optional(),
    numero_exterior: z.string().trim().nullable().optional(),
    numero_interior: z.string().trim().nullable().optional(),
    colonia: z.string().trim().nullable().optional(),
    codigo_postal: z.string().trim().regex(/^\d{5}$/, "El código postal debe tener exactamente 5 dígitos").nullable().optional(),
    localidad: z.string().trim().nullable().optional(),
    manzana: z.string().trim().nullable().optional(),
    vivienda_referencia: z.string().trim().nullable().optional(),
    asentamiento_id: z.number().int().positive().nullable().optional()
  })
});
