import { z } from 'zod';

export const personaAlimentacionSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    dias_proteina: z.number().int().min(0).max(7),
    dias_frutas_verduras: z.number().int().min(0).max(7),
    dias_cereales: z.number().int().min(0).max(7),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" })
  })
});

export const personaHigieneSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    higiene_bano_bucodental_diaria: z.boolean(),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" })
  })
});

export const personaSeguridadSocialSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    cuenta_seguridad_social: z.boolean(),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" })
  })
});

export const personaDiscapacidadSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    presenta_discapacidad: z.boolean(),
    tipo_discapacidad: z.string().nullable().optional()
  }).refine((data) => {
    if (data.tipo_discapacidad && !data.presenta_discapacidad) return false;
    return true;
  }, {
    message: "Si hay tipo de discapacidad, presenta_discapacidad debe ser true",
    path: ["presenta_discapacidad"]
  })
});

export const personaToxicomaniaSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    toxicomania_id: z.number().int(),
    otra_sustancia: z.string().nullable().optional()
  })
});

export const personaEnfermedadCronicaSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    enfermedad_cronica_id: z.number().int()
  })
});

export const personaSaludPreventivaSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    atencion_embarazo_id: z.number().int().nullable().optional(),
    tamizaje_cervico_uterino: z.boolean().nullable().optional(),
    fecha_tamizaje_cervico_uterino: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha inválida" }),
    tamizaje_cancer_mama: z.boolean().nullable().optional(),
    fecha_tamizaje_cancer_mama: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha inválida" }),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha inválida" })
  })
});

export const personaServicioSaludSchema = z.object({
  body: z.object({
    persona_id: z.number().int(),
    frecuencia_servicio_salud_id: z.number().int().nullable().optional(),
    motivo_uso: z.string().nullable().optional(),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha inválida" })
  })
});

export const schemaByTipo = {
  'alimentacion': personaAlimentacionSchema,
  'higiene': personaHigieneSchema,
  'seguridad-social': personaSeguridadSocialSchema,
  'discapacidades': personaDiscapacidadSchema,
  'toxicomanias': personaToxicomaniaSchema,
  'enfermedades-cronicas': personaEnfermedadCronicaSchema,
  'salud-preventiva': personaSaludPreventivaSchema,
  'servicios-salud': personaServicioSaludSchema
} as const;
