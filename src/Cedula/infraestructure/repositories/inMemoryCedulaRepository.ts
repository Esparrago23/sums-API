import { Cedula } from '../../domain/entities/cedula';
import { ICedulaRepository } from '../../domain/repositories/ICedulaRepository';
import { db } from '../../../core/db_postgresql';
import { formatDateForDB, parseDBDate } from '../../../core/date_utils';

export class InMemoryCedulaRepository implements ICedulaRepository {
  async create(cedula: Cedula): Promise<Cedula> {
    const query = `
      INSERT INTO cedula (
        unidad_salud_id, entrevistador_id, levantamiento_id, nucleo_familiar_id,
        fecha_registro, estado, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *, id_cedula AS id;
    `;
    const values = [
      cedula.unidad_salud_id,
      cedula.entrevistador_id,
      cedula.levantamiento_id ?? null,
      cedula.nucleo_familiar_id,
      formatDateForDB(cedula.fecha_registro),
      cedula.estado,
      cedula.observaciones ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return this.mapCedula(result.rows[0]);
  }

  async update(cedula: Cedula): Promise<Cedula> {
    const query = `
      UPDATE cedula
      SET unidad_salud_id = $1,
          entrevistador_id = $2,
          levantamiento_id = $3,
          nucleo_familiar_id = $4,
          fecha_registro = $5,
          estado = $6,
          observaciones = $7
      WHERE id_cedula = $8
      RETURNING *, id_cedula AS id;
    `;
    const values = [
      cedula.unidad_salud_id,
      cedula.entrevistador_id,
      cedula.levantamiento_id ?? null,
      cedula.nucleo_familiar_id,
      formatDateForDB(cedula.fecha_registro),
      cedula.estado,
      cedula.observaciones ?? null,
      cedula.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Cedula not found');
    }
    return this.mapCedula(result.rows[0]);
  }

  async readById(id: number): Promise<Cedula> {
    const query = `
      SELECT *, id_cedula AS id
      FROM cedula
      WHERE id_cedula = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Cedula not found');
    }
    return this.mapCedula(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM cedula WHERE id_cedula = $1', [id]);
  }

  async readAll(): Promise<Cedula[]> {
    const query = `
      SELECT *, id_cedula AS id
      FROM cedula
      ORDER BY id_cedula;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: any) => this.mapCedula(row));
  }

  private mapCedula(row: any): Cedula {
    row.fecha_registro = parseDBDate(row.fecha_registro);
    return row;
  }
}
