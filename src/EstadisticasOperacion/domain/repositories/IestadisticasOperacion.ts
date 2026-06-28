import {
  MisCedulasResumenDTO,
  MisCedulasSerieDTO,
  CedulasPorEstadoDTO,
  ResumenGeneralDTO,
  ProductividadEntrevistadorDTO,
  CedulasSerieDTO,
  CedulasPorUnidadDTO,
  CedulasPorLocalidadDTO
} from "../entities/estadisticasOperacion";

// Periodo válido para agrupar la serie global de cédulas
export type PeriodoAgrupacion = "day" | "week" | "month";

export interface IestadisticasOperacion {
  // 1. Resumen de cédulas del entrevistador
  getMisCedulasResumen(entrevistadorId: number): Promise<MisCedulasResumenDTO>;

  // 2. Serie temporal de cédulas del entrevistador (últimos N días)
  getMisCedulasSerie(entrevistadorId: number, dias: number): Promise<MisCedulasSerieDTO[]>;

  // 3. Cédulas del entrevistador agrupadas por estado
  getMisCedulasPorEstado(entrevistadorId: number): Promise<CedulasPorEstadoDTO[]>;

  // 4. Resumen general (totales globales)
  getResumenGeneral(): Promise<ResumenGeneralDTO>;

  // 5. Productividad por entrevistador (ranking)
  getProductividadEntrevistadores(): Promise<ProductividadEntrevistadorDTO[]>;

  // 6. Serie temporal global de cédulas agrupada por periodo
  getCedulasSerie(periodo: PeriodoAgrupacion): Promise<CedulasSerieDTO[]>;

  // 7. Cédulas globales agrupadas por estado
  getCedulasPorEstado(): Promise<CedulasPorEstadoDTO[]>;

  // 8. Cédulas por unidad de salud
  getCedulasPorUnidad(): Promise<CedulasPorUnidadDTO[]>;

  // 9. Cédulas por localidad
  getCedulasPorLocalidad(): Promise<CedulasPorLocalidadDTO[]>;

  // Auxiliar: resuelve el entrevistador asociado a un usuario (del JWT)
  getEntrevistadorIdDeUsuario(idUsuario: number): Promise<number | null>;
}
