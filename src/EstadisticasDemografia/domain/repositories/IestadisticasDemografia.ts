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
} from "../entities/demografia";

export interface IestadisticasDemografia {
  // 1. Pirámide poblacional (rango de edad x sexo)
  getPiramidePoblacional(filtros?: DemografiaFiltros): Promise<PiramidePoblacionalDTO[]>;

  // 2. Distribución por género
  getDistribucionGenero(filtros?: DemografiaFiltros): Promise<DistribucionGeneroDTO[]>;

  // 3. Distribución por escolaridad
  getDistribucionEscolaridad(filtros?: DemografiaFiltros): Promise<DistribucionEscolaridadDTO[]>;

  // 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
  getAlfabetizacion(filtros?: DemografiaFiltros): Promise<AlfabetizacionDTO>;

  // 5. Distribución por lengua indígena
  getDistribucionLengua(filtros?: DemografiaFiltros): Promise<DistribucionLenguaDTO[]>;

  // 6. Distribución por ingreso salarial
  getDistribucionIngreso(filtros?: DemografiaFiltros): Promise<DistribucionIngresoDTO[]>;

  // 7. Distribución por ocupación
  getDistribucionOcupacion(filtros?: DemografiaFiltros): Promise<DistribucionOcupacionDTO[]>;

  // 8. Distribución por estado civil
  getDistribucionEstadoCivil(filtros?: DemografiaFiltros): Promise<DistribucionEstadoCivilDTO[]>;
}
