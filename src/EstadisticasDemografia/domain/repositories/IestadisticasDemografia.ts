import {
  PiramidePoblacionalDTO,
  DistribucionGeneroDTO,
  DistribucionEscolaridadDTO,
  AlfabetizacionDTO,
  DistribucionLenguaDTO
} from "../entities/demografia";

export interface IestadisticasDemografia {
  // 1. Pirámide poblacional (rango de edad x sexo)
  getPiramidePoblacional(): Promise<PiramidePoblacionalDTO[]>;

  // 2. Distribución por género
  getDistribucionGenero(): Promise<DistribucionGeneroDTO[]>;

  // 3. Distribución por escolaridad
  getDistribucionEscolaridad(): Promise<DistribucionEscolaridadDTO[]>;

  // 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
  getAlfabetizacion(): Promise<AlfabetizacionDTO>;

  // 5. Distribución por lengua indígena
  getDistribucionLengua(): Promise<DistribucionLenguaDTO[]>;
}
