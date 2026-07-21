import { z } from 'zod';

// Envuelto en "body: z.object({...})" (ver validateMiddleware, que siempre valida
// { body, query, params }). Antes el shape no tenía este envoltorio: al validar
// contra { body, query, params }, el campo requerido "nucleo_familiar_id" nunca
// existía en la raíz del objeto recibido y la validación rechazaba TODAS las
// peticiones (incluidas las válidas).
export const viviendaSchema = z.object({
  body: z.object({
    nucleo_familiar_id: z.number().int().positive("El ID del núcleo familiar debe ser un número positivo"),
    direccion_id: z.number().int().positive().nullable().optional(),
    numero_cuartos: z.number().int().nonnegative().nullable().optional(),
    numero_habitantes: z.number().int().nonnegative().nullable().optional(),
    agua_entubada: z.boolean().nullable().optional(),
    energia_electrica: z.boolean().nullable().optional(),
    cocina_ubicacion: z.enum(['fuera_del_dormitorio', 'dentro_del_dormitorio']).nullable().optional(),
    cocina_con_lena: z.boolean().nullable().optional(),
    manejo_excretas_id: z.number().int().positive().nullable().optional(),
    red_alcantarillado: z.boolean().nullable().optional(),
    fosa_septica: z.boolean().nullable().optional(),
    material_techo_id: z.number().int().positive().nullable().optional(),
    material_paredes_id: z.number().int().positive().nullable().optional(),
    material_piso_id: z.number().int().positive().nullable().optional(),
    material_otro_especificar: z.string().trim().nullable().optional(),
    perros_gatos_dentro: z.boolean().nullable().optional(),
    mascotas_vacunas_corrientes: z.boolean().nullable().optional(),
    mascotas_esterilizadas: z.boolean().nullable().optional(),
    comentarios: z.string().trim().nullable().optional(),
  })
});

export const familiaAnimalSchema = z.object({
  body: z.object({
    nucleo_familiar_id: z.number().int().positive("El ID del núcleo familiar debe ser un número positivo"),
    animal_id: z.number().int().positive("El ID del animal debe ser un número positivo"),
    otro_especificar: z.string().trim().nullable().optional(),
    comentarios: z.string().trim().nullable().optional(),
  })
});
