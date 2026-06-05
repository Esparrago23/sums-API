export class CatalogoItem {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion?: string | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CatalogoItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *           nullable: true
 */
