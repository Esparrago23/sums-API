import { Vacunas } from '../../domain/entities/Vacunas';
import { IVacunasRepository } from '../../domain/repositories/IVacunasRepository';
import { db } from '../../../core/db_postgresql';

export class InMemoryVacunasRepository implements IVacunasRepository {
  async create(vacunas: Vacunas): Promise<Vacunas> {
    const query = `
      INSERT INTO vacuna (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING *, id_vacuna AS id;
    `;
    const values = [vacunas.nombre, vacunas.descripcion ?? null];
    const result = await db.executePreparedQuery(query, values);
    return result.rows[0];
  }

  async update(vacunas: Vacunas): Promise<Vacunas> {
    const query = `
      UPDATE vacuna
      SET nombre = $1,
          descripcion = $2
      WHERE id_vacuna = $3
      RETURNING *, id_vacuna AS id;
    `;
    const values = [vacunas.nombre, vacunas.descripcion ?? null, vacunas.id];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Vacuna not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<Vacunas> {
    const query = `
      SELECT *, id_vacuna AS id
      FROM vacuna
      WHERE id_vacuna = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Vacuna not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM vacuna WHERE id_vacuna = $1', [id]);
  }

  async readAll(): Promise<Vacunas[]> {
    const query = `
      SELECT *, id_vacuna AS id
      FROM vacuna
      ORDER BY nombre;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
