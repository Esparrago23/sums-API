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
} from "../entities/estadisticasSalud";

export interface IEstadisticasSalud {
  // 1. Personas por enfermedad crónica
  getEnfermedadesCronicas(filtros?: SaludFiltros): Promise<EnfermedadCronicaDTO[]>;

  // 2. Personas por toxicomanía
  getToxicomanias(filtros?: SaludFiltros): Promise<ToxicomaniaDTO[]>;

  // 3. Discapacidad (resumen + por tipo)
  getDiscapacidad(filtros?: SaludFiltros): Promise<DiscapacidadDTO>;

  // 4. Salud preventiva (resumen + por atención de embarazo)
  getSaludPreventiva(filtros?: SaludFiltros): Promise<SaludPreventivaDTO>;

  // 5. Seguridad social
  getSeguridadSocial(filtros?: SaludFiltros): Promise<SeguridadSocialDTO>;

  // 6. Alimentación
  getAlimentacion(filtros?: SaludFiltros): Promise<AlimentacionDTO>;

  // 7. Frecuencia de uso de servicios de salud
  getServiciosSalud(filtros?: SaludFiltros): Promise<ServicioSaludDTO[]>;

  // 8. Higiene bucodental
  getHigieneBucodental(filtros?: SaludFiltros): Promise<HigieneBucodentalDTO>;

  // 9. Pirámide poblacional por vacuna
  getPiramideVacuna(filtros?: SaludFiltros): Promise<PiramideVacunaDTO[]>;
}
