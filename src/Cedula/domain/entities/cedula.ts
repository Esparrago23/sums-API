export type EstadoCedula = 'borrador' | 'sincronizada' | 'validada' | 'cerrada';

export class Cedula {
  constructor(
    public id: number,
    public unidad_salud_id: number,
    public entrevistador_id: number,
    public levantamiento_id: number | null,
    public nucleo_familiar_id: number,
    public fecha_registro: Date,
    public estado: EstadoCedula,
    public observaciones: string | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Cedula:
 *       type: object
 *       required:
 *         - unidad_salud_id
 *         - entrevistador_id
 *         - nucleo_familiar_id
 *         - fecha_registro
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         unidad_salud_id:
 *           type: integer
 *         entrevistador_id:
 *           type: integer
 *         levantamiento_id:
 *           type: integer
 *           nullable: true
 *         nucleo_familiar_id:
 *           type: integer
 *         fecha_registro:
 *           type: string
 *           format: date
 *         estado:
 *           type: string
 *           enum: [borrador, sincronizada, validada, cerrada]
 *         observaciones:
 *           type: string
 *           nullable: true
 */
