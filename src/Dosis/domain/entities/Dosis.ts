export class Dosis {
  constructor(
    public id: number,
    public nombre: string
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Dosis:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         nombre:
 *           type: string
 *           enum: [unica, 1era, 2da, 3era, refuerzo]
 */
