import {
  MisCedulasResumenDTO,
  MisCedulasSerieDTO,
  CedulasPorEstadoDTO,
  ResumenGeneralDTO,
  ProductividadEntrevistadorDTO,
  CedulasSerieDTO,
  CedulasPorUnidadDTO,
  CedulasPorLocalidadDTO,
  CedulasPorColoniaDTO,
  NucleosTamanoDTO,
  FiltrosEstadisticas
} from "../entities/estadisticasOperacion";

// Periodo válido para agrupar la serie global de cédulas
export type PeriodoAgrupacion = "day" | "week" | "month";

// Filtros §C que pueden afectar SOLO el rango de fechas (endpoints personales).
export interface FiltrosFecha {
  fecha_inicio?: string; // YYYY-MM-DD
  fecha_fin?: string;    // YYYY-MM-DD
}

export interface IestadisticasOperacion {
  // 1. Resumen de cédulas del entrevistador (solo filtro de fechas)
  getMisCedulasResumen(entrevistadorId: number, filtros?: FiltrosFecha): Promise<MisCedulasResumenDTO>;

  // 2. Serie temporal de cédulas del entrevistador (últimos N días, solo filtro de fechas)
  getMisCedulasSerie(entrevistadorId: number, dias: number, filtros?: FiltrosFecha): Promise<MisCedulasSerieDTO[]>;

  // 3. Cédulas del entrevistador agrupadas por estado (solo filtro de fechas)
  getMisCedulasPorEstado(entrevistadorId: number, filtros?: FiltrosFecha): Promise<CedulasPorEstadoDTO[]>;

  // 4. Resumen general (totales globales, con filtros §C)
  getResumenGeneral(filtros?: FiltrosEstadisticas): Promise<ResumenGeneralDTO>;

  // 5. Productividad por entrevistador (ranking, con filtros §C)
  getProductividadEntrevistadores(filtros?: FiltrosEstadisticas): Promise<ProductividadEntrevistadorDTO[]>;

  // 6. Serie temporal global de cédulas agrupada por periodo (con filtros §C)
  getCedulasSerie(periodo: PeriodoAgrupacion, filtros?: FiltrosEstadisticas): Promise<CedulasSerieDTO[]>;

  // 7. Cédulas globales agrupadas por estado (con filtros §C)
  getCedulasPorEstado(filtros?: FiltrosEstadisticas): Promise<CedulasPorEstadoDTO[]>;

  // 8. Cédulas por unidad de salud (con filtros §C)
  getCedulasPorUnidad(filtros?: FiltrosEstadisticas): Promise<CedulasPorUnidadDTO[]>;

  // 9. Cédulas por localidad (con filtros §C)
  getCedulasPorLocalidad(filtros?: FiltrosEstadisticas): Promise<CedulasPorLocalidadDTO[]>;

  // 10. Cédulas por colonia (con filtros §C)
  getCedulasPorColonia(filtros?: FiltrosEstadisticas): Promise<CedulasPorColoniaDTO[]>;

  // 11. Histograma de tamaño de núcleos familiares (con filtros §C)
  getNucleosTamano(filtros?: FiltrosEstadisticas): Promise<NucleosTamanoDTO[]>;

  // Auxiliar: resuelve el entrevistador asociado a un usuario (del JWT)
  getEntrevistadorIdDeUsuario(idUsuario: number): Promise<number | null>;
}
