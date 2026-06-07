/**
 * @swagger
 * components:
 *   schemas:
 *     Alimentacion:
 *       deprecated: true
 *       type: object
 *       properties:
 *         carne_pescado_pollo:
 *           type: number
 *           minimum: 0
 *           maximum: 7
 *         frutas_verduras:
 *           type: number
 *           minimum: 0
 *           maximum: 7
 *         cereales_granos_leguminosas:
 *           type: number
 *           minimum: 0
 *           maximum: 7
 */
export class Alimentacion {
  constructor(
    public carne_pescado_pollo: number,
    public frutas_verduras: number,
    public cereales_granos_leguminosas: number
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Toxicomanias:
 *       deprecated: true
 *       type: object
 *       properties:
 *         alcoholismo:
 *           type: boolean
 *         tabaquismo:
 *           type: boolean
 *         otras_sustancias:
 *           type: string
 */
export class Toxicomanias {
  constructor(
    public alcoholismo: boolean,
    public tabaquismo: boolean,
    public otras_sustancias: string
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EnfermedadesCronicas:
 *       deprecated: true
 *       type: object
 *       properties:
 *         obesidad:
 *           type: boolean
 *         hipertension:
 *           type: boolean
 *         diabetes_mellitus_tipo_2:
 *           type: boolean
 *         tosedor_cronico:
 *           type: boolean
 *         otras_enfermedades:
 *           type: string
 */
export class EnfermedadesCronicas {
  constructor(
    public obesidad: boolean,
    public hipertension: boolean,
    public diabetes_mellitus_tipo_2: boolean,
    public tosedor_cronico: boolean,
    public otras_enfermedades: string
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EstiloVida:
 *       deprecated: true
 *       type: object
 *       description: Ruta historica. Use PersonaAlimentacion, PersonaHigiene, PersonaToxicomania, PersonaEnfermedadCronica, PersonaSaludPreventiva y PersonaServicioSalud.
 *       properties:
 *         id:
 *           type: integer
 *         persona_id:
 *           type: integer
 *         toxicomanias:
 *           $ref: '#/components/schemas/Toxicomanias'
 *         enfermedades_cronicas:
 *           $ref: '#/components/schemas/EnfermedadesCronicas'
 *         alimentacion:
 *           $ref: '#/components/schemas/Alimentacion'
 *         higiene_personal:
 *           type: boolean
 */
export class EstiloVida {
  constructor(
    public id: number,
    public persona_id: number,
    public toxicomanias: Toxicomanias,
    public enfermedades_cronicas: EnfermedadesCronicas,
    public alimentacion: Alimentacion,
    public higiene_personal: boolean
  ) {}
}
