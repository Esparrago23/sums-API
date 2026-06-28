import {
  ServiciosViviendaDTO,
  HacinamientoDTO,
  MaterialesRiesgoDTO,
  AnimalesDTO
} from "../entities/consultas";

export interface IEstadisticasVivienda {
  // 1. Servicios básicos de la vivienda
  getServicios(): Promise<ServiciosViviendaDTO>;

  // 2. Hacinamiento (habitantes / cuartos > 2.5)
  getHacinamiento(): Promise<HacinamientoDTO>;

  // 3. Materiales y condiciones de riesgo
  getMaterialesRiesgo(): Promise<MaterialesRiesgoDTO>;

  // 4. Animales / mascotas
  getAnimales(): Promise<AnimalesDTO>;
}
