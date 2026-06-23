import { z } from 'zod';

export const alimentacionSchema = z.object({
  carne_pescado_pollo: z.number().min(0).max(7),
  frutas_verduras: z.number().min(0).max(7),
  cereales_granos_leguminosas: z.number().min(0).max(7)
});

export const toxicomaniasSchema = z.object({
  alcoholismo: z.boolean(),
  tabaquismo: z.boolean(),
  otras_sustancias: z.string()
});

export const enfermedadesCronicasSchema = z.object({
  obesidad: z.boolean(),
  hipertension: z.boolean(),
  diabetes_mellitus_tipo_2: z.boolean(),
  tosedor_cronico: z.boolean(),
  otras_enfermedades: z.string()
});

export const estiloVidaSchema = z.object({
  persona_id: z.number().int().positive("El ID de la persona debe ser un número positivo"),
  toxicomanias: toxicomaniasSchema,
  enfermedades_cronicas: enfermedadesCronicasSchema,
  alimentacion: alimentacionSchema,
  higiene_personal: z.boolean()
});
