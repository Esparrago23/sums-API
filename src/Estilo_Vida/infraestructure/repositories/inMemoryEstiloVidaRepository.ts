import { EstiloVida } from '../../domain/entities/estiloVida';
import { IEstiloVidaRepository } from '../../domain/repositories/IEstiloVidaRepository';
import { db } from '../../../core/db_postgresql';

export class InMemoryEstiloVidaRepository implements IEstiloVidaRepository {
  async create(estiloVida: EstiloVida): Promise<EstiloVida> {
    const query = `
      INSERT INTO estilo_vida (persona_id, toxicomanias, enfermedades_cronicas, alimentacion, higiene_personal)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      estiloVida.persona_id,
      estiloVida.toxicomanias,
      estiloVida.enfermedades_cronicas,
      estiloVida.alimentacion,
      estiloVida.higiene_personal
    ];
    const result = await db.executePreparedQuery(query, values);
    return result.rows[0];
  }

  async update(estiloVida: EstiloVida): Promise<EstiloVida> {
    const query = `
      UPDATE estilo_vida
      SET persona_id = $1, toxicomanias = $2, enfermedades_cronicas = $3, alimentacion = $4, higiene_personal = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [
      estiloVida.persona_id,
      estiloVida.toxicomanias,
      estiloVida.enfermedades_cronicas,
      estiloVida.alimentacion,
      estiloVida.higiene_personal,
      estiloVida.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Estilo de vida not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<EstiloVida> {
    const query = `
      SELECT * FROM estilo_vida
      WHERE id = $1;
    `;
    const values = [id];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Estilo de vida not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    const query = `
      DELETE FROM estilo_vida
      WHERE id = $1;
    `;
    const values = [id];
    await db.executePreparedQuery(query, values);
  }

  async readAll(): Promise<EstiloVida[]> {
    const query = `
      SELECT * FROM estilo_vida;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
