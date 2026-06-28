import {
  EnfermedadCronicaDTO,
  ToxicomaniaDTO,
  DiscapacidadDTO,
  SaludPreventivaDTO,
  SeguridadSocialDTO,
  AlimentacionDTO
} from "../entities/estadisticasSalud";

export interface IEstadisticasSalud {
  // 1. Personas por enfermedad crónica
  getEnfermedadesCronicas(): Promise<EnfermedadCronicaDTO[]>;

  // 2. Personas por toxicomanía
  getToxicomanias(): Promise<ToxicomaniaDTO[]>;

  // 3. Discapacidad (resumen + por tipo)
  getDiscapacidad(): Promise<DiscapacidadDTO>;

  // 4. Salud preventiva (resumen + por atención de embarazo)
  getSaludPreventiva(): Promise<SaludPreventivaDTO>;

  // 5. Seguridad social
  getSeguridadSocial(): Promise<SeguridadSocialDTO>;

  // 6. Alimentación
  getAlimentacion(): Promise<AlimentacionDTO>;
}
