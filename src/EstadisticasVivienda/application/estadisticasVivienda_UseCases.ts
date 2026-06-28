import { IEstadisticasVivienda } from "../domain/repositories/IEstadisticasVivienda";
import {
  ServiciosViviendaDTO,
  HacinamientoDTO,
  MaterialesRiesgoDTO,
  AnimalesDTO
} from "../domain/entities/consultas";

// 1. Servicios básicos de la vivienda
export class GetServiciosUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(): Promise<ServiciosViviendaDTO> {
    return this.estadisticasViviendaRepository.getServicios();
  }
}

// 2. Hacinamiento (habitantes / cuartos > 2.5)
export class GetHacinamientoUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(): Promise<HacinamientoDTO> {
    return this.estadisticasViviendaRepository.getHacinamiento();
  }
}

// 3. Materiales y condiciones de riesgo
export class GetMaterialesRiesgoUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(): Promise<MaterialesRiesgoDTO> {
    return this.estadisticasViviendaRepository.getMaterialesRiesgo();
  }
}

// 4. Animales / mascotas
export class GetAnimalesUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(): Promise<AnimalesDTO> {
    return this.estadisticasViviendaRepository.getAnimales();
  }
}
