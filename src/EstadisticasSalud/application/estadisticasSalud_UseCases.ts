import { IEstadisticasSalud } from "../domain/repositories/IEstadisticasSalud";
import {
  EnfermedadCronicaDTO,
  ToxicomaniaDTO,
  DiscapacidadDTO,
  SaludPreventivaDTO,
  SeguridadSocialDTO,
  AlimentacionDTO,
  ServicioSaludDTO,
  HigieneBucodentalDTO,
  SaludFiltros,
  PiramideVacunaDTO
} from "../domain/entities/estadisticasSalud";

// 1. Personas por enfermedad crónica
export class GetEnfermedadesCronicasUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<EnfermedadCronicaDTO[]> {
    return this.estadisticasSaludRepository.getEnfermedadesCronicas(filtros);
  }
}

// 2. Personas por toxicomanía
export class GetToxicomaniasUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<ToxicomaniaDTO[]> {
    return this.estadisticasSaludRepository.getToxicomanias(filtros);
  }
}

// 3. Discapacidad (resumen + por tipo)
export class GetDiscapacidadUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<DiscapacidadDTO> {
    return this.estadisticasSaludRepository.getDiscapacidad(filtros);
  }
}

// 4. Salud preventiva (resumen + por atención de embarazo)
export class GetSaludPreventivaUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<SaludPreventivaDTO> {
    return this.estadisticasSaludRepository.getSaludPreventiva(filtros);
  }
}

// 5. Seguridad social
export class GetSeguridadSocialUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<SeguridadSocialDTO> {
    return this.estadisticasSaludRepository.getSeguridadSocial(filtros);
  }
}

// 6. Alimentación
export class GetAlimentacionUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<AlimentacionDTO> {
    return this.estadisticasSaludRepository.getAlimentacion(filtros);
  }
}

// 7. Frecuencia de uso de servicios de salud
export class GetServiciosSaludUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<ServicioSaludDTO[]> {
    return this.estadisticasSaludRepository.getServiciosSalud(filtros);
  }
}

// 8. Higiene bucodental
export class GetHigieneBucodentalUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<HigieneBucodentalDTO> {
    return this.estadisticasSaludRepository.getHigieneBucodental(filtros);
  }
}

// 9. Pirámide poblacional por vacuna
export class GetPiramideVacunaUseCase {
  constructor(private estadisticasSaludRepository: IEstadisticasSalud) {}

  async execute(filtros?: SaludFiltros): Promise<PiramideVacunaDTO[]> {
    return this.estadisticasSaludRepository.getPiramideVacuna(filtros);
  }
}

