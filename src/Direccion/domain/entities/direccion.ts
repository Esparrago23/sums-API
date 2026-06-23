/**
 * @swagger
 * components:
 *   schemas:
 *     Direccion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         calle:
 *           type: string
 *           nullable: true
 *         numero_exterior:
 *           type: string
 *           nullable: true
 *         numero_interior:
 *           type: string
 *           nullable: true
 *         colonia:
 *           type: string
 *           nullable: true
 *         codigo_postal:
 *           type: string
 *           nullable: true
 *         localidad:
 *           type: string
 *           nullable: true
 *         manzana:
 *           type: string
 *           nullable: true
 *         vivienda_referencia:
 *           type: string
 *           nullable: true
 *         asentamiento_id:
 *           type: integer
 *           nullable: true
 */

export class Direccion {
  constructor(
    public id: number,
    public calle: string | null,
    public numero_exterior: string | null,
    public numero_interior: string | null,
    public colonia: string | null,
    public codigo_postal: string | null,
    public localidad: string | null,
    public manzana: string | null,
    public vivienda_referencia: string | null,
    public asentamiento_id: number | null
  ) {}
}
