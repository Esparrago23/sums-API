import { db } from "../../../core/db_postgresql";
import { decrypt } from "../../../shared/security/encryption";
import {
  IestadisticasOperacion,
  PeriodoAgrupacion,
  FiltrosFecha
} from "../../domain/repositories/IestadisticasOperacion";
import {
  MisCedulasResumenDTO,
  MisCedulasSerieDTO,
  CedulasPorEstadoDTO,
  ResumenGeneralDTO,
  ProductividadEntrevistadorDTO,
  CedulasSerieDTO,
  CedulasPorUnidadDTO,
  CedulasPorLocalidadDTO,
  CedulasPorColoniaDTO,
  NucleosTamanoDTO,
  FiltrosEstadisticas
} from "../../domain/entities/estadisticasOperacion";

// Resultado de la construcción dinámica de predicados de filtro §C.
// 'condiciones' son las expresiones SQL (sin la palabra WHERE) y 'valores'
// son los parámetros posicionales correspondientes. Nunca se interpola.
interface PredicadosFiltro {
  condiciones: string[];
  valores: any[];
}

export class EstadisticasOperacionRepo implements IestadisticasOperacion {
  /**
   * Construye los predicados §C aplicables a una tabla cédula con alias dado.
   * @param filtros    filtros opcionales
   * @param aliasCedula alias de la tabla cedula (p.ej. 'c')
   * @param paramInicial número del primer placeholder a usar (continúa el contador)
   * Nunca interpola valores; devuelve placeholders $n y el arreglo de valores.
   */
  private construirFiltrosCedula(
    filtros: FiltrosEstadisticas | undefined,
    aliasCedula: string,
    paramInicial: number
  ): PredicadosFiltro {
    const condiciones: string[] = [];
    const valores: any[] = [];
    let p = paramInicial;

    if (filtros?.fecha_inicio) {
      condiciones.push(`${aliasCedula}.fecha_registro >= $${p}`);
      valores.push(filtros.fecha_inicio);
      p++;
    }
    if (filtros?.fecha_fin) {
      condiciones.push(`${aliasCedula}.fecha_registro <= $${p}`);
      valores.push(filtros.fecha_fin);
      p++;
    }
    if (filtros?.unidad_salud_id !== undefined && filtros?.unidad_salud_id !== null) {
      condiciones.push(`${aliasCedula}.unidad_salud_id = $${p}`);
      valores.push(filtros.unidad_salud_id);
      p++;
    }
    if (filtros?.localidad) {
      condiciones.push(
        `EXISTS (SELECT 1 FROM nucleo_direccion nd JOIN direccion d ` +
          `ON d.id_direccion = nd.direccion_id ` +
          `WHERE nd.nucleo_familiar_id = ${aliasCedula}.nucleo_familiar_id AND d.localidad = $${p})`
      );
      valores.push(filtros.localidad);
      p++;
    }

    return { condiciones, valores };
  }

  /**
   * Construye predicados §C de SOLO fecha (endpoints personales del entrevistador).
   */
  private construirFiltrosFecha(
    filtros: FiltrosFecha | undefined,
    aliasCedula: string,
    paramInicial: number
  ): PredicadosFiltro {
    const condiciones: string[] = [];
    const valores: any[] = [];
    let p = paramInicial;

    if (filtros?.fecha_inicio) {
      condiciones.push(`${aliasCedula}.fecha_registro >= $${p}`);
      valores.push(filtros.fecha_inicio);
      p++;
    }
    if (filtros?.fecha_fin) {
      condiciones.push(`${aliasCedula}.fecha_registro <= $${p}`);
      valores.push(filtros.fecha_fin);
      p++;
    }

    return { condiciones, valores };
  }

  // Auxiliar: resuelve el entrevistador asociado a un usuario (del JWT)
  async getEntrevistadorIdDeUsuario(idUsuario: number): Promise<number | null> {
    const query = `SELECT entrevistador_id FROM usuario WHERE id_usuario = $1`;
    const rows = await db.fetchRows(query, [idUsuario]);
    if (rows.length === 0 || rows[0].entrevistador_id === null || rows[0].entrevistador_id === undefined) {
      return null;
    }
    return rows[0].entrevistador_id;
  }

  // 1. Resumen de cédulas del entrevistador (solo filtro de fechas)
  async getMisCedulasResumen(entrevistadorId: number, filtros?: FiltrosFecha): Promise<MisCedulasResumenDTO> {
    // $1 = entrevistador; los filtros de fecha continúan el contador desde $2.
    const { condiciones, valores } = this.construirFiltrosFecha(filtros, "c", 2);
    const whereExtra = condiciones.length > 0 ? ` AND ${condiciones.join(" AND ")}` : "";
    const queryResumen = `
      SELECT
        COUNT(*) FILTER (WHERE c.fecha_registro = CURRENT_DATE)::int AS hoy,
        COUNT(*) FILTER (WHERE c.fecha_registro >= date_trunc('week', CURRENT_DATE))::int AS semana,
        COUNT(*) FILTER (WHERE c.fecha_registro >= date_trunc('month', CURRENT_DATE))::int AS mes,
        COUNT(*)::int AS total,
        MIN(c.fecha_registro)::text AS primera_cedula,
        MAX(c.fecha_registro)::text AS ultima_cedula
      FROM cedula c WHERE c.entrevistador_id = $1${whereExtra};
    `;
    const filas = await db.fetchRows(queryResumen, [entrevistadorId, ...valores]);
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

  // 2. Serie temporal de cédulas del entrevistador (últimos N días, solo filtro de fechas)
  async getMisCedulasSerie(entrevistadorId: number, dias: number, filtros?: FiltrosFecha): Promise<MisCedulasSerieDTO[]> {
    // $1 = entrevistador, $2 = dias; los filtros de fecha continúan desde $3.
    const { condiciones, valores } = this.construirFiltrosFecha(filtros, "c", 3);
    const whereExtra = condiciones.length > 0 ? ` AND ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT c.fecha_registro::text AS fecha, COUNT(*)::int AS total
      FROM cedula c
      WHERE c.entrevistador_id = $1 AND c.fecha_registro >= CURRENT_DATE - ($2::int - 1)${whereExtra}
      GROUP BY c.fecha_registro ORDER BY c.fecha_registro;
    `;
    return await db.fetchRows(query, [entrevistadorId, dias, ...valores]);
  }

  // 3. Cédulas del entrevistador agrupadas por estado (solo filtro de fechas)
  async getMisCedulasPorEstado(entrevistadorId: number, filtros?: FiltrosFecha): Promise<CedulasPorEstadoDTO[]> {
    // $1 = entrevistador; los filtros de fecha continúan desde $2.
    const { condiciones, valores } = this.construirFiltrosFecha(filtros, "c", 2);
    const whereExtra = condiciones.length > 0 ? ` AND ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT c.estado, COUNT(*)::int AS total FROM cedula c
      WHERE c.entrevistador_id = $1${whereExtra} GROUP BY c.estado;
    `;
    return await db.fetchRows(query, [entrevistadorId, ...valores]);
  }

  // 4. Resumen general (totales globales, con filtros §C)
  async getResumenGeneral(filtros?: FiltrosEstadisticas): Promise<ResumenGeneralDTO> {
    const hayFiltros = !!(
      filtros &&
      (filtros.fecha_inicio || filtros.fecha_fin ||
        (filtros.unidad_salud_id !== undefined && filtros.unidad_salud_id !== null) ||
        filtros.localidad)
    );

    // Sin filtros: comportamiento actual (conteos globales).
    if (!hayFiltros) {
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

    // Con filtros: los predicados §C se aplican sobre 'cedula c'. Como las
    // subconsultas se reutilizan, repetimos los predicados en cada EXISTS;
    // por simplicidad usamos un único conjunto de valores y placeholders
    // recalculando el rango de parámetros para cada bloque que los necesita.
    // Para evitar duplicar valores construimos el WHERE de cédula una sola vez
    // y armamos cada subconsulta con su propio offset de placeholders.
    const valores: any[] = [];

    // Helper local: agrega los predicados §C sobre el alias dado, empujando
    // valores y devolviendo el fragmento " AND ..." (o cláusula WHERE) ya numerado.
    const armarPredicados = (alias: string): string => {
      const { condiciones, valores: vals } = this.construirFiltrosCedula(
        filtros,
        alias,
        valores.length + 1
      );
      valores.push(...vals);
      return condiciones.join(" AND ");
    };

    const wCedula = armarPredicados("c");
    const wHoy = `c.fecha_registro = CURRENT_DATE AND ${armarPredicados("c")}`;
    const wMes = `c.fecha_registro >= date_trunc('month', CURRENT_DATE) AND ${armarPredicados("c")}`;
    const wViv = armarPredicados("c");
    const wNuc = armarPredicados("c");
    const wDosis = armarPredicados("c");
    const wPer = armarPredicados("c");

    const query = `
      SELECT
        (SELECT COUNT(*) FROM cedula c WHERE ${wCedula})::int AS total_cedulas,
        (SELECT COUNT(*) FROM persona p
           WHERE EXISTS (
             SELECT 1 FROM nucleo_persona np
             JOIN cedula c ON c.nucleo_familiar_id = np.nucleo_familiar_id
             WHERE np.persona_id = p.id_persona AND ${wPer}))::int AS total_personas,
        (SELECT COUNT(*) FROM vivienda v
           WHERE EXISTS (
             SELECT 1 FROM cedula c
             WHERE c.nucleo_familiar_id = v.nucleo_familiar_id AND ${wViv}))::int AS total_viviendas,
        (SELECT COUNT(*) FROM nucleo_familiar nf
           WHERE EXISTS (
             SELECT 1 FROM cedula c
             WHERE c.nucleo_familiar_id = nf.id_nucleo_familiar AND ${wNuc}))::int AS total_nucleos,
        (SELECT COUNT(*) FROM inmunizacion i
           WHERE EXISTS (
             SELECT 1 FROM cedula c
             WHERE c.id_cedula = i.cedula_id AND ${wDosis}))::int AS total_dosis,
        (SELECT COUNT(*) FROM entrevistador)::int AS total_entrevistadores,
        (SELECT COUNT(*) FROM cedula c WHERE ${wHoy})::int AS cedulas_hoy,
        (SELECT COUNT(*) FROM cedula c WHERE ${wMes})::int AS cedulas_mes;
    `;
    const filas = await db.fetchRows(query, valores);
    return filas[0];
  }

  // 5. Productividad por entrevistador (ranking)
  async getProductividadEntrevistadores(filtros?: FiltrosEstadisticas): Promise<ProductividadEntrevistadorDTO[]> {
    const { condiciones, valores } = this.construirFiltrosCedula(filtros, "c", 1);
    const whereExtra = condiciones.length > 0 ? ` WHERE ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT e.id_entrevistador, e.nombre, e.fecha_registro::text AS alta,
        COUNT(c.id_cedula)::int AS total,
        COUNT(c.id_cedula) FILTER (WHERE c.fecha_registro = CURRENT_DATE)::int AS hoy,
        COUNT(c.id_cedula) FILTER (WHERE c.fecha_registro >= date_trunc('week', CURRENT_DATE))::int AS semana,
        COUNT(c.id_cedula) FILTER (WHERE c.fecha_registro >= date_trunc('month', CURRENT_DATE))::int AS mes,
        MAX(c.fecha_registro)::text AS ultima_actividad
      FROM entrevistador e
      LEFT JOIN (SELECT * FROM cedula c ${whereExtra}) c ON c.entrevistador_id = e.id_entrevistador
      GROUP BY e.id_entrevistador, e.nombre, e.fecha_registro
      ORDER BY total DESC;
    `;
    return await db.fetchRows(query, valores);
  }

  // 6. Serie temporal global de cédulas agrupada por periodo
  async getCedulasSerie(periodo: PeriodoAgrupacion, filtros?: FiltrosEstadisticas): Promise<CedulasSerieDTO[]> {
    // periodo ya viene validado contra lista blanca ('day' | 'week' | 'month')
    const { condiciones, valores } = this.construirFiltrosCedula(filtros, "cedula", 2);
    const whereExtra = condiciones.length > 0 ? ` AND ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT to_char(date_trunc($1, fecha_registro), 'YYYY-MM-DD') AS periodo, COUNT(*)::int AS total
      FROM cedula
      WHERE 1=1 ${whereExtra}
      GROUP BY date_trunc($1, fecha_registro)
      ORDER BY date_trunc($1, fecha_registro);
    `;
    return await db.fetchRows(query, [periodo, ...valores]);
  }

  // 7. Cédulas globales agrupadas por estado
  async getCedulasPorEstado(filtros?: FiltrosEstadisticas): Promise<CedulasPorEstadoDTO[]> {
    const { condiciones, valores } = this.construirFiltrosCedula(filtros, "cedula", 1);
    const whereExtra = condiciones.length > 0 ? ` WHERE ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT estado, COUNT(*)::int AS total FROM cedula ${whereExtra} GROUP BY estado;
    `;
    return await db.fetchRows(query, valores);
  }

  // 8. Cédulas por unidad de salud
  async getCedulasPorUnidad(filtros?: FiltrosEstadisticas): Promise<CedulasPorUnidadDTO[]> {
    const { condiciones, valores } = this.construirFiltrosCedula(filtros, "c", 1);
    const whereExtra = condiciones.length > 0 ? ` WHERE ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT u.id_unidad_salud, u.nombre, COUNT(c.id_cedula)::int AS total
      FROM unidad_salud u
      LEFT JOIN (SELECT * FROM cedula c ${whereExtra}) c ON c.unidad_salud_id = u.id_unidad_salud
      GROUP BY u.id_unidad_salud, u.nombre ORDER BY total DESC;
    `;
    return await db.fetchRows(query, valores);
  }

  // 9. Cédulas por localidad
  async getCedulasPorLocalidad(filtros?: FiltrosEstadisticas): Promise<CedulasPorLocalidadDTO[]> {
    const { condiciones, valores } = this.construirFiltrosCedula(filtros, "c", 1);
    const whereExtra = condiciones.length > 0 ? ` WHERE ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT COALESCE(d.localidad, 'Sin localidad') AS localidad, COUNT(DISTINCT c.id_cedula)::int AS total
      FROM cedula c
      JOIN nucleo_direccion nd ON nd.nucleo_familiar_id = c.nucleo_familiar_id
      JOIN direccion d ON d.id_direccion = nd.direccion_id
      ${whereExtra}
      GROUP BY d.localidad ORDER BY total DESC;
    `;
    return await db.fetchRows(query, valores);
  }

  // 10. Cédulas por colonia (con filtros §C)
  async getCedulasPorColonia(filtros?: FiltrosEstadisticas): Promise<CedulasPorColoniaDTO[]> {
    const { condiciones, valores } = this.construirFiltrosCedula(filtros, "c", 1);
    const whereExtra = condiciones.length > 0 ? ` WHERE ${condiciones.join(" AND ")}` : "";
    const query = `
      SELECT COALESCE(d.colonia, 'Sin colonia') AS colonia, COUNT(DISTINCT c.id_cedula)::int AS total
      FROM cedula c
      JOIN nucleo_direccion nd ON nd.nucleo_familiar_id = c.nucleo_familiar_id
      JOIN direccion d ON d.id_direccion = nd.direccion_id
      ${whereExtra}
      GROUP BY d.colonia ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, valores);
    // colonia se cifra de forma DETERMINISTA -> el GROUP BY agrupa correctamente;
    // aquí se descifra la etiqueta para mostrar el nombre real de la colonia.
    return rows.map((r: any) => ({ ...r, colonia: decrypt(r.colonia, "direccion") }));
  }

  // 11. Histograma de tamaño de núcleos familiares (con filtros §C)
  async getNucleosTamano(filtros?: FiltrosEstadisticas): Promise<NucleosTamanoDTO[]> {
    const { condiciones, valores } = this.construirFiltrosCedula(filtros, "c", 1);
    const whereExtra = condiciones.length > 0 ? ` WHERE ${condiciones.join(" AND ")}` : "";
    const query = `
      WITH nucleos_tamano AS (
        SELECT c.nucleo_familiar_id, COUNT(np.persona_id) AS integrantes
        FROM cedula c
        JOIN nucleo_persona np ON np.nucleo_familiar_id = c.nucleo_familiar_id
        ${whereExtra}
        GROUP BY c.nucleo_familiar_id
      )
      SELECT integrantes AS tamano, COUNT(*)::int AS total
      FROM nucleos_tamano
      GROUP BY integrantes
      ORDER BY integrantes ASC;
    `;
    return await db.fetchRows(query, valores);
  }
}
