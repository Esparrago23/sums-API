import { z } from 'zod';
import { passwordSchema } from './userSchema';

// Usado en POST /register-entrevistador (ruta pública). Antes esta ruta no
// aplicaba ninguna validación: ni fortaleza de contraseña, ni el formato de
// CLUES de la unidad de salud (mismo regex que unidadSaludSchema.ts: 5 letras
// + 6 números). Se replican aquí para no acoplar este módulo con el router
// de UnidadSalud.
export const createEntrevistadorUserSchema = z.object({
  body: z.object({
    usuario: z.object({
      nombre_usuario: z.string().trim().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
      contrasena: passwordSchema
    }),
    unidad_salud: z.object({
      clues: z.string().trim().regex(/^[A-Za-z]{5}\d{6}$/, "CLUES debe tener exactamente 11 caracteres: 5 letras seguidas de 6 números"),
      nombre: z.string().trim().min(1, "El nombre de la unidad de salud es requerido"),
      distrito: z.string().trim().optional(),
      municipio_id: z.number().int().positive("El municipio_id debe ser un ID válido").optional(),
      numero_nucleos: z.number().int().min(0).optional()
    }),
    datos_laborales: z.object({
      turno_id: z.number().int().positive().optional(),
      turno: z.string().trim().optional(),
      turno_nombre: z.string().trim().optional(),
      horario_inicio: z.string().trim().optional(),
      horario_fin: z.string().trim().optional(),
      cargo: z.string().trim().optional(),
      especialidad: z.string().trim().optional()
    }).optional(),
    entrevistador: z.object({
      nombre: z.string().trim().min(1, "El nombre del entrevistador es requerido"),
      fecha_registro: z.string().trim().optional()
    })
  })
});
