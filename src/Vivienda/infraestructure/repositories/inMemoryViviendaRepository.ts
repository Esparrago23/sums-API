import { Vivienda } from '../../domain/entities/vivienda';
import { IViviendaRepository } from '../../domain/repositories/IViviendaRepository';
import { db } from '../../../core/db_postgresql';

export class InMemoryViviendaRepository implements IViviendaRepository {
  async create(vivienda: Vivienda): Promise<Vivienda> {
    const query = `
      INSERT INTO vivienda (
        nucleo_familiar_id, direccion_id, numero_cuartos, numero_habitantes,
        cocina_ubicacion, cocina_con_lena, manejo_excretas_id, red_alcantarillado,
        fosa_septica, comentarios
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *, id_vivienda AS id;
    `;
    const values = [
      vivienda.nucleo_familiar_id,
      vivienda.direccion_id ?? null,
      vivienda.numero_cuartos ?? null,
      vivienda.numero_habitantes ?? null,
      vivienda.cocina_ubicacion ?? null,
      vivienda.cocina_con_lena ?? null,
      vivienda.manejo_excretas_id ?? null,
      vivienda.red_alcantarillado ?? null,
      vivienda.fosa_septica ?? null,
      vivienda.comentarios ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return result.rows[0];
  }

  async update(vivienda: Vivienda): Promise<Vivienda> {
    const query = `
      UPDATE vivienda
      SET nucleo_familiar_id = $1,
          direccion_id = $2,
          numero_cuartos = $3,
          numero_habitantes = $4,
          cocina_ubicacion = $5,
          cocina_con_lena = $6,
          manejo_excretas_id = $7,
          red_alcantarillado = $8,
          fosa_septica = $9,
          comentarios = $10
      WHERE id_vivienda = $11
      RETURNING *, id_vivienda AS id;
    `;
    const values = [
      vivienda.nucleo_familiar_id,
      vivienda.direccion_id ?? null,
      vivienda.numero_cuartos ?? null,
      vivienda.numero_habitantes ?? null,
      vivienda.cocina_ubicacion ?? null,
      vivienda.cocina_con_lena ?? null,
      vivienda.manejo_excretas_id ?? null,
      vivienda.red_alcantarillado ?? null,
      vivienda.fosa_septica ?? null,
      vivienda.comentarios ?? null,
      vivienda.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Vivienda not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<Vivienda> {
    const query = `
      SELECT *, id_vivienda AS id
      FROM vivienda
      WHERE id_vivienda = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Vivienda not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM vivienda WHERE id_vivienda = $1', [id]);
  }

  async readAll(): Promise<Vivienda[]> {
    const query = `
      SELECT *, id_vivienda AS id
      FROM vivienda
      ORDER BY id_vivienda;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
