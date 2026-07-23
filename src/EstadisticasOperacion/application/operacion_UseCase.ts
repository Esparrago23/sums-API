import {
  IestadisticasOperacion,
  PeriodoAgrupacion
} from "../domain/repositories/IestadisticasOperacion";
import {
  ResumenGeneralDTO,
  ProductividadEntrevistadorDTO,
  CedulasSerieDTO,
  CedulasPorEstadoDTO,
  CedulasPorUnidadDTO,
  CedulasPorLocalidadDTO
} from "../domain/entities/estadisticasOperacion";

// Casos de uso de estadísticas globales de operación / productividad.

// 4. Resumen general (totales globales)
export class GetResumenGeneralUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(): Promise<ResumenGeneralDTO> {
    return this.repo.getResumenGeneral();
  }
}

// 5. Productividad por entrevistador (ranking)
export class GetProductividadEntrevistadoresUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(): Promise<ProductividadEntrevistadorDTO[]> {
    return this.repo.getProductividadEntrevistadores();
  }
}

// 6. Serie temporal global de cédulas agrupada por periodo
export class GetCedulasSerieUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(periodo: PeriodoAgrupacion): Promise<CedulasSerieDTO[]> {
    return this.repo.getCedulasSerie(periodo);
  }
}

// 7. Cédulas globales agrupadas por estado
export class GetCedulasPorEstadoUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(): Promise<CedulasPorEstadoDTO[]> {
    return this.repo.getCedulasPorEstado();
  }
}

// 8. Cédulas por unidad de salud
export class GetCedulasPorUnidadUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(): Promise<CedulasPorUnidadDTO[]> {
    return this.repo.getCedulasPorUnidad();
  }
}

// 9. Cédulas por localidad
export class GetCedulasPorLocalidadUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(): Promise<CedulasPorLocalidadDTO[]> {
    return this.repo.getCedulasPorLocalidad();
  }
}
