export class PersonaAlimentacion {
  constructor(
    public id: number,
    public persona_id: number,
    public dias_proteina: number,
    public dias_frutas_verduras: number,
    public dias_cereales: number,
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

export class PersonaSeguridadSocial {
  constructor(
    public id: number,
    public persona_id: number,
    public cuenta_seguridad_social: boolean,
    public fecha_registro: Date | null
  ) {}
}

export class PersonaDiscapacidad {
  constructor(
    public id: number,
    public persona_id: number,
    public presenta_discapacidad: boolean,
    public tipo_discapacidad: string | null
  ) {}
}

export class PersonaToxicomania {
  constructor(
    public id: number,
    public persona_id: number,
    public toxicomania_id: number,
    public otra_sustancia: string | null
  ) {}
}

export class PersonaEnfermedadCronica {
  constructor(
    public id: number,
    public persona_id: number,
    public enfermedad_cronica_id: number
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
 *       required: [persona_id, dias_proteina, dias_frutas_verduras, dias_cereales]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         dias_proteina:
 *           type: integer
 *           minimum: 0
 *           maximum: 7
 *         dias_frutas_verduras:
 *           type: integer
 *           minimum: 0
 *           maximum: 7
 *         dias_cereales:
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
 *     PersonaSeguridadSocial:
 *       type: object
 *       required: [persona_id, cuenta_seguridad_social]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         cuenta_seguridad_social:
 *           type: boolean
 *         fecha_registro:
 *           type: string
 *           format: date
 *           nullable: true
 *     PersonaDiscapacidad:
 *       type: object
 *       required: [persona_id, presenta_discapacidad]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         persona_id:
 *           type: integer
 *         presenta_discapacidad:
 *           type: boolean
 *         tipo_discapacidad:
 *           type: string
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
