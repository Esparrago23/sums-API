import { IestadisticasDemografia } from "../domain/repositories/IestadisticasDemografia";
import {
  PiramidePoblacionalDTO,
  DistribucionGeneroDTO,
  DistribucionEscolaridadDTO,
  AlfabetizacionDTO,
  DistribucionLenguaDTO
} from "../domain/entities/demografia";

// 1. Pirámide poblacional (rango de edad x sexo)
export class GetPiramidePoblacionalUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(): Promise<PiramidePoblacionalDTO[]> {
    return this.estadisticasDemografiaRepository.getPiramidePoblacional();
  }
}

// 2. Distribución por género
export class GetDistribucionGeneroUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(): Promise<DistribucionGeneroDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionGenero();
  }
}

// 3. Distribución por escolaridad
export class GetDistribucionEscolaridadUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(): Promise<DistribucionEscolaridadDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionEscolaridad();
  }
}

// 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
export class GetAlfabetizacionUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(): Promise<AlfabetizacionDTO> {
    return this.estadisticasDemografiaRepository.getAlfabetizacion();
  }
}

// 5. Distribución por lengua indígena
export class GetDistribucionLenguaUseCase {
  constructor(private estadisticasDemografiaRepository: IestadisticasDemografia) {}

  async execute(): Promise<DistribucionLenguaDTO[]> {
    return this.estadisticasDemografiaRepository.getDistribucionLengua();
  }
}
