import { Entrevistador } from '../../domain/entities/entrevistador';
import { IEntrevistadorRepository } from '../../domain/repositories/IEntrevistadorRepository';
import { db } from '../../../core/db_postgresql';
import { formatDateForDB, parseDBDate } from '../../../core/date_utils';

export class InMemoryEntrevistadorRepository implements IEntrevistadorRepository {
  async create(entrevistador: Entrevistador): Promise<Entrevistador> {
    const query = `
      INSERT INTO entrevistador (nombre, unidad_salud_id, datos_laborales_id, fecha_registro)
      VALUES ($1, $2, $3, $4)
      RETURNING *, id_entrevistador AS id;
    `;
    const values = [
      entrevistador.nombre,
      entrevistador.unidad_salud_id,
      entrevistador.datos_laborales_id ?? null,
      formatDateForDB(entrevistador.fecha_registro)
    ];
    const result = await db.executePreparedQuery(query, values);
    return this.mapEntrevistador(result.rows[0]);
  }

  async update(entrevistador: Entrevistador): Promise<Entrevistador> {
    const query = `
      UPDATE entrevistador
      SET nombre = $1,
          unidad_salud_id = $2,
          datos_laborales_id = $3,
          fecha_registro = $4
      WHERE id_entrevistador = $5
      RETURNING *, id_entrevistador AS id;
    `;
    const values = [
      entrevistador.nombre,
      entrevistador.unidad_salud_id,
      entrevistador.datos_laborales_id ?? null,
      formatDateForDB(entrevistador.fecha_registro),
      entrevistador.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Entrevistador not found');
    }
    return this.mapEntrevistador(result.rows[0]);
  }

  async readById(id: number): Promise<Entrevistador | null> {
    const query = `
      SELECT *, id_entrevistador AS id
      FROM entrevistador
      WHERE id_entrevistador = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      return null;
    }
    return this.mapEntrevistador(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM entrevistador WHERE id_entrevistador = $1', [id]);
  }

  async readAll(): Promise<Entrevistador[]> {
    const query = `
      SELECT *, id_entrevistador AS id
      FROM entrevistador
      ORDER BY id_entrevistador;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: any) => this.mapEntrevistador(row));
  }

  private mapEntrevistador(row: any): Entrevistador {
    row.fecha_registro = parseDBDate(row.fecha_registro);
    return row;
  }
}
