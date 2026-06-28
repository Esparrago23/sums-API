import { IEstadisticasSalud } from "../domain/repositories/IEstadisticasSalud";
import {
  EnfermedadCronicaDTO,
  ToxicomaniaDTO,
  DiscapacidadDTO,
  SaludPreventivaDTO,
  SeguridadSocialDTO,
  AlimentacionDTO
} from "../domain/entities/estadisticasSalud";

// 1. Personas por enfermedad crónica
export class GetEnfermedadesCronicasUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(): Promise<EnfermedadCronicaDTO[]> {
    return this.estadisticasSaludRepository.getEnfermedadesCronicas();
  }
}

// 2. Personas por toxicomanía
export class GetToxicomaniasUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(): Promise<ToxicomaniaDTO[]> {
    return this.estadisticasSaludRepository.getToxicomanias();
  }
}

// 3. Discapacidad (resumen + por tipo)
export class GetDiscapacidadUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(): Promise<DiscapacidadDTO> {
    return this.estadisticasSaludRepository.getDiscapacidad();
  }
}

// 4. Salud preventiva (resumen + por atención de embarazo)
export class GetSaludPreventivaUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(): Promise<SaludPreventivaDTO> {
    return this.estadisticasSaludRepository.getSaludPreventiva();
  }
}

// 5. Seguridad social
export class GetSeguridadSocialUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(): Promise<SeguridadSocialDTO> {
    return this.estadisticasSaludRepository.getSeguridadSocial();
  }
}

// 6. Alimentación
export class GetAlimentacionUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(): Promise<AlimentacionDTO> {
    return this.estadisticasSaludRepository.getAlimentacion();
  }
}
