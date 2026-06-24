import { z } from 'zod';

export const personaSchema = z.object({
  body: z.object({
    primer_nombre: z.string().min(1, "El primer nombre es requerido"),
    segundo_nombre: z.string().nullable().optional(),
    apellido_paterno: z.string().min(1, "El apellido paterno es requerido"),
    apellido_materno: z.string().nullable().optional(),
    fecha_nacimiento: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Fecha de nacimiento inválida" }),
    sexo: z.enum(['masculino', 'femenino']),
    alfabetizacion: z.boolean().nullable().optional(),
    estado_civil_id: z.number().int().nullable().optional(),
    lengua_id: z.number().int().nullable().optional(),
    lengua_indigena_especificar: z.string().nullable().optional(),
    escolaridad_id: z.number().int().nullable().optional(),
    ocupacion_id: z.number().int().nullable().optional(),
    ocupacion_texto: z.string().nullable().optional(),
    ingreso_salarial_id: z.number().int().nullable().optional(),
    cuenta_seguridad_social: z.boolean().nullable().optional(),
    presenta_discapacidad: z.boolean().nullable().optional(),
    tipo_discapacidad: z.string().nullable().optional(),
    fecha_registro: z.string().nullable().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: "Fecha de registro inválida" })
  }).refine((data) => {
    // Guía del microdiagnóstico: Si se especifica un tipo de discapacidad, la bandera debe ser true
    if (data.tipo_discapacidad && !data.presenta_discapacidad) return false;
    return true;
  }, {
    message: "Si hay tipo de discapacidad, presenta_discapacidad debe ser true",
    path: ["presenta_discapacidad"]
  }).refine((data) => {
    // Guía del microdiagnóstico: Si especifica lengua indigena, debe tener un lengua_id
    if (data.lengua_indigena_especificar && !data.lengua_id) return false;
    return true;
  }, {
    message: "Si especifica lengua indígena, debe proveer el lengua_id",
    path: ["lengua_id"]
  })
});
