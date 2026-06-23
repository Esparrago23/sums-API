import { Direccion } from '../../domain/entities/direccion';
import { IDireccionRepository } from '../../domain/repository/IDireccionRepository';
import { db } from '../../../core/db_postgresql';

export class InMemoryDireccionRepository implements IDireccionRepository {
  async create(direccion: Direccion): Promise<Direccion> {
    const query = `
      INSERT INTO direccion (
        calle, numero_exterior, numero_interior, colonia, codigo_postal,
        localidad, manzana, vivienda_referencia, asentamiento_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *, id_direccion AS id;
    `;
    const values = [
      direccion.calle ?? null,
      direccion.numero_exterior ?? null,
      direccion.numero_interior ?? null,
      direccion.colonia ?? null,
      direccion.codigo_postal ?? null,
      direccion.localidad ?? null,
      direccion.manzana ?? null,
      direccion.vivienda_referencia ?? null,
      direccion.asentamiento_id ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return result.rows[0];
  }

  async update(direccion: Direccion): Promise<Direccion> {
    const query = `
      UPDATE direccion
      SET calle = $1,
          numero_exterior = $2,
          numero_interior = $3,
          colonia = $4,
          codigo_postal = $5,
          localidad = $6,
          manzana = $7,
          vivienda_referencia = $8,
          asentamiento_id = $9
      WHERE id_direccion = $10
      RETURNING *, id_direccion AS id;
    `;
    const values = [
      direccion.calle ?? null,
      direccion.numero_exterior ?? null,
      direccion.numero_interior ?? null,
      direccion.colonia ?? null,
      direccion.codigo_postal ?? null,
      direccion.localidad ?? null,
      direccion.manzana ?? null,
      direccion.vivienda_referencia ?? null,
      direccion.asentamiento_id ?? null,
      direccion.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Direccion not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<Direccion> {
    const query = `
      SELECT *, id_direccion AS id
      FROM direccion
      WHERE id_direccion = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Direccion not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM direccion WHERE id_direccion = $1', [id]);
  }

  async readAll(): Promise<Direccion[]> {
    const query = `
      SELECT *, id_direccion AS id
      FROM direccion
      ORDER BY id_direccion;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
