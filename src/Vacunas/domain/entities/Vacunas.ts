export class Vacunas {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Vacunas:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *           nullable: true
 */
