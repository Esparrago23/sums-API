// DTOs de estadísticas de vivienda / determinantes sociales

// 1. Servicios básicos de la vivienda
export class ServiciosViviendaDTO {
  constructor(
    public total_viviendas: number,
    public con_agua: number,
    public sin_agua: number,
    public con_luz: number,
    public sin_luz: number,
    public con_alcantarillado: number,
    public sin_alcantarillado: number,
    public con_fosa_septica: number
  ) {}
}

// 2. Hacinamiento (habitantes / cuartos > 2.5)
export class HacinamientoDTO {
  constructor(
    public viviendas_hacinadas: number,
    public viviendas_no_hacinadas: number,
    public sin_dato: number,
    public promedio_personas_por_cuarto: number
  ) {}
}

// 3. Materiales y condiciones de riesgo
export class MaterialesRiesgoDTO {
  constructor(
    public piso_tierra: number,
    public cocina_con_lena: number,
    public cocina_en_dormitorio: number,
    public total_viviendas: number
  ) {}
}

// 4a. Conteo de viviendas por tipo de animal
export class AnimalPorTipoDTO {
  constructor(
    public nombre: string,
    public total: number
  ) {}
}

// 4b. Resumen de mascotas en la vivienda
export class MascotasDTO {
  constructor(
    public con_perros_gatos_dentro: number,
    public mascotas_sin_vacunar: number,
    public mascotas_esterilizadas: number
  ) {}
}

// 4. Respuesta del endpoint de animales
export class AnimalesDTO {
  constructor(
    public por_animal: AnimalPorTipoDTO[],
    public mascotas: MascotasDTO
  ) {}
}

// Filtros opcionales y combinables aplicables a TODOS los endpoints del módulo (§C).
// Si un campo viene undefined, ese filtro no se aplica (comportamiento actual).
export interface ViviendaFiltros {
  fecha_inicio?: string;     // YYYY-MM-DD
  fecha_fin?: string;        // YYYY-MM-DD
  unidad_salud_id?: number;  // entero
  localidad?: string;        // match exacto contra direccion.localidad
}
