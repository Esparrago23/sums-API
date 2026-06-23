/**
 * @swagger
 * components:
 *   schemas:
 *     DatosLaborales:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         turno_id:
 *           type: integer
 *           nullable: true
 *         horario_inicio:
 *           type: string
 *           nullable: true
 *         horario_fin:
 *           type: string
 *           nullable: true
 *         cargo:
 *           type: string
 *           nullable: true
 *         especialidad:
 *           type: string
 *           nullable: true
 */
export class DatosLaborales {
  constructor(
    public id: number,
    public turno_id: number | null,
    public horario_inicio: string | null,
    public horario_fin: string | null,
    public cargo: string | null,
    public especialidad: string | null
  ) {}
}
