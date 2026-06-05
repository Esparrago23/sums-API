export class Familia {
  constructor(
    public id: number,
    public jefe_persona_id: number | null,
    public fecha_registro: Date | null,
    public fecha_cierre: Date | null,
    public comentarios: string | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Familia:
 *       deprecated: true
 *       allOf:
 *         - $ref: '#/components/schemas/NucleoFamiliar'
 *       description: Alias historico de NucleoFamiliar. Use /nucleos-familiares.
 */
