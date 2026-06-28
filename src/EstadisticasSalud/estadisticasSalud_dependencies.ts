import { EstadisticasSaludRepo } from "./infraestructure/repositories/EstadisticasSaludRepo";

import {
  GetEnfermedadesCronicasUseCase,
  GetToxicomaniasUseCase,
  GetDiscapacidadUseCase,
  GetSaludPreventivaUseCase,
  GetSeguridadSocialUseCase,
  GetAlimentacionUseCase,
  GetServiciosSaludUseCase,
  GetHigieneBucodentalUseCase,
  GetPiramideVacunaUseCase
} from "./application/estadisticasSalud_UseCases";

import { EstadisticasSaludController } from "./infraestructure/controllers/EstadisticasSaludController";

export const estadisticasSaludRepository = new EstadisticasSaludRepo();

export const getEnfermedadesCronicasUseCase = new GetEnfermedadesCronicasUseCase(estadisticasSaludRepository);//1
export const getToxicomaniasUseCase = new GetToxicomaniasUseCase(estadisticasSaludRepository);//2
export const getDiscapacidadUseCase = new GetDiscapacidadUseCase(estadisticasSaludRepository);//3
export const getSaludPreventivaUseCase = new GetSaludPreventivaUseCase(estadisticasSaludRepository);//4
export const getSeguridadSocialUseCase = new GetSeguridadSocialUseCase(estadisticasSaludRepository);//5
export const getAlimentacionUseCase = new GetAlimentacionUseCase(estadisticasSaludRepository);//6
export const getServiciosSaludUseCase = new GetServiciosSaludUseCase(estadisticasSaludRepository);//7
export const getHigieneBucodentalUseCase = new GetHigieneBucodentalUseCase(estadisticasSaludRepository);//8
export const getPiramideVacunaUseCase = new GetPiramideVacunaUseCase(estadisticasSaludRepository);//9

export const estadisticasSaludController = new EstadisticasSaludController(
  getEnfermedadesCronicasUseCase,
  getToxicomaniasUseCase,
  getDiscapacidadUseCase,
  getSaludPreventivaUseCase,
  getSeguridadSocialUseCase,
  getAlimentacionUseCase,
  getServiciosSaludUseCase,
  getHigieneBucodentalUseCase,
  getPiramideVacunaUseCase
);
