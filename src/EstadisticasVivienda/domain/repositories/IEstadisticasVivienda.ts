import {
  ServiciosViviendaDTO,
  HacinamientoDTO,
  MaterialesRiesgoDTO,
  AnimalesDTO,
  ViviendaFiltros
} from "../entities/consultas";

export interface IEstadisticasVivienda {
  // 1. Servicios básicos de la vivienda
  getServicios(filtros?: ViviendaFiltros): Promise<ServiciosViviendaDTO>;

  // 2. Hacinamiento (habitantes / cuartos > 2.5)
  getHacinamiento(filtros?: ViviendaFiltros): Promise<HacinamientoDTO>;

  // 3. Materiales y condiciones de riesgo
  getMaterialesRiesgo(filtros?: ViviendaFiltros): Promise<MaterialesRiesgoDTO>;

  // 4. Animales / mascotas
  getAnimales(filtros?: ViviendaFiltros): Promise<AnimalesDTO>;
}
