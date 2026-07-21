import { z } from 'zod';

export const cedulaSchema = z.object({
  body: z.object({
    unidad_salud_id: z.number().int().positive("unidad_salud_id debe ser un entero positivo"),
    entrevistador_id: z.number().int().positive("entrevistador_id debe ser un entero positivo"),
    levantamiento_id: z.number().int().positive().nullable().optional(),
    nucleo_familiar_id: z.number().int().positive("nucleo_familiar_id debe ser un entero positivo"),
    fecha_registro: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    estado: z.enum(['borrador', 'sincronizada', 'validada', 'cerrada']),
    observaciones: z.string().trim().nullable().optional()
  })
});

// POST /cedulas/captura-completa: payload compuesto (familia + vivienda + integrantes +
// vacunas) construido por la app móvil/web durante el levantamiento de una cédula
// completa. La validación aquí es deliberadamente básica (objeto/arreglo con la forma
// general esperada); el detalle fino de cada sub-entidad ya se valida en
// CapturaCompletaCedulaUseCase.
const looseRecord = z.record(z.string(), z.any());

export const capturaCompletaSchema = z.object({
  body: z
    .object({
      familia: looseRecord.optional(),
      vivienda: looseRecord.optional(),
      integrantes: z.array(looseRecord).optional()
    })
    .passthrough()
});

// POST /sums/sync: acepta un arreglo de payloads de captura-completa, o un objeto
// { payloads: [...] } (ver SyncCedulasController).
export const syncCedulasSchema = z.object({
  body: z.union([z.array(looseRecord), z.object({ payloads: z.array(looseRecord) }).passthrough()])
});
