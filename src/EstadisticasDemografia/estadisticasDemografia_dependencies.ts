import { InMemoryEstadisticasDemografiaRepo } from "./infraestructure/repositories/inMemoryEstadisticasDemografiaRepo";

import {
  GetPiramidePoblacionalUseCase,      //1
  GetDistribucionGeneroUseCase,       //2
  GetDistribucionEscolaridadUseCase,  //3
  GetAlfabetizacionUseCase,           //4
  GetDistribucionLenguaUseCase,       //5
  GetDistribucionIngresoUseCase,      //6
  GetDistribucionOcupacionUseCase,    //7
  GetDistribucionEstadoCivilUseCase   //8
} from "./application/estadisticasDemografia_UseCases";

import { EstadisticasDemografia_Controller } from "./infraestructure/controllers/estadisticasDemografia_Controller";

export const estadisticasDemografiaRepository = new InMemoryEstadisticasDemografiaRepo();

export const getPiramidePoblacionalUseCase = new GetPiramidePoblacionalUseCase(estadisticasDemografiaRepository);//1
export const getDistribucionGeneroUseCase = new GetDistribucionGeneroUseCase(estadisticasDemografiaRepository);//2
export const getDistribucionEscolaridadUseCase = new GetDistribucionEscolaridadUseCase(estadisticasDemografiaRepository);//3
export const getAlfabetizacionUseCase = new GetAlfabetizacionUseCase(estadisticasDemografiaRepository);//4
export const getDistribucionLenguaUseCase = new GetDistribucionLenguaUseCase(estadisticasDemografiaRepository);//5
export const getDistribucionIngresoUseCase = new GetDistribucionIngresoUseCase(estadisticasDemografiaRepository);//6
export const getDistribucionOcupacionUseCase = new GetDistribucionOcupacionUseCase(estadisticasDemografiaRepository);//7
export const getDistribucionEstadoCivilUseCase = new GetDistribucionEstadoCivilUseCase(estadisticasDemografiaRepository);//8

export const estadisticasDemografiaController = new EstadisticasDemografia_Controller(
  getPiramidePoblacionalUseCase,
  getDistribucionGeneroUseCase,
  getDistribucionEscolaridadUseCase,
  getAlfabetizacionUseCase,
  getDistribucionLenguaUseCase,
  getDistribucionIngresoUseCase,
  getDistribucionOcupacionUseCase,
  getDistribucionEstadoCivilUseCase
);
