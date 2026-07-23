import { IestadisticasDemografia } from '../../domain/repositories/IestadisticasDemografia';
import {
  PiramidePoblacionalDTO,
  DistribucionGeneroDTO,
  DistribucionEscolaridadDTO,
  AlfabetizacionDTO,
  DistribucionLenguaDTO,
  DistribucionIngresoDTO,
  DistribucionOcupacionDTO,
  DistribucionEstadoCivilDTO,
  DemografiaFiltros
} from '../../domain/entities/demografia';
import { db } from '../../../core/db_postgresql';

export class InMemoryEstadisticasDemografiaRepo implements IestadisticasDemografia {
  /**
   * Construcción dinámica y segura del WHERE adicional (§C).
   * Los filtros se aplican como subconsultas EXISTS sobre la columna persona_id
   * disponible en la tabla que se agrega (pidColumn). Nunca se interpolan valores:
   * se usa un contador de parámetros con placeholders pg ($1, $2, ...).
   *
   * @param pidColumn  expresión SQL de la columna persona_id de la tabla base (p.ej. 'pi.persona_id', 'p.id_persona')
   * @param filtros    filtros opcionales y combinables
   * @returns { whereExtra, values } donde whereExtra empieza con ' AND ...' o cadena vacía
   */
  private buildFiltros(
    pidColumn: string,
    filtros?: DemografiaFiltros
  ): { whereExtra: string; values: any[] } {
    const values: any[] = [];
    const conds: string[] = [];

    if (filtros) {
      const { fecha_inicio, fecha_fin, unidad_salud_id, localidad } = filtros;

      // Fecha: usar solo el/los extremo(s) enviado(s) contra cedula.fecha_registro
      if (fecha_inicio) {
        values.push(fecha_inicio);
        conds.push(
          `EXISTS (SELECT 1 FROM nucleo_persona np JOIN cedula c ON c.nucleo_familiar_id = np.nucleo_familiar_id WHERE np.persona_id = ${pidColumn} AND c.fecha_registro >= $${values.length})`
        );
      }
      if (fecha_fin) {
        values.push(fecha_fin);
        conds.push(
          `EXISTS (SELECT 1 FROM nucleo_persona np JOIN cedula c ON c.nucleo_familiar_id = np.nucleo_familiar_id WHERE np.persona_id = ${pidColumn} AND c.fecha_registro <= $${values.length})`
        );
      }

      // Unidad de salud
      if (unidad_salud_id !== undefined && unidad_salud_id !== null) {
        values.push(unidad_salud_id);
        conds.push(
          `EXISTS (SELECT 1 FROM nucleo_persona np JOIN cedula c ON c.nucleo_familiar_id = np.nucleo_familiar_id WHERE np.persona_id = ${pidColumn} AND c.unidad_salud_id = $${values.length})`
        );
      }

      // Localidad (match exacto contra direccion.localidad)
      if (localidad) {
        values.push(localidad);
        conds.push(
          `EXISTS (SELECT 1 FROM nucleo_persona np JOIN nucleo_direccion nd ON nd.nucleo_familiar_id = np.nucleo_familiar_id JOIN direccion d ON d.id_direccion = nd.direccion_id WHERE np.persona_id = ${pidColumn} AND d.localidad = $${values.length})`
        );
      }
    }

    const whereExtra = conds.length ? ' AND ' + conds.join(' AND ') : '';
    return { whereExtra, values };
  }

  // 1. Pirámide poblacional (rango de edad x sexo)
  async getPiramidePoblacional(filtros?: DemografiaFiltros): Promise<PiramidePoblacionalDTO[]> {
    const { whereExtra, values } = this.buildFiltros('p.id_persona', filtros);
    const query = `
      SELECT
        CASE
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 5  THEN '0-4'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 15 THEN '5-14'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 30 THEN '15-29'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 45 THEN '30-44'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 60 THEN '45-59'
          ELSE '60+'
        END AS rango_edad,
        sexo, COUNT(*)::int AS total
      FROM persona p
      WHERE 1=1${whereExtra}
      GROUP BY rango_edad, sexo
      ORDER BY rango_edad;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 2. Distribución por género
  async getDistribucionGenero(filtros?: DemografiaFiltros): Promise<DistribucionGeneroDTO[]> {
    const { whereExtra, values } = this.buildFiltros('p.id_persona', filtros);
    const query = `
      SELECT sexo, COUNT(*)::int AS total
      FROM persona p
      WHERE 1=1${whereExtra}
      GROUP BY sexo;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 3. Distribución por escolaridad
  async getDistribucionEscolaridad(filtros?: DemografiaFiltros): Promise<DistribucionEscolaridadDTO[]> {
    const { whereExtra, values } = this.buildFiltros('pe.persona_id', filtros);
    const query = `
      SELECT esc.nombre, COUNT(DISTINCT pe.persona_id)::int AS total
      FROM persona_escolaridad pe
      JOIN cat_escolaridad esc ON esc.id_escolaridad = pe.escolaridad_id
      WHERE 1=1${whereExtra}
      GROUP BY esc.nombre ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
  async getAlfabetizacion(filtros?: DemografiaFiltros): Promise<AlfabetizacionDTO> {
    const { whereExtra, values } = this.buildFiltros('p.id_persona', filtros);
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE alfabetizacion IS TRUE)::int  AS alfabetizados,
        COUNT(*) FILTER (WHERE alfabetizacion IS FALSE)::int AS no_alfabetizados,
        COUNT(*) FILTER (WHERE alfabetizacion IS NULL)::int  AS sin_dato
      FROM persona p
      WHERE 1=1${whereExtra};
    `;
    const rows = await db.fetchRows(query, values);
    return rows[0];
  }

  // 5. Distribución por lengua indígena
  async getDistribucionLengua(filtros?: DemografiaFiltros): Promise<DistribucionLenguaDTO[]> {
    const { whereExtra, values } = this.buildFiltros('pl.persona_id', filtros);
    const query = `
      SELECT l.nombre AS lengua, COUNT(DISTINCT pl.persona_id)::int AS total
      FROM persona_lengua pl
      JOIN cat_lengua l ON l.id_lengua = pl.lengua_id
      WHERE 1=1${whereExtra}
      GROUP BY l.nombre ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 6. Distribución por ingreso salarial
  async getDistribucionIngreso(filtros?: DemografiaFiltros): Promise<DistribucionIngresoDTO[]> {
    const { whereExtra, values } = this.buildFiltros('pi.persona_id', filtros);
    const query = `
      SELECT cis.rango, COUNT(DISTINCT pi.persona_id)::int AS total
      FROM persona_ingreso pi
      JOIN cat_ingreso_salarial cis ON cis.id_ingreso_salarial = pi.ingreso_salarial_id
      WHERE 1=1${whereExtra}
      GROUP BY cis.rango ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 7. Distribución por ocupación
  async getDistribucionOcupacion(filtros?: DemografiaFiltros): Promise<DistribucionOcupacionDTO[]> {
    const { whereExtra, values } = this.buildFiltros('po.persona_id', filtros);
    const query = `
      SELECT oc.nombre, COUNT(DISTINCT po.persona_id)::int AS total
      FROM persona_ocupacion po
      JOIN cat_ocupacion oc ON oc.id_ocupacion = po.ocupacion_id
      WHERE 1=1${whereExtra}
      GROUP BY oc.nombre ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }

  // 8. Distribución por estado civil
  async getDistribucionEstadoCivil(filtros?: DemografiaFiltros): Promise<DistribucionEstadoCivilDTO[]> {
    const { whereExtra, values } = this.buildFiltros('p.id_persona', filtros);
    const query = `
      SELECT ec.nombre, COUNT(*)::int AS total
      FROM persona p
      JOIN cat_estado_civil ec ON ec.id_estado_civil = p.estado_civil_id
      WHERE 1=1${whereExtra}
      GROUP BY ec.nombre ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, values);
    return rows;
  }
}
