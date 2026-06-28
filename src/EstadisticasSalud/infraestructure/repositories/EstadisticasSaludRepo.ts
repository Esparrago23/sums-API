import { IEstadisticasSalud } from "../../domain/repositories/IEstadisticasSalud";
import {
  EnfermedadCronicaDTO,
  ToxicomaniaDTO,
  DiscapacidadDTO,
  SaludPreventivaDTO,
  SeguridadSocialDTO,
  AlimentacionDTO,
  ServicioSaludDTO,
  HigieneBucodentalDTO,
  SaludFiltros,
  PiramideVacunaDTO
} from "../../domain/entities/estadisticasSalud";
import { db } from "../../../core/db_postgresql";

export class EstadisticasSaludRepo implements IEstadisticasSalud {
  /**
   * Construye, de forma dinámica y parametrizada, las condiciones EXISTS de los
   * filtros §C (fecha_inicio, fecha_fin, unidad_salud_id, localidad).
   *
   * - pidColumn: columna persona_id de la tabla que se está agregando (ej. "pec.persona_id").
   * - startIndex: número del próximo placeholder ($N) disponible para esta consulta.
   *
   * Devuelve las condiciones SQL (sin el "WHERE"/"AND" inicial) y los valores en el
   * mismo orden de los placeholders. Nunca interpola valores en el SQL.
   */
  private construirFiltros(
    pidColumn: string,
    filtros: SaludFiltros | undefined,
    startIndex: number
  ): { conditions: string[]; values: any[] } {
    const conditions: string[] = [];
    const values: any[] = [];
    let i = startIndex;

    if (!filtros) {
      return { conditions, values };
    }

    // Filtro por rango de fechas (usa solo el extremo enviado): cedula.fecha_registro.
    const tieneInicio = filtros.fecha_inicio !== undefined;
    const tieneFin = filtros.fecha_fin !== undefined;
    if (tieneInicio || tieneFin) {
      const partes: string[] = [];
      if (tieneInicio) {
        partes.push(`c.fecha_registro >= $${i}`);
        values.push(filtros.fecha_inicio);
        i++;
      }
      if (tieneFin) {
        partes.push(`c.fecha_registro <= $${i}`);
        values.push(filtros.fecha_fin);
        i++;
      }
      conditions.push(
        `EXISTS (SELECT 1 FROM nucleo_persona np ` +
          `JOIN cedula c ON c.nucleo_familiar_id = np.nucleo_familiar_id ` +
          `WHERE np.persona_id = ${pidColumn} AND ${partes.join(" AND ")})`
      );
    }

    // Filtro por unidad de salud: cedula.unidad_salud_id.
    if (filtros.unidad_salud_id !== undefined) {
      conditions.push(
        `EXISTS (SELECT 1 FROM nucleo_persona np ` +
          `JOIN cedula c ON c.nucleo_familiar_id = np.nucleo_familiar_id ` +
          `WHERE np.persona_id = ${pidColumn} AND c.unidad_salud_id = $${i})`
      );
      values.push(filtros.unidad_salud_id);
      i++;
    }

    // Filtro por localidad (match exacto): direccion.localidad.
    if (filtros.localidad !== undefined) {
      conditions.push(
        `EXISTS (SELECT 1 FROM nucleo_persona np ` +
          `JOIN nucleo_direccion nd ON nd.nucleo_familiar_id = np.nucleo_familiar_id ` +
          `JOIN direccion d ON d.id_direccion = nd.direccion_id ` +
          `WHERE np.persona_id = ${pidColumn} AND d.localidad = $${i})`
      );
      values.push(filtros.localidad);
      i++;
    }

    return { conditions, values };
  }

  // Une las condiciones de filtro a una cláusula WHERE/AND según corresponda.
  private aplicarWhere(baseTieneWhere: boolean, conditions: string[]): string {
    if (conditions.length === 0) {
      return "";
    }
    const prefijo = baseTieneWhere ? " AND " : " WHERE ";
    return prefijo + conditions.join(" AND ");
  }

  // 1. Personas por enfermedad crónica
  async getEnfermedadesCronicas(filtros?: SaludFiltros): Promise<EnfermedadCronicaDTO[]> {
    const { conditions, values } = this.construirFiltros("pec.persona_id", filtros, 1);
    const query = `
      SELECT ec.nombre, COUNT(DISTINCT pec.persona_id)::int AS personas
      FROM persona_enfermedad_cronica pec
      JOIN cat_enfermedad_cronica ec ON ec.id_enfermedad_cronica = pec.enfermedad_cronica_id
      ${this.aplicarWhere(false, conditions)}
      GROUP BY ec.nombre ORDER BY personas DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 2. Personas por toxicomanía
  async getToxicomanias(filtros?: SaludFiltros): Promise<ToxicomaniaDTO[]> {
    const { conditions, values } = this.construirFiltros("pt.persona_id", filtros, 1);
    const query = `
      SELECT t.nombre, COUNT(DISTINCT pt.persona_id)::int AS personas
      FROM persona_toxicomania pt
      JOIN cat_toxicomania t ON t.id_toxicomania = pt.toxicomania_id
      ${this.aplicarWhere(false, conditions)}
      GROUP BY t.nombre ORDER BY personas DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 3. Discapacidad (resumen + por tipo)
  async getDiscapacidad(filtros?: SaludFiltros): Promise<DiscapacidadDTO> {
    // Resumen: la tabla persona_discapacidad recibe alias "pd" para el filtro.
    const resumenFiltros = this.construirFiltros("pd.persona_id", filtros, 1);
    const resumenQuery = `
      SELECT
        COUNT(*) FILTER (WHERE presenta_discapacidad IS TRUE)::int  AS con_discapacidad,
        COUNT(*) FILTER (WHERE presenta_discapacidad IS FALSE)::int AS sin_discapacidad
      FROM persona_discapacidad pd
      ${this.aplicarWhere(false, resumenFiltros.conditions)};
    `;

    // Por tipo: ya existe un WHERE (presenta_discapacidad IS TRUE) -> usar AND.
    const porTipoFiltros = this.construirFiltros("pd.persona_id", filtros, 1);
    const porTipoQuery = `
      SELECT COALESCE(NULLIF(tipo_discapacidad,''),'No especificado') AS tipo, COUNT(*)::int AS total
      FROM persona_discapacidad pd WHERE presenta_discapacidad IS TRUE
      ${this.aplicarWhere(true, porTipoFiltros.conditions)}
      GROUP BY tipo ORDER BY total DESC;
    `;

    const resumenRows = await db.fetchRows(resumenQuery, resumenFiltros.values);
    const porTipo = await db.fetchRows(porTipoQuery, porTipoFiltros.values);
    return {
      resumen: resumenRows[0],
      por_tipo: porTipo
    };
  }

  // 4. Salud preventiva (resumen + por atención de embarazo)
  async getSaludPreventiva(filtros?: SaludFiltros): Promise<SaludPreventivaDTO> {
    // Resumen: alias "ps" para persona_salud_preventiva.
    const resumenFiltros = this.construirFiltros("ps.persona_id", filtros, 1);
    const resumenQuery = `
      SELECT
        COUNT(*) FILTER (WHERE tamizaje_cervico_uterino IS TRUE)::int AS tamizaje_cervico_uterino,
        COUNT(*) FILTER (WHERE tamizaje_cancer_mama IS TRUE)::int     AS tamizaje_cancer_mama,
        COUNT(*) FILTER (WHERE atencion_embarazo_id IS NOT NULL)::int AS con_atencion_embarazo,
        COUNT(*)::int AS total_registros
      FROM persona_salud_preventiva ps
      ${this.aplicarWhere(false, resumenFiltros.conditions)};
    `;

    // Por atención: ya hay JOIN sin WHERE -> usar WHERE.
    const porAtencionFiltros = this.construirFiltros("ps.persona_id", filtros, 1);
    const porAtencionQuery = `
      SELECT ae.nombre, COUNT(*)::int AS total
      FROM persona_salud_preventiva ps
      JOIN cat_atencion_embarazo ae ON ae.id_atencion_embarazo = ps.atencion_embarazo_id
      ${this.aplicarWhere(false, porAtencionFiltros.conditions)}
      GROUP BY ae.nombre ORDER BY total DESC;
    `;

    const resumenRows = await db.fetchRows(resumenQuery, resumenFiltros.values);
    const porAtencion = await db.fetchRows(porAtencionQuery, porAtencionFiltros.values);
    return {
      resumen: resumenRows[0],
      por_atencion_embarazo: porAtencion
    };
  }

  // 5. Seguridad social
  async getSeguridadSocial(filtros?: SaludFiltros): Promise<SeguridadSocialDTO> {
    const { conditions, values } = this.construirFiltros("pss.persona_id", filtros, 1);
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE cuenta_seguridad_social IS TRUE)::int  AS con_seguridad,
        COUNT(*) FILTER (WHERE cuenta_seguridad_social IS FALSE)::int AS sin_seguridad
      FROM persona_seguridad_social pss
      ${this.aplicarWhere(false, conditions)};
    `;
    const rows = await db.fetchRows(query, values);
    return rows[0];
  }

  // 6. Alimentación
  async getAlimentacion(filtros?: SaludFiltros): Promise<AlimentacionDTO> {
    const { conditions, values } = this.construirFiltros("pa.persona_id", filtros, 1);
    const query = `
      SELECT
        ROUND(AVG(dias_proteina), 2)        AS promedio_dias_proteina,
        ROUND(AVG(dias_frutas_verduras), 2) AS promedio_dias_frutas_verduras,
        ROUND(AVG(dias_cereales), 2)        AS promedio_dias_cereales,
        COUNT(*)::int                        AS total_registros
      FROM persona_alimentacion pa
      ${this.aplicarWhere(false, conditions)};
    `;
    const rows = await db.fetchRows(query, values);
    return rows[0];
  }

  // 7. Frecuencia de uso de servicios de salud
  async getServiciosSalud(filtros?: SaludFiltros): Promise<ServicioSaludDTO[]> {
    const { conditions, values } = this.construirFiltros("pss.persona_id", filtros, 1);
    const query = `
      SELECT fss.nombre, COUNT(DISTINCT pss.persona_id)::int AS total
      FROM persona_servicio_salud pss
      JOIN cat_frecuencia_servicio_salud fss ON fss.id_frecuencia_servicio_salud = pss.frecuencia_servicio_salud_id
      ${this.aplicarWhere(false, conditions)}
      GROUP BY fss.nombre ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 8. Higiene bucodental
  async getHigieneBucodental(filtros?: SaludFiltros): Promise<HigieneBucodentalDTO> {
    const { conditions, values } = this.construirFiltros("ph.persona_id", filtros, 1);
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE higiene_bano_bucodental_diaria IS TRUE)::int  AS diaria,
        COUNT(*) FILTER (WHERE higiene_bano_bucodental_diaria IS FALSE)::int AS no_diaria,
        COUNT(*) FILTER (WHERE higiene_bano_bucodental_diaria IS NULL)::int  AS sin_dato,
        COUNT(*)::int AS total
      FROM persona_higiene ph
      ${this.aplicarWhere(false, conditions)};
    `;
    const rows = await db.fetchRows(query, values);
    return rows[0];
  }

  // 9. Pirámide poblacional por vacuna
  async getPiramideVacuna(filtros?: SaludFiltros): Promise<PiramideVacunaDTO[]> {
    let baseWhere = "WHERE 1=1";
    const values: any[] = [];
    let paramIndex = 1;

    if (filtros?.vacuna_id) {
      baseWhere += ` AND i.vacuna_id = $${paramIndex}`;
      values.push(filtros.vacuna_id);
      paramIndex++;
    }

    const { conditions, values: filterValues } = this.construirFiltros("p.id_persona", filtros, paramIndex);
    const whereExtra = conditions.length ? " AND " + conditions.join(" AND ") : "";
    values.push(...filterValues);

    const query = `
      SELECT
        CASE
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 5  THEN '0-4'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 15 THEN '5-14'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 30 THEN '15-29'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 45 THEN '30-44'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 60 THEN '45-59'
          ELSE '60+'
        END AS rango_edad,
        p.sexo, 
        COUNT(DISTINCT p.id_persona)::int AS total
      FROM persona p
      JOIN esquema_vacunacion ev ON ev.persona_id = p.id_persona
      JOIN inmunizacion i ON i.esquema_vacunacion_id = ev.id_esquema_vacunacion
      ${baseWhere} ${whereExtra}
      GROUP BY rango_edad, p.sexo
      ORDER BY rango_edad;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }
}
