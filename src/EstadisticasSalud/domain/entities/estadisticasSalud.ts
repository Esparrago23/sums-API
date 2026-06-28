// DTOs de Estadísticas de Salud / Epidemiología (solo lectura)

// 1. Personas por enfermedad crónica
export class EnfermedadCronicaDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     EnfermedadCronicaDTO:
   *       type: object
   *       properties:
   *         nombre:
   *           type: string
   *           description: Nombre de la enfermedad crónica
   *         personas:
   *           type: number
   *           description: Número de personas (distintas) con la enfermedad
   */
  constructor(
    public nombre: string,
    public personas: number
  ) {}
}

// 2. Personas por toxicomanía
export class ToxicomaniaDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     ToxicomaniaDTO:
   *       type: object
   *       properties:
   *         nombre:
   *           type: string
   *           description: Nombre de la toxicomanía
   *         personas:
   *           type: number
   *           description: Número de personas (distintas) con la toxicomanía
   */
  constructor(
    public nombre: string,
    public personas: number
  ) {}
}

// 3. Discapacidad - resumen
export class DiscapacidadResumenDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     DiscapacidadResumenDTO:
   *       type: object
   *       properties:
   *         con_discapacidad:
   *           type: number
   *           description: Personas que presentan discapacidad
   *         sin_discapacidad:
   *           type: number
   *           description: Personas que no presentan discapacidad
   */
  constructor(
    public con_discapacidad: number,
    public sin_discapacidad: number
  ) {}
}

// 3. Discapacidad - por tipo
export class DiscapacidadPorTipoDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     DiscapacidadPorTipoDTO:
   *       type: object
   *       properties:
   *         tipo:
   *           type: string
   *           description: Tipo de discapacidad
   *         total:
   *           type: number
   *           description: Total de personas con ese tipo de discapacidad
   */
  constructor(
    public tipo: string,
    public total: number
  ) {}
}

// 3. Discapacidad - respuesta combinada
export class DiscapacidadDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     DiscapacidadDTO:
   *       type: object
   *       properties:
   *         resumen:
   *           $ref: '#/components/schemas/DiscapacidadResumenDTO'
   *         por_tipo:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/DiscapacidadPorTipoDTO'
   */
  constructor(
    public resumen: DiscapacidadResumenDTO,
    public por_tipo: DiscapacidadPorTipoDTO[]
  ) {}
}

// 4. Salud preventiva - resumen
export class SaludPreventivaResumenDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     SaludPreventivaResumenDTO:
   *       type: object
   *       properties:
   *         tamizaje_cervico_uterino:
   *           type: number
   *           description: Personas con tamizaje cérvico uterino
   *         tamizaje_cancer_mama:
   *           type: number
   *           description: Personas con tamizaje de cáncer de mama
   *         con_atencion_embarazo:
   *           type: number
   *           description: Registros con atención de embarazo
   *         total_registros:
   *           type: number
   *           description: Total de registros de salud preventiva
   */
  constructor(
    public tamizaje_cervico_uterino: number,
    public tamizaje_cancer_mama: number,
    public con_atencion_embarazo: number,
    public total_registros: number
  ) {}
}

// 4. Salud preventiva - por atención de embarazo
export class AtencionEmbarazoDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     AtencionEmbarazoDTO:
   *       type: object
   *       properties:
   *         nombre:
   *           type: string
   *           description: Tipo de atención de embarazo
   *         total:
   *           type: number
   *           description: Total de registros con ese tipo de atención
   */
  constructor(
    public nombre: string,
    public total: number
  ) {}
}

// 4. Salud preventiva - respuesta combinada
export class SaludPreventivaDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     SaludPreventivaDTO:
   *       type: object
   *       properties:
   *         resumen:
   *           $ref: '#/components/schemas/SaludPreventivaResumenDTO'
   *         por_atencion_embarazo:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/AtencionEmbarazoDTO'
   */
  constructor(
    public resumen: SaludPreventivaResumenDTO,
    public por_atencion_embarazo: AtencionEmbarazoDTO[]
  ) {}
}

// 5. Seguridad social
export class SeguridadSocialDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     SeguridadSocialDTO:
   *       type: object
   *       properties:
   *         con_seguridad:
   *           type: number
   *           description: Personas con seguridad social
   *         sin_seguridad:
   *           type: number
   *           description: Personas sin seguridad social
   */
  constructor(
    public con_seguridad: number,
    public sin_seguridad: number
  ) {}
}

// 6. Alimentación
export class AlimentacionDTO {
  /**
   * @swagger
   * components:
   *   schemas:
   *     AlimentacionDTO:
   *       type: object
   *       properties:
   *         promedio_dias_proteina:
   *           type: number
   *           description: Promedio de días con consumo de proteína
   *         promedio_dias_frutas_verduras:
   *           type: number
   *           description: Promedio de días con consumo de frutas y verduras
   *         promedio_dias_cereales:
   *           type: number
   *           description: Promedio de días con consumo de cereales
   *         total_registros:
   *           type: number
   *           description: Total de registros de alimentación
   */
  constructor(
    public promedio_dias_proteina: number,
    public promedio_dias_frutas_verduras: number,
    public promedio_dias_cereales: number,
    public total_registros: number
  ) {}
}
