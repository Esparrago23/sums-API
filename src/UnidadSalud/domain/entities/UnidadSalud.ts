export class UnidadSalud {
  constructor(
    public id: number,
    public clues: string,
    public nombre: string,
    public distrito: string | null,
    public municipio_id: number | null,
    public numero_nucleos: number | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UnidadSalud:
 *       type: object
 *       required:
 *         - clues
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         clues:
 *           type: string
 *           minLength: 11
 *           maxLength: 11
 *         nombre:
 *           type: string
 *         distrito:
 *           type: string
 *           nullable: true
 *         municipio_id:
 *           type: integer
 *           nullable: true
 *         numero_nucleos:
 *           type: integer
 *           nullable: true
 */
