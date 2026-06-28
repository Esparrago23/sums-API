import { IestadisticasDemografia } from '../../domain/repositories/IestadisticasDemografia';
import {
  PiramidePoblacionalDTO,
  DistribucionGeneroDTO,
  DistribucionEscolaridadDTO,
  AlfabetizacionDTO,
  DistribucionLenguaDTO
} from '../../domain/entities/demografia';
import { db } from '../../../core/db_postgresql';

export class InMemoryEstadisticasDemografiaRepo implements IestadisticasDemografia {
  // 1. Pirámide poblacional (rango de edad x sexo)
  async getPiramidePoblacional(): Promise<PiramidePoblacionalDTO[]> {
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
      FROM persona
      GROUP BY rango_edad, sexo
      ORDER BY rango_edad;
    `;
    const rows = await db.fetchRows(query, []);
    return rows;
  }

  // 2. Distribución por género
  async getDistribucionGenero(): Promise<DistribucionGeneroDTO[]> {
    const query = `
      SELECT sexo, COUNT(*)::int AS total FROM persona GROUP BY sexo;
    `;
    const rows = await db.fetchRows(query, []);
    return rows;
  }

  // 3. Distribución por escolaridad
  async getDistribucionEscolaridad(): Promise<DistribucionEscolaridadDTO[]> {
    const query = `
      SELECT esc.nombre, COUNT(DISTINCT pe.persona_id)::int AS total
      FROM persona_escolaridad pe
      JOIN cat_escolaridad esc ON esc.id_escolaridad = pe.escolaridad_id
      GROUP BY esc.nombre ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, []);
    return rows;
  }

  // 4. Alfabetización (alfabetizados / no alfabetizados / sin dato)
  async getAlfabetizacion(): Promise<AlfabetizacionDTO> {
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE alfabetizacion IS TRUE)::int  AS alfabetizados,
        COUNT(*) FILTER (WHERE alfabetizacion IS FALSE)::int AS no_alfabetizados,
        COUNT(*) FILTER (WHERE alfabetizacion IS NULL)::int  AS sin_dato
      FROM persona;
    `;
    const rows = await db.fetchRows(query, []);
    return rows[0];
  }

  // 5. Distribución por lengua indígena
  async getDistribucionLengua(): Promise<DistribucionLenguaDTO[]> {
    const query = `
      SELECT l.nombre AS lengua, COUNT(DISTINCT pl.persona_id)::int AS total
      FROM persona_lengua pl
      JOIN cat_lengua l ON l.id_lengua = pl.lengua_id
      GROUP BY l.nombre ORDER BY total DESC;
    `;
    const rows = await db.fetchRows(query, []);
    return rows;
  }
}
