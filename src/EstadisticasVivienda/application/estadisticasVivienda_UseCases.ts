import { IEstadisticasVivienda } from "../domain/repositories/IEstadisticasVivienda";
import {
  ServiciosViviendaDTO,
  HacinamientoDTO,
  MaterialesRiesgoDTO,
  AnimalesDTO,
  ViviendaFiltros
} from "../domain/entities/consultas";

// 1. Servicios básicos de la vivienda
export class GetServiciosUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(filtros?: ViviendaFiltros): Promise<ServiciosViviendaDTO> {
    return this.estadisticasViviendaRepository.getServicios(filtros);
  }
}

// 2. Hacinamiento (habitantes / cuartos > 2.5)
export class GetHacinamientoUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(filtros?: ViviendaFiltros): Promise<HacinamientoDTO> {
    return this.estadisticasViviendaRepository.getHacinamiento(filtros);
  }
}

// 3. Materiales y condiciones de riesgo
export class GetMaterialesRiesgoUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(filtros?: ViviendaFiltros): Promise<MaterialesRiesgoDTO> {
    return this.estadisticasViviendaRepository.getMaterialesRiesgo(filtros);
  }
}

// 4. Animales / mascotas
export class GetAnimalesUseCase {
  constructor(private estadisticasViviendaRepository: IEstadisticasVivienda) {}

  async execute(filtros?: ViviendaFiltros): Promise<AnimalesDTO> {
    return this.estadisticasViviendaRepository.getAnimales(filtros);
  }
}
