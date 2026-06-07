import { Dosis } from '../../domain/entities/Dosis';
import { IDosisRepository } from '../../domain/repositories/IDosisRepository';
import { db } from '../../../core/db_postgresql';

export class InMemoryDosisRepository implements IDosisRepository {
  async create(dosis: Dosis): Promise<Dosis> {
    const query = `
      INSERT INTO cat_dosis (nombre)
      VALUES ($1)
      RETURNING *, id_dosis AS id;
    `;
    const result = await db.executePreparedQuery(query, [dosis.nombre]);
    return result.rows[0];
  }

  async update(dosis: Dosis): Promise<Dosis> {
    const query = `
      UPDATE cat_dosis
      SET nombre = $1
      WHERE id_dosis = $2
      RETURNING *, id_dosis AS id;
    `;
    const result = await db.executePreparedQuery(query, [dosis.nombre, dosis.id]);
    if (result.rowCount === 0) {
      throw new Error('Dosis not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<Dosis> {
    const query = `
      SELECT *, id_dosis AS id
      FROM cat_dosis
      WHERE id_dosis = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Dosis not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM cat_dosis WHERE id_dosis = $1', [id]);
  }

  async readAll(): Promise<Dosis[]> {
    const query = `
      SELECT *, id_dosis AS id
      FROM cat_dosis
      ORDER BY id_dosis;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
