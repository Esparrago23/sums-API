import { IestadisticasDemografia } from "../domain/repositories/IestadisticasDemografia";
import {
  PiramidePoblacionalDTO,
  DistribucionGeneroDTO,
  DistribucionEscolaridadDTO,
  AlfabetizacionDTO,
  DistribucionLenguaDTO,
  DistribucionIngresoDTO,
  DistribucionOcupacionDTO,
  DistribucionEstadoCivilDTO,
  DemografiaFiltros
} from "../domain/entities/demografia";

// 1. Pirámide poblacional (rango de edad x sexo)
export class GetPiramidePoblacionalUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<PiramidePoblacionalDTO[]> {
    return this.estadisticasDemografiaRepository.getPiramidePoblacional(filtros);
  }
}

// 2. Distribución por género
export class GetDistribucionGeneroUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<DistribucionGeneroDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionGenero(filtros);
  }
}

// 3. Distribución por escolaridad
export class GetDistribucionEscolaridadUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<DistribucionEscolaridadDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionEscolaridad(filtros);
  }
}

// 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
export class GetAlfabetizacionUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<AlfabetizacionDTO> {
    return this.estadisticasDemografiaRepository.getAlfabetizacion(filtros);
  }
}

// 5. Distribución por lengua indígena
export class GetDistribucionLenguaUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<DistribucionLenguaDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionLengua(filtros);
  }
}

// 6. Distribución por ingreso salarial
export class GetDistribucionIngresoUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<DistribucionIngresoDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionIngreso(filtros);
  }
}

// 7. Distribución por ocupación
export class GetDistribucionOcupacionUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<DistribucionOcupacionDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionOcupacion(filtros);
  }
}

// 8. Distribución por estado civil
export class GetDistribucionEstadoCivilUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(filtros?: DemografiaFiltros): Promise<DistribucionEstadoCivilDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionEstadoCivil(filtros);
  }
}
