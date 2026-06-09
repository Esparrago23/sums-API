export class PersonaAlimentacion {
  constructor(
    public id: number,
    public persona_id: number,
    public alimentacion_id: number,
    public frecuencia_dias: number,
    public fecha_registro: Date | null
  ) {}
}

export class PersonaHigiene {
  constructor(
    public id: number,
    public persona_id: number,
    public higiene_bano_bucodental_diaria: boolean,
    public fecha_registro: Date | null
  ) {}
}

export class PersonaToxicomania {
  constructor(
    public id: number,
    public persona_id: number,
    public toxicomania_id: number,
    public otra_sustancia: string | null,
    public fecha_inicio: Date | null,
    public fecha_fin: Date | null
  ) {}
}

export class PersonaEnfermedadCronica {
  constructor(
    public id: number,
    public persona_id: number,
    public enfermedad_cronica_id: number,
    public fecha_diagnostico: Date | null,
    public observaciones: string | null
  ) {}
}

export class PersonaSaludPreventiva {
  constructor(
    public id: number,
    public persona_id: number,
    public atencion_embarazo_id: number | null,
    public tamizaje_cervico_uterino: boolean | null,
    public fecha_tamizaje_cervico_uterino: Date | null,
    public tamizaje_cancer_mama: boolean | null,
    public fecha_tamizaje_cancer_mama: Date | null,
    public fecha_registro: Date | null
  ) {}
}

export class PersonaServicioSalud {
  constructor(
    public id: number,
    public persona_id: number,
    public frecuencia_servicio_salud_id: number | null,
    public motivo_uso: string | null,
    public fecha_registro: Date | null
  ) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PersonaAlimentacion:
 *       type: object
 *       required: [persona_id, alimentacion_id, frecuencia_dias]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         alimentacion_id:
 *           type: integer
 *         frecuencia_dias:
 *           type: integer
 *           minimum: 0
 *           maximum: 7
 *         fecha_registro:
 *           type: string
 *           format: date
 *           nullable: true
 *     PersonaHigiene:
 *       type: object
 *       required: [persona_id, higiene_bano_bucodental_diaria]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         higiene_bano_bucodental_diaria:
 *           type: boolean
 *         fecha_registro:
 *           type: string
 *           format: date
 *           nullable: true
 *     PersonaToxicomania:
 *       type: object
 *       required: [persona_id, toxicomania_id]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         toxicomania_id:
 *           type: integer
 *         otra_sustancia:
 *           type: string
 *           nullable: true
 *         fecha_inicio:
 *           type: string
 *           format: date
 *           nullable: true
 *         fecha_fin:
 *           type: string
 *           format: date
 *           nullable: true
 *     PersonaEnfermedadCronica:
 *       type: object
 *       required: [persona_id, enfermedad_cronica_id]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         enfermedad_cronica_id:
 *           type: integer
 *         fecha_diagnostico:
 *           type: string
 *           format: date
 *           nullable: true
 *         observaciones:
 *           type: string
 *           nullable: true
 *     PersonaSaludPreventiva:
 *       type: object
 *       required: [persona_id]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         atencion_embarazo_id:
 *           type: integer
 *           nullable: true
 *         tamizaje_cervico_uterino:
 *           type: boolean
 *           nullable: true
 *         fecha_tamizaje_cervico_uterino:
 *           type: string
 *           format: date
 *           nullable: true
 *         tamizaje_cancer_mama:
 *           type: boolean
 *           nullable: true
 *         fecha_tamizaje_cancer_mama:
 *           type: string
 *           format: date
 *           nullable: true
 *         fecha_registro:
 *           type: string
 *           format: date
 *           nullable: true
 *     PersonaServicioSalud:
 *       type: object
 *       required: [persona_id]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         frecuencia_servicio_salud_id:
 *           type: integer
 *           nullable: true
 *         motivo_uso:
 *           type: string
 *           nullable: true
 *         fecha_registro:
 *           type: string
 *           format: date
 *           nullable: true
 */
