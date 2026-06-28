import { db } from "../../../core/db_postgresql";
import {
  IestadisticasOperacion,
  PeriodoAgrupacion
} from "../../domain/repositories/IestadisticasOperacion";
import {
  MisCedulasResumenDTO,
  MisCedulasSerieDTO,
  CedulasPorEstadoDTO,
  ResumenGeneralDTO,
  ProductividadEntrevistadorDTO,
  CedulasSerieDTO,
  CedulasPorUnidadDTO,
  CedulasPorLocalidadDTO
} from "../../domain/entities/estadisticasOperacion";

export class EstadisticasOperacionRepo implements IestadisticasOperacion {
  // Auxiliar: resuelve el entrevistador asociado a un usuario (del JWT)
  async getEntrevistadorIdDeUsuario(idUsuario: number): Promise<number | null> {
    const query = `SELECT entrevistador_id FROM usuario WHERE id_usuario = $1`;
    const rows = await db.fetchRows(query, [idUsuario]);
    if (rows.length === 0 || rows[0].entrevistador_id === null || rows[0].entrevistador_id === undefined) {
      return null;
    }
    return rows[0].entrevistador_id;
  }

  // 1. Resumen de cédulas del entrevistador
  async getMisCedulasResumen(entrevistadorId: number): Promise<MisCedulasResumenDTO> {
    const queryResumen = `
      SELECT
        COUNT(*) FILTER (WHERE fecha_registro = CURRENT_DATE)::int AS hoy,
        COUNT(*) FILTER (WHERE fecha_registro >= date_trunc('week', CURRENT_DATE))::int AS semana,
        COUNT(*) FILTER (WHERE fecha_registro >= date_trunc('month', CURRENT_DATE))::int AS mes,
        COUNT(*)::int AS total,
        MIN(fecha_registro)::text AS primera_cedula,
        MAX(fecha_registro)::text AS ultima_cedula
      FROM cedula WHERE entrevistador_id = $1;
    `;
    const filas = await db.fetchRows(queryResumen, [entrevistadorId]);
    const resumen = filas[0];

    // Fecha de alta del entrevistador
    const queryAlta = `SELECT fecha_registro::text AS alta FROM entrevistador WHERE id_entrevistador = $1`;
    const filasAlta = await db.fetchRows(queryAlta, [entrevistadorId]);
    const alta = filasAlta.length > 0 ? filasAlta[0].alta : null;

    return {
      entrevistador_id: entrevistadorId,
      alta: alta,
      hoy: resumen.hoy,
      semana: resumen.semana,
      mes: resumen.mes,
      total: resumen.total,
      primera_cedula: resumen.primera_cedula,
      ultima_cedula: resumen.ultima_cedula
    };
  }

  // 2. Serie temporal de cédulas del entrevistador (últimos N días)
  async getMisCedulasSerie(entrevistadorId: number, dias: number): Promise<MisCedulasSerieDTO[]> {
    const query = `
      SELECT fecha_registro::text AS fecha, COUNT(*)::int AS total
      FROM cedula
      WHERE entrevistador_id = $1 AND fecha_registro >= CURRENT_DATE - ($2::int - 1)
      GROUP BY fecha_registro ORDER BY fecha_registro;
    `;
    return await db.fetchRows(query, [entrevistadorId, dias]);
  }

  // 3. Cédulas del entrevistador agrupadas por estado
  async getMisCedulasPorEstado(entrevistadorId: number): Promise<CedulasPorEstadoDTO[]> {
    const query = `
      SELECT estado, COUNT(*)::int AS total FROM cedula WHERE entrevistador_id = $1 GROUP BY estado;
    `;
    return await db.fetchRows(query, [entrevistadorId]);
  }

  // 4. Resumen general (totales globales)
  async getResumenGeneral(): Promise<ResumenGeneralDTO> {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM cedula)::int          AS total_cedulas,
        (SELECT COUNT(*) FROM persona)::int         AS total_personas,
        (SELECT COUNT(*) FROM vivienda)::int        AS total_viviendas,
        (SELECT COUNT(*) FROM nucleo_familiar)::int AS total_nucleos,
        (SELECT COUNT(*) FROM inmunizacion)::int    AS total_dosis,
        (SELECT COUNT(*) FROM entrevistador)::int   AS total_entrevistadores,
        (SELECT COUNT(*) FROM cedula WHERE fecha_registro = CURRENT_DATE)::int AS cedulas_hoy,
        (SELECT COUNT(*) FROM cedula WHERE fecha_registro >= date_trunc('month', CURRENT_DATE))::int AS cedulas_mes;
    `;
    const filas = await db.fetchRows(query, []);
    return filas[0];
  }

  // 5. Productividad por entrevistador (ranking)
  async getProductividadEntrevistadores(): Promise<ProductividadEntrevistadorDTO[]> {
    const query = `
      SELECT e.id_entrevistador, e.nombre, e.fecha_registro::text AS alta,
        COUNT(c.id_cedula)::int AS total,
        COUNT(c.id_cedula) FILTER (WHERE c.fecha_registro = CURRENT_DATE)::int AS hoy,
        COUNT(c.id_cedula) FILTER (WHERE c.fecha_registro >= date_trunc('week', CURRENT_DATE))::int AS semana,
        COUNT(c.id_cedula) FILTER (WHERE c.fecha_registro >= date_trunc('month', CURRENT_DATE))::int AS mes,
        MAX(c.fecha_registro)::text AS ultima_actividad
      FROM entrevistador e
      LEFT JOIN cedula c ON c.entrevistador_id = e.id_entrevistador
      GROUP BY e.id_entrevistador, e.nombre, e.fecha_registro
      ORDER BY total DESC;
    `;
    return await db.fetchRows(query, []);
  }

  // 6. Serie temporal global de cédulas agrupada por periodo
  async getCedulasSerie(periodo: PeriodoAgrupacion): Promise<CedulasSerieDTO[]> {
    // periodo ya viene validado contra lista blanca ('day' | 'week' | 'month')
    const query = `
      SELECT to_char(date_trunc($1, fecha_registro), 'YYYY-MM-DD') AS periodo, COUNT(*)::int AS total
      FROM cedula
      GROUP BY date_trunc($1, fecha_registro)
      ORDER BY date_trunc($1, fecha_registro);
    `;
    return await db.fetchRows(query, [periodo]);
  }

  // 7. Cédulas globales agrupadas por estado
  async getCedulasPorEstado(): Promise<CedulasPorEstadoDTO[]> {
    const query = `
      SELECT estado, COUNT(*)::int AS total FROM cedula GROUP BY estado;
    `;
    return await db.fetchRows(query, []);
  }

  // 8. Cédulas por unidad de salud
  async getCedulasPorUnidad(): Promise<CedulasPorUnidadDTO[]> {
    const query = `
      SELECT u.id_unidad_salud, u.nombre, COUNT(c.id_cedula)::int AS total
      FROM unidad_salud u
      LEFT JOIN cedula c ON c.unidad_salud_id = u.id_unidad_salud
      GROUP BY u.id_unidad_salud, u.nombre ORDER BY total DESC;
    `;
    return await db.fetchRows(query, []);
  }

  // 9. Cédulas por localidad
  async getCedulasPorLocalidad(): Promise<CedulasPorLocalidadDTO[]> {
    const query = `
      SELECT COALESCE(d.localidad, 'Sin localidad') AS localidad, COUNT(DISTINCT c.id_cedula)::int AS total
      FROM cedula c
      JOIN nucleo_direccion nd ON nd.nucleo_familiar_id = c.nucleo_familiar_id
      JOIN direccion d ON d.id_direccion = nd.direccion_id
      GROUP BY d.localidad ORDER BY total DESC;
    `;
    return await db.fetchRows(query, []);
  }
}
