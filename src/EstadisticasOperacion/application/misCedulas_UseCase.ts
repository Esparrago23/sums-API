import { IestadisticasOperacion } from "../domain/repositories/IestadisticasOperacion";
import {
  MisCedulasResumenDTO,
  MisCedulasSerieDTO,
  CedulasPorEstadoDTO
} from "../domain/entities/estadisticasOperacion";

// Casos de uso relacionados con las cédulas del entrevistador autenticado (derivado del JWT).

// 1. Resumen de cédulas del entrevistador
export class GetMisCedulasResumenUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(idUsuario: number): Promise<MisCedulasResumenDTO> {
    const entrevistadorId = await this.repo.getEntrevistadorIdDeUsuario(idUsuario);

    // Si el usuario no tiene entrevistador asociado devolvemos un resumen vacío.
    if (entrevistadorId === null) {
      return {
        entrevistador_id: null,
        alta: null,
        hoy: 0,
        semana: 0,
        mes: 0,
        total: 0,
        primera_cedula: null,
        ultima_cedula: null
      };
    }

    return this.repo.getMisCedulasResumen(entrevistadorId);
  }
}

// 2. Serie temporal de cédulas del entrevistador (últimos N días)
export class GetMisCedulasSerieUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(idUsuario: number, dias: number): Promise<MisCedulasSerieDTO[]> {
    const entrevistadorId = await this.repo.getEntrevistadorIdDeUsuario(idUsuario);
    if (entrevistadorId === null) {
      return [];
    }
    return this.repo.getMisCedulasSerie(entrevistadorId, dias);
  }
}

// 3. Cédulas del entrevistador agrupadas por estado
export class GetMisCedulasPorEstadoUseCase {
  constructor(private repo: IestadisticasOperacion) {}

  async execute(idUsuario: number): Promise<CedulasPorEstadoDTO[]> {
    const entrevistadorId = await this.repo.getEntrevistadorIdDeUsuario(idUsuario);
    if (entrevistadorId === null) {
      return [];
    }
    return this.repo.getMisCedulasPorEstado(entrevistadorId);
  }
}
