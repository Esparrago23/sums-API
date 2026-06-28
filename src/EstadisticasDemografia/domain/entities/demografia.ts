// DTOs de estadísticas demográficas (solo lectura, agregaciones SQL)

// 1. Pirámide poblacional (rango de edad x sexo)
export class PiramidePoblacionalDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     PiramidePoblacionalDTO:
     *       type: object
     *       properties:
     *         rango_edad:
     *           type: string
     *           description: Rango de edad (0-4, 5-14, 15-29, 30-44, 45-59, 60+)
     *         sexo:
     *           type: string
     *           description: Sexo de la persona (masculino / femenino)
     *         total:
     *           type: number
     *           description: Total de personas en el rango de edad y sexo
     */
    constructor(
      public rango_edad: string,
      public sexo: string,
      public total: number
    ) {}
}

// 2. Distribución por género
export class DistribucionGeneroDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     DistribucionGeneroDTO:
     *       type: object
     *       properties:
     *         sexo:
     *           type: string
     *           description: Sexo de la persona (masculino / femenino)
     *         total:
     *           type: number
     *           description: Total de personas por sexo
     */
    constructor(
      public sexo: string,
      public total: number
    ) {}
}

// 3. Distribución por escolaridad
export class DistribucionEscolaridadDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     DistribucionEscolaridadDTO:
     *       type: object
     *       properties:
     *         nombre:
     *           type: string
     *           description: Nombre del nivel de escolaridad
     *         total:
     *           type: number
     *           description: Total de personas con ese nivel de escolaridad
     */
    constructor(
      public nombre: string,
      public total: number
    ) {}
}

// 4. Alfabetización (agregado en una sola fila)
export class AlfabetizacionDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     AlfabetizacionDTO:
     *       type: object
     *       properties:
     *         alfabetizados:
     *           type: number
     *           description: Total de personas alfabetizadas
     *         no_alfabetizados:
     *           type: number
     *           description: Total de personas no alfabetizadas
     *         sin_dato:
     *           type: number
     *           description: Total de personas sin dato de alfabetización
     */
    constructor(
      public alfabetizados: number,
      public no_alfabetizados: number,
      public sin_dato: number
    ) {}
}

// 5. Distribución por lengua indígena
export class DistribucionLenguaDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     DistribucionLenguaDTO:
     *       type: object
     *       properties:
     *         lengua:
     *           type: string
     *           description: Nombre de la lengua (Español / Lengua indígena)
     *         total:
     *           type: number
     *           description: Total de personas que hablan esa lengua
     */
    constructor(
      public lengua: string,
      public total: number
    ) {}
}

// 6. Distribución por ingreso salarial
export class DistribucionIngresoDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     DistribucionIngresoDTO:
     *       type: object
     *       properties:
     *         rango:
     *           type: string
     *           description: Rango de ingreso salarial
     *         total:
     *           type: number
     *           description: Total de personas en ese rango de ingreso
     */
    constructor(
      public rango: string,
      public total: number
    ) {}
}

// 7. Distribución por ocupación
export class DistribucionOcupacionDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     DistribucionOcupacionDTO:
     *       type: object
     *       properties:
     *         nombre:
     *           type: string
     *           description: Nombre de la ocupación
     *         total:
     *           type: number
     *           description: Total de personas con esa ocupación
     */
    constructor(
      public nombre: string,
      public total: number
    ) {}
}

// 8. Distribución por estado civil
export class DistribucionEstadoCivilDTO {
    /**
     * @swagger
     * components:
     *   schemas:
     *     DistribucionEstadoCivilDTO:
     *       type: object
     *       properties:
     *         nombre:
     *           type: string
     *           description: Nombre del estado civil
     *         total:
     *           type: number
     *           description: Total de personas con ese estado civil
     */
    constructor(
      public nombre: string,
      public total: number
    ) {}
}

// Filtros opcionales y combinables aplicables a TODOS los endpoints del módulo (§C).
// Si un campo viene undefined, ese filtro no se aplica (comportamiento global).
export interface DemografiaFiltros {
  fecha_inicio?: string;     // YYYY-MM-DD
  fecha_fin?: string;        // YYYY-MM-DD
  unidad_salud_id?: number;  // entero
  localidad?: string;        // match exacto contra direccion.localidad
}
