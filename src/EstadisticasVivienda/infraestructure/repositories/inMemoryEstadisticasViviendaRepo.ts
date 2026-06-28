import { IEstadisticasVivienda } from "../../domain/repositories/IEstadisticasVivienda";
import {
  ServiciosViviendaDTO,
  HacinamientoDTO,
  MaterialesRiesgoDTO,
  AnimalesDTO,
  AnimalPorTipoDTO,
  MascotasDTO
} from "../../domain/entities/consultas";
import { db } from "../../../core/db_postgresql";

export class InMemoryEstadisticasViviendaRepo implements IEstadisticasVivienda {
  // 1. Servicios básicos de la vivienda
  async getServicios(): Promise<ServiciosViviendaDTO> {
    const query = `
      SELECT
        COUNT(*)::int AS total_viviendas,
        COUNT(*) FILTER (WHERE agua_entubada IS TRUE)::int      AS con_agua,
        COUNT(*) FILTER (WHERE agua_entubada IS FALSE)::int     AS sin_agua,
        COUNT(*) FILTER (WHERE energia_electrica IS TRUE)::int  AS con_luz,
        COUNT(*) FILTER (WHERE energia_electrica IS FALSE)::int AS sin_luz,
        COUNT(*) FILTER (WHERE red_alcantarillado IS TRUE)::int  AS con_alcantarillado,
        COUNT(*) FILTER (WHERE red_alcantarillado IS FALSE)::int AS sin_alcantarillado,
        COUNT(*) FILTER (WHERE fosa_septica IS TRUE)::int       AS con_fosa_septica
      FROM vivienda;
    `;
    const rows = await db.fetchRows(query, []);
    return rows[0];
  }

  // 2. Hacinamiento (habitantes / cuartos > 2.5)
  async getHacinamiento(): Promise<HacinamientoDTO> {
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE numero_cuartos > 0 AND numero_habitantes::numeric / numero_cuartos > 2.5)::int  AS viviendas_hacinadas,
        COUNT(*) FILTER (WHERE numero_cuartos > 0 AND numero_habitantes::numeric / numero_cuartos <= 2.5)::int AS viviendas_no_hacinadas,
        COUNT(*) FILTER (WHERE numero_cuartos IS NULL OR numero_cuartos = 0)::int AS sin_dato,
        ROUND(AVG(CASE WHEN numero_cuartos > 0 THEN numero_habitantes::numeric / numero_cuartos END), 2) AS promedio_personas_por_cuarto
      FROM vivienda;
    `;
    const rows = await db.fetchRows(query, []);
    return rows[0];
  }

  // 3. Materiales y condiciones de riesgo
  async getMaterialesRiesgo(): Promise<MaterialesRiesgoDTO> {
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE mp.nombre = 'Tierra')::int AS piso_tierra,
        COUNT(*) FILTER (WHERE v.cocina_con_lena IS TRUE)::int AS cocina_con_lena,
        COUNT(*) FILTER (WHERE v.cocina_ubicacion = 'dentro_del_dormitorio')::int AS cocina_en_dormitorio,
        COUNT(*)::int AS total_viviendas
      FROM vivienda v
      LEFT JOIN cat_material mp ON mp.id_material = v.material_piso_id;
    `;
    const rows = await db.fetchRows(query, []);
    return rows[0];
  }

  // 4. Animales / mascotas
  async getAnimales(): Promise<AnimalesDTO> {
    const porAnimalQuery = `
      SELECT a.nombre, COUNT(*)::int AS total
      FROM familia_animal fa
      JOIN cat_animal a ON a.id_animal = fa.animal_id
      GROUP BY a.nombre ORDER BY total DESC;
    `;
    const mascotasQuery = `
      SELECT
        COUNT(*) FILTER (WHERE perros_gatos_dentro IS TRUE)::int          AS con_perros_gatos_dentro,
        COUNT(*) FILTER (WHERE mascotas_vacunas_corrientes IS FALSE)::int AS mascotas_sin_vacunar,
        COUNT(*) FILTER (WHERE mascotas_esterilizadas IS TRUE)::int       AS mascotas_esterilizadas
      FROM vivienda;
    `;
    const porAnimal: AnimalPorTipoDTO[] = await db.fetchRows(porAnimalQuery, []);
    const mascotasRows = await db.fetchRows(mascotasQuery, []);
    const mascotas: MascotasDTO = mascotasRows[0];
    return { por_animal: porAnimal, mascotas };
  }
}
