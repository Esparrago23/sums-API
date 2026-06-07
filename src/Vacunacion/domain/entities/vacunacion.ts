export class EsquemaVacunacion {
  constructor(
    public id: number,
    public persona_id: number,
    public unidad_salud_id: number | null,
    public fecha_registro: Date | null
  ) {}
}

export class Inmunizacion {
  constructor(
    public id: number,
    public esquema_vacunacion_id: number,
    public cedula_id: number | null,
    public vacuna_id: number,
    public dosis_id: number | null,
    public fecha_aplicacion: Date | null
  ) {}
}

export class Vacunacion extends Inmunizacion {
  public persona_id?: number;
  public unidad_salud_id?: number | null;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EsquemaVacunacion:
 *       type: object
 *       required:
 *         - persona_id
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         unidad_salud_id:
 *           type: integer
 *           nullable: true
 *         fecha_registro:
 *           type: string
 *           format: date
 *           nullable: true
 *     Inmunizacion:
 *       type: object
 *       required:
 *         - esquema_vacunacion_id
 *         - vacuna_id
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         esquema_vacunacion_id:
 *           type: integer
 *         cedula_id:
 *           type: integer
 *           nullable: true
 *         vacuna_id:
 *           type: integer
 *         dosis_id:
 *           type: integer
 *           nullable: true
 *         fecha_aplicacion:
 *           type: string
 *           format: date
 *           nullable: true
 *     Vacunacion:
 *       allOf:
 *         - $ref: '#/components/schemas/Inmunizacion'
 */
