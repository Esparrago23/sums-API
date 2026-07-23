import { InMemoryEstadisticasViviendaRepo } from "./infraestructure/repositories/inMemoryEstadisticasViviendaRepo";

import {
  GetServiciosUseCase,
  GetHacinamientoUseCase,
  GetMaterialesRiesgoUseCase,
  GetAnimalesUseCase
} from "./application/estadisticasVivienda_UseCases";

import {
  GetServicios_Controller,
  GetHacinamiento_Controller,
  GetMaterialesRiesgo_Controller,
  GetAnimales_Controller
} from "./infraestructure/controllers/estadisticasVivienda_Controller";

export const estadisticasViviendaRepository = new InMemoryEstadisticasViviendaRepo();

// 1. Servicios
export const getServiciosUseCase = new GetServiciosUseCase(estadisticasViviendaRepository);
// 2. Hacinamiento
export const getHacinamientoUseCase = new GetHacinamientoUseCase(estadisticasViviendaRepository);
// 3. Materiales de riesgo
export const getMaterialesRiesgoUseCase = new GetMaterialesRiesgoUseCase(estadisticasViviendaRepository);
// 4. Animales
export const getAnimalesUseCase = new GetAnimalesUseCase(estadisticasViviendaRepository);

// 1. Servicios
export const getServiciosController = new GetServicios_Controller(getServiciosUseCase);
// 2. Hacinamiento
export const getHacinamientoController = new GetHacinamiento_Controller(getHacinamientoUseCase);
// 3. Materiales de riesgo
export const getMaterialesRiesgoController = new GetMaterialesRiesgo_Controller(getMaterialesRiesgoUseCase);
// 4. Animales
export const getAnimalesController = new GetAnimales_Controller(getAnimalesUseCase);
