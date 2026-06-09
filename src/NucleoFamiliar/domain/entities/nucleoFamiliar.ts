export class NucleoFamiliar {
  constructor(
    public id: number,
    public jefe_persona_id: number | null,
    public fecha_registro: Date | null,
    public fecha_cierre: Date | null,
    public comentarios: string | null
  ) {}
}

export class NucleoPersona {
  constructor(
    public id: number,
    public nucleo_familiar_id: number,
    public persona_id: number,
    public parentesco_id: number | null,
    public fecha_registro: Date | null,
    public fecha_salida: Date | null,
    public comentarios: string | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     NucleoFamiliar:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         jefe_persona_id:
 *           type: integer
 *           nullable: true
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         fecha_cierre:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         comentarios:
 *           type: string
 *           nullable: true
 *     NucleoPersona:
 *       type: object
 *       required:
 *         - nucleo_familiar_id
 *         - persona_id
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         nucleo_familiar_id:
 *           type: integer
 *         persona_id:
 *           type: integer
 *         parentesco_id:
 *           type: integer
 *           nullable: true
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         fecha_salida:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         comentarios:
 *           type: string
 *           nullable: true
 */
