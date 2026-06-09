export type SexoPersona = 'masculino' | 'femenino';

export class Persona {
  constructor(
    public id: number,
    public primer_nombre: string,
    public segundo_nombre: string | null,
    public apellido_paterno: string,
    public apellido_materno: string | null,
    public fecha_nacimiento: Date,
    public sexo: SexoPersona,
    public alfabetizacion: boolean | null,
    public estado_civil_id: number | null,
    public lengua_id: number | null,
    public escolaridad_id: number | null,
    public ocupacion_id: number | null,
    public ingreso_salarial_id: number | null,
    public fecha_registro: Date | null,
    public edad?: number
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       required:
 *         - fecha_nacimiento
 *         - sexo
 *         - primer_nombre
 *         - apellido_paterno
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         primer_nombre:
 *           type: string
 *         segundo_nombre:
 *           type: string
 *           nullable: true
 *         apellido_paterno:
 *           type: string
 *         apellido_materno:
 *           type: string
 *           nullable: true
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *         edad:
 *           type: integer
 *           readOnly: true
 *           description: Edad calculada desde fecha_nacimiento; no se persiste.
 *         sexo:
 *           type: string
 *           enum: [masculino, femenino]
 *         alfabetizacion:
 *           type: boolean
 *           nullable: true
 *         estado_civil_id:
 *           type: integer
 *           nullable: true
 *         lengua_id:
 *           type: integer
 *           nullable: true
 *           description: Se guarda en persona_lengua.
 *         escolaridad_id:
 *           type: integer
 *           nullable: true
 *           description: Se guarda en persona_escolaridad.
 *         ocupacion_id:
 *           type: integer
 *           nullable: true
 *           description: Se guarda en persona_ocupacion.
 *         ingreso_salarial_id:
 *           type: integer
 *           nullable: true
 *           description: Se guarda en persona_ingreso; reemplaza ingreso libre.
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
