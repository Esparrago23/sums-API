import { IEstadisticasVivienda } from "../../domain/repositories/IEstadisticasVivienda";
import {
  ServiciosViviendaDTO,
  HacinamientoDTO,
  MaterialesRiesgoDTO,
  AnimalesDTO,
  AnimalPorTipoDTO,
  MascotasDTO,
  ViviendaFiltros
} from "../../domain/entities/consultas";
import { db } from "../../../core/db_postgresql";

export class InMemoryEstadisticasViviendaRepo implements IEstadisticasVivienda {
  /**
   * Construye dinámicamente las condiciones del WHERE a partir de los filtros (§C).
   * - Usa placeholders numerados ($1, $2, ...) a partir del valor inicial recibido;
   *   nunca interpola valores en el SQL.
   * - `alias` es el alias de la tabla base que expone la columna nucleo_familiar_id
   *   (`v` para vivienda, `fa` para familia_animal).
   * Devuelve las cláusulas (sin la palabra WHERE), los valores y el contador final
   * de parámetros para encadenar consultas posteriores.
   */
  private buildFiltros(
    filtros: ViviendaFiltros | undefined,
    alias: string,
    startIndex: number = 1
  ): { clauses: string[]; values: any[]; nextIndex: number } {
    const clauses: string[] = [];
    const values: any[] = [];
    let i = startIndex;

    if (!filtros) {
      return { clauses, values, nextIndex: i };
    }

    const { fecha_inicio, fecha_fin, unidad_salud_id, localidad } = filtros;

    // Filtro por fecha de registro de la cédula (usa solo el extremo enviado).
    if (fecha_inicio !== undefined || fecha_fin !== undefined) {
      const cond: string[] = [];
      if (fecha_inicio !== undefined) {
        cond.push(`c.fecha_registro >= $${i}`);
        values.push(fecha_inicio);
        i++;
      }
      if (fecha_fin !== undefined) {
        cond.push(`c.fecha_registro <= $${i}`);
        values.push(fecha_fin);
        i++;
      }
      clauses.push(
        `EXISTS (SELECT 1 FROM cedula c WHERE c.nucleo_familiar_id = ${alias}.nucleo_familiar_id AND ${cond.join(" AND ")})`
      );
    }

    // Filtro por unidad de salud.
    if (unidad_salud_id !== undefined) {
      clauses.push(
        `EXISTS (SELECT 1 FROM cedula c WHERE c.nucleo_familiar_id = ${alias}.nucleo_familiar_id AND c.unidad_salud_id = $${i})`
      );
      values.push(unidad_salud_id);
      i++;
    }

    // Filtro por localidad (match exacto contra direccion.localidad).
    if (localidad !== undefined) {
      clauses.push(
        `EXISTS (SELECT 1 FROM nucleo_direccion nd JOIN direccion d ON d.id_direccion = nd.direccion_id WHERE nd.nucleo_familiar_id = ${alias}.nucleo_familiar_id AND d.localidad = $${i})`
      );
      values.push(localidad);
      i++;
    }

    return { clauses, values, nextIndex: i };
  }

  // Devuelve la cláusula WHERE completa (con la palabra WHERE) o cadena vacía.
  private whereClause(clauses: string[]): string {
    return clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  }

  // 1. Servicios básicos de la vivienda
  async getServicios(filtros?: ViviendaFiltros): Promise<ServiciosViviendaDTO> {
    const { clauses, values } = this.buildFiltros(filtros, "v");
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
      FROM vivienda v
      ${this.whereClause(clauses)};
    `;
    const rows = await db.fetchRows(query, values);
    return rows[0];
  }

  // 2. Hacinamiento (habitantes / cuartos > 2.5)
  async getHacinamiento(filtros?: ViviendaFiltros): Promise<HacinamientoDTO> {
    const { clauses, values } = this.buildFiltros(filtros, "v");
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE numero_cuartos > 0 AND numero_habitantes::numeric / numero_cuartos > 2.5)::int  AS viviendas_hacinadas,
        COUNT(*) FILTER (WHERE numero_cuartos > 0 AND numero_habitantes::numeric / numero_cuartos <= 2.5)::int AS viviendas_no_hacinadas,
        COUNT(*) FILTER (WHERE numero_cuartos IS NULL OR numero_cuartos = 0)::int AS sin_dato,
        ROUND(AVG(CASE WHEN numero_cuartos > 0 THEN numero_habitantes::numeric / numero_cuartos END), 2) AS promedio_personas_por_cuarto
      FROM vivienda v
      ${this.whereClause(clauses)};
    `;
    const rows = await db.fetchRows(query, values);
    return rows[0];
  }

  // 3. Materiales y condiciones de riesgo
  async getMaterialesRiesgo(filtros?: ViviendaFiltros): Promise<MaterialesRiesgoDTO> {
    const { clauses, values } = this.buildFiltros(filtros, "v");
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE mp.nombre = 'Tierra')::int AS piso_tierra,
        COUNT(*) FILTER (WHERE v.cocina_con_lena IS TRUE)::int AS cocina_con_lena,
        COUNT(*) FILTER (WHERE v.cocina_ubicacion = 'dentro_del_dormitorio')::int AS cocina_en_dormitorio,
        COUNT(*)::int AS total_viviendas
      FROM vivienda v
      LEFT JOIN cat_material mp ON mp.id_material = v.material_piso_id
      ${this.whereClause(clauses)};
    `;
    const rows = await db.fetchRows(query, values);
    return rows[0];
  }

  // 4. Animales / mascotas
  async getAnimales(filtros?: ViviendaFiltros): Promise<AnimalesDTO> {
    // por_animal: base familia_animal (alias fa) → EXISTS sobre fa.nucleo_familiar_id
    const porAnimalFiltros = this.buildFiltros(filtros, "fa");
    const porAnimalWhere = this.whereClause(porAnimalFiltros.clauses);
    const porAnimalQuery = `
      SELECT a.nombre, COUNT(*)::int AS total
      FROM familia_animal fa
      JOIN cat_animal a ON a.id_animal = fa.animal_id
      ${porAnimalWhere}
      GROUP BY a.nombre ORDER BY total DESC;
    `;

    // mascotas: base vivienda (alias v) → EXISTS sobre v.nucleo_familiar_id
    const mascotasFiltros = this.buildFiltros(filtros, "v");
    const mascotasQuery = `
      SELECT
        COUNT(*) FILTER (WHERE perros_gatos_dentro IS TRUE)::int          AS con_perros_gatos_dentro,
        COUNT(*) FILTER (WHERE mascotas_vacunas_corrientes IS FALSE)::int AS mascotas_sin_vacunar,
        COUNT(*) FILTER (WHERE mascotas_esterilizadas IS TRUE)::int       AS mascotas_esterilizadas
      FROM vivienda v
      ${this.whereClause(mascotasFiltros.clauses)};
    `;

    const porAnimal: AnimalPorTipoDTO[] = await db.fetchRows(porAnimalQuery, porAnimalFiltros.values);
    const mascotasRows = await db.fetchRows(mascotasQuery, mascotasFiltros.values);
    const mascotas: MascotasDTO = mascotasRows[0];
    return { por_animal: porAnimal, mascotas };
  }
}
