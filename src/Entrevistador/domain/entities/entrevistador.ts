export class Entrevistador {
  constructor(
    public id: number,
    public nombre: string,
    public unidad_salud_id: number,
    public datos_laborales_id: number | null,
    public fecha_registro: Date | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Entrevistador:
 *       type: object
 *       required:
 *         - nombre
 *         - unidad_salud_id
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         nombre:
 *           type: string
 *         unidad_salud_id:
 *           type: integer
 *         datos_laborales_id:
 *           type: integer
 *           nullable: true
 *         fecha_registro:
 *           type: string
 *           format: date
 *           nullable: true
 */
