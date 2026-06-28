import { IEstadisticasSalud } from "../../domain/repositories/IEstadisticasSalud";
import {
  EnfermedadCronicaDTO,
  ToxicomaniaDTO,
  DiscapacidadDTO,
  SaludPreventivaDTO,
  SeguridadSocialDTO,
  AlimentacionDTO
} from "../../domain/entities/estadisticasSalud";
import { db } from "../../../core/db_postgresql";

export class EstadisticasSaludRepo implements IEstadisticasSalud {
  // 1. Personas por enfermedad crónica
  async getEnfermedadesCronicas(): Promise<EnfermedadCronicaDTO[]> {
    const query = `
      SELECT ec.nombre, COUNT(DISTINCT pec.persona_id)::int AS personas
      FROM persona_enfermedad_cronica pec
      JOIN cat_enfermedad_cronica ec ON ec.id_enfermedad_cronica = pec.enfermedad_cronica_id
      GROUP BY ec.nombre ORDER BY personas DESC;
    `;
    const rows = await db.fetchRows(query, []);
    return rows;
  }

  // 2. Personas por toxicomanía
  async getToxicomanias(): Promise<ToxicomaniaDTO[]> {
    const query = `
      SELECT t.nombre, COUNT(DISTINCT pt.persona_id)::int AS personas
      FROM persona_toxicomania pt
      JOIN cat_toxicomania t ON t.id_toxicomania = pt.toxicomania_id
      GROUP BY t.nombre ORDER BY personas DESC;
    `;
    const rows = await db.fetchRows(query, []);
    return rows;
  }

  // 3. Discapacidad (resumen + por tipo)
  async getDiscapacidad(): Promise<DiscapacidadDTO> {
    const resumenQuery = `
      SELECT
        COUNT(*) FILTER (WHERE presenta_discapacidad IS TRUE)::int  AS con_discapacidad,
        COUNT(*) FILTER (WHERE presenta_discapacidad IS FALSE)::int AS sin_discapacidad
      FROM persona_discapacidad;
    `;
    const porTipoQuery = `
      SELECT COALESCE(NULLIF(tipo_discapacidad,''),'No especificado') AS tipo, COUNT(*)::int AS total
      FROM persona_discapacidad WHERE presenta_discapacidad IS TRUE
      GROUP BY tipo ORDER BY total DESC;
    `;
    const resumenRows = await db.fetchRows(resumenQuery, []);
    const porTipo = await db.fetchRows(porTipoQuery, []);
    return {
      resumen: resumenRows[0],
      por_tipo: porTipo
    };
  }

  // 4. Salud preventiva (resumen + por atención de embarazo)
  async getSaludPreventiva(): Promise<SaludPreventivaDTO> {
    const resumenQuery = `
      SELECT
        COUNT(*) FILTER (WHERE tamizaje_cervico_uterino IS TRUE)::int AS tamizaje_cervico_uterino,
        COUNT(*) FILTER (WHERE tamizaje_cancer_mama IS TRUE)::int     AS tamizaje_cancer_mama,
        COUNT(*) FILTER (WHERE atencion_embarazo_id IS NOT NULL)::int AS con_atencion_embarazo,
        COUNT(*)::int AS total_registros
      FROM persona_salud_preventiva;
    `;
    const porAtencionQuery = `
      SELECT ae.nombre, COUNT(*)::int AS total
      FROM persona_salud_preventiva ps
      JOIN cat_atencion_embarazo ae ON ae.id_atencion_embarazo = ps.atencion_embarazo_id
      GROUP BY ae.nombre ORDER BY total DESC;
    `;
    const resumenRows = await db.fetchRows(resumenQuery, []);
    const porAtencion = await db.fetchRows(porAtencionQuery, []);
    return {
      resumen: resumenRows[0],
      por_atencion_embarazo: porAtencion
    };
  }

  // 5. Seguridad social
  async getSeguridadSocial(): Promise<SeguridadSocialDTO> {
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE cuenta_seguridad_social IS TRUE)::int  AS con_seguridad,
        COUNT(*) FILTER (WHERE cuenta_seguridad_social IS FALSE)::int AS sin_seguridad
      FROM persona_seguridad_social;
    `;
    const rows = await db.fetchRows(query, []);
    return rows[0];
  }

  // 6. Alimentación
  async getAlimentacion(): Promise<AlimentacionDTO> {
    const query = `
      SELECT
        ROUND(AVG(dias_proteina), 2)        AS promedio_dias_proteina,
        ROUND(AVG(dias_frutas_verduras), 2) AS promedio_dias_frutas_verduras,
        ROUND(AVG(dias_cereales), 2)        AS promedio_dias_cereales,
        COUNT(*)::int                        AS total_registros
      FROM persona_alimentacion;
    `;
    const rows = await db.fetchRows(query, []);
    return rows[0];
  }
}
