import { Familia } from '../../domain/entities/familia';
import { IFamiliaRepository } from '../../domain/repositories/IFamiliaRepository';
import { db } from '../../../core/db_postgresql';
import { parseDBDate } from '../../../core/date_utils';

export class InMemoryFamiliaRepository implements IFamiliaRepository {
  async create(familia: Familia): Promise<Familia> {
    const query = `
      INSERT INTO nucleo_familiar (jefe_persona_id, fecha_registro, fecha_cierre, comentarios)
      VALUES ($1, COALESCE($2, NOW()), $3, $4)
      RETURNING *, id_nucleo_familiar AS id;
    `;
    const values = [
      familia.jefe_persona_id ?? null,
      familia.fecha_registro ?? null,
      familia.fecha_cierre ?? null,
      familia.comentarios ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return this.mapFamilia(result.rows[0]);
  }

  async update(familia: Familia): Promise<Familia> {
    const query = `
      UPDATE nucleo_familiar
      SET jefe_persona_id = $1,
          fecha_registro = $2,
          fecha_cierre = $3,
          comentarios = $4
      WHERE id_nucleo_familiar = $5
      RETURNING *, id_nucleo_familiar AS id;
    `;
    const values = [
      familia.jefe_persona_id ?? null,
      familia.fecha_registro ?? null,
      familia.fecha_cierre ?? null,
      familia.comentarios ?? null,
      familia.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Nucleo familiar not found');
    }
    return this.mapFamilia(result.rows[0]);
  }

  async readById(id: number): Promise<Familia> {
    const query = `
      SELECT *, id_nucleo_familiar AS id
      FROM nucleo_familiar
      WHERE id_nucleo_familiar = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Nucleo familiar not found');
    }
    return this.mapFamilia(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery(
      'DELETE FROM nucleo_familiar WHERE id_nucleo_familiar = $1',
      [id]
    );
  }

  async readAll(): Promise<Familia[]> {
    const query = `
      SELECT *, id_nucleo_familiar AS id
      FROM nucleo_familiar
      ORDER BY id_nucleo_familiar;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: any) => this.mapFamilia(row));
  }

  private mapFamilia(row: any): Familia {
    row.fecha_registro = parseDBDate(row.fecha_registro);
    row.fecha_cierre = parseDBDate(row.fecha_cierre);
    return row;
  }
}
