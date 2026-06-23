import { Vacunacion } from '../../domain/entities/vacunacion';
import { Ivacunacion } from '../../domain/repositories/Ivacunacion';
import {
  AplicacionesPorAnioVacunaDTO,
  DosisPorPersonaDTO,
  PersonasVacunadasPorVacunaDTO,
  VacunaDosisAplicacionDTO,
  VacunacionPorRangoEdadDTO,
  VacunacionPorSexoDTO
} from '../../domain/entities/consultas';
import { db } from '../../../core/db_postgresql';
import { formatDateForDB, parseDBDate } from '../../../core/date_utils';

export class InMemoryVacunacionRepo implements Ivacunacion {
  async create(vacunacion: Vacunacion): Promise<Vacunacion> {
    const esquemaId = vacunacion.esquema_vacunacion_id ?? await this.createEsquemaFromLegacyPayload(vacunacion);
    const query = `
      INSERT INTO inmunizacion (
        esquema_vacunacion_id, cedula_id, vacuna_id, dosis_id,
        otra_vacuna_especificar, fecha_aplicacion
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *, id_inmunizacion AS id;
    `;
    const values = [
      esquemaId,
      vacunacion.cedula_id ?? null,
      vacunacion.vacuna_id,
      vacunacion.dosis_id ?? null,
      vacunacion.otra_vacuna_especificar ?? null,
      formatDateForDB(vacunacion.fecha_aplicacion)
    ];
    const result = await db.executePreparedQuery(query, values);
    return this.mapVacunacion(result.rows[0]);
  }

  async update(vacunacion: Vacunacion): Promise<Vacunacion> {
    const query = `
      UPDATE inmunizacion
      SET esquema_vacunacion_id = $1,
          cedula_id = $2,
          vacuna_id = $3,
          dosis_id = $4,
          otra_vacuna_especificar = $5,
          fecha_aplicacion = $6
      WHERE id_inmunizacion = $7
      RETURNING *, id_inmunizacion AS id;
    `;
    const values = [
      vacunacion.esquema_vacunacion_id,
      vacunacion.cedula_id ?? null,
      vacunacion.vacuna_id,
      vacunacion.dosis_id ?? null,
      vacunacion.otra_vacuna_especificar ?? null,
      formatDateForDB(vacunacion.fecha_aplicacion),
      vacunacion.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Vacunacion no encontrada');
    }
    return this.mapVacunacion(result.rows[0]);
  }

  async readById(id: number): Promise<Vacunacion> {
    const query = `
      SELECT i.*, i.id_inmunizacion AS id
      FROM inmunizacion i
      WHERE i.id_inmunizacion = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Vacunacion no encontrada');
    }
    return this.mapVacunacion(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM inmunizacion WHERE id_inmunizacion = $1', [id]);
  }

  async readAll(): Promise<Vacunacion[]> {
    const query = `
      SELECT i.*, i.id_inmunizacion AS id
      FROM inmunizacion i
      ORDER BY i.id_inmunizacion;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: any) => this.mapVacunacion(row));
  }

  async getAplicacionesPorVacunaYDosis(): Promise<VacunaDosisAplicacionDTO[]> {
    const query = `
      SELECT
        v.nombre AS vacuna,
        d.nombre AS tipo_dosis,
        COUNT(*)::int AS total_aplicaciones
      FROM inmunizacion i
      JOIN vacuna v ON i.vacuna_id = v.id_vacuna
      LEFT JOIN cat_dosis d ON i.dosis_id = d.id_dosis
      GROUP BY v.nombre, d.nombre
      ORDER BY v.nombre, d.nombre;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }

  async getAplicacionesPorPersona(personaId: number): Promise<VacunaDosisAplicacionDTO[]> {
    const query = `
      SELECT
        v.nombre AS vacuna,
        d.nombre AS tipo_dosis,
        COUNT(*)::int AS total_aplicaciones
      FROM inmunizacion i
      JOIN esquema_vacunacion ev ON i.esquema_vacunacion_id = ev.id_esquema_vacunacion
      JOIN vacuna v ON i.vacuna_id = v.id_vacuna
      LEFT JOIN cat_dosis d ON i.dosis_id = d.id_dosis
      WHERE ev.persona_id = $1
      GROUP BY v.nombre, d.nombre
      ORDER BY v.nombre, d.nombre;
    `;
    const result = await db.executePreparedQuery(query, [personaId]);
    return result.rows;
  }

  async getPersonasVacunadasPorVacuna(): Promise<PersonasVacunadasPorVacunaDTO[]> {
    const query = `
      SELECT
        v.nombre AS vacuna,
        COUNT(DISTINCT ev.persona_id)::int AS personas_vacunadas
      FROM inmunizacion i
      JOIN esquema_vacunacion ev ON i.esquema_vacunacion_id = ev.id_esquema_vacunacion
      JOIN vacuna v ON i.vacuna_id = v.id_vacuna
      GROUP BY v.nombre
      ORDER BY v.nombre;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }

  async getAplicacionesPorAnioYVacuna(): Promise<AplicacionesPorAnioVacunaDTO[]> {
    const query = `
      SELECT
        EXTRACT(YEAR FROM i.fecha_aplicacion)::int AS anio,
        v.nombre AS vacuna,
        COUNT(*)::int AS total
      FROM inmunizacion i
      JOIN vacuna v ON i.vacuna_id = v.id_vacuna
      GROUP BY anio, v.nombre
      ORDER BY anio, v.nombre;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }

  async getVacunacionPorSexo(): Promise<VacunacionPorSexoDTO[]> {
    const query = `
      SELECT
        p.sexo,
        v.nombre AS vacuna,
        COUNT(*)::int AS total_aplicaciones
      FROM inmunizacion i
      JOIN esquema_vacunacion ev ON i.esquema_vacunacion_id = ev.id_esquema_vacunacion
      JOIN persona p ON ev.persona_id = p.id_persona
      JOIN vacuna v ON i.vacuna_id = v.id_vacuna
      GROUP BY p.sexo, v.nombre
      ORDER BY p.sexo, v.nombre;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }

  async getVacunacionPorRangoEdad(): Promise<VacunacionPorRangoEdadDTO[]> {
    const query = `
      SELECT
        CASE
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 18 THEN 'Menores de edad'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) BETWEEN 18 AND 49 THEN 'Adultos'
          ELSE 'Adultos mayores'
        END AS rango_edad,
        v.nombre AS vacuna,
        COUNT(*)::int AS total_aplicaciones
      FROM inmunizacion i
      JOIN esquema_vacunacion ev ON i.esquema_vacunacion_id = ev.id_esquema_vacunacion
      JOIN persona p ON ev.persona_id = p.id_persona
      JOIN vacuna v ON i.vacuna_id = v.id_vacuna
      GROUP BY rango_edad, v.nombre
      ORDER BY rango_edad, v.nombre;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }

  async getDosisAplicadasPorPersona(): Promise<DosisPorPersonaDTO[]> {
    const query = `
      SELECT
        CONCAT_WS(' ', p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno) AS nombre_completo,
        COUNT(*)::int AS total_dosis_aplicadas
      FROM inmunizacion i
      JOIN esquema_vacunacion ev ON i.esquema_vacunacion_id = ev.id_esquema_vacunacion
      JOIN persona p ON ev.persona_id = p.id_persona
      GROUP BY p.id_persona
      ORDER BY total_dosis_aplicadas DESC;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }

  private async createEsquemaFromLegacyPayload(vacunacion: Vacunacion): Promise<number> {
    if (!vacunacion.persona_id) {
      throw new Error('esquema_vacunacion_id es requerido si no se envia persona_id');
    }

    const query = `
      INSERT INTO esquema_vacunacion (persona_id, unidad_salud_id, fecha_registro)
      VALUES ($1, $2, NOW())
      RETURNING id_esquema_vacunacion;
    `;
    const result = await db.executePreparedQuery(query, [
      vacunacion.persona_id,
      vacunacion.unidad_salud_id ?? null
    ]);
    return result.rows[0].id_esquema_vacunacion;
  }

  private mapVacunacion(row: any): Vacunacion {
    row.fecha_aplicacion = parseDBDate(row.fecha_aplicacion);
    return row;
  }
}
