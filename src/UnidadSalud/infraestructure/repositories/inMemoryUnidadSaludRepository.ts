import { UnidadSalud } from "../../domain/entities/UnidadSalud";
import { IUnidadSaludRepository } from "../../domain/repositories/IUnidadSaludRepository";
import { db } from "../../../core/db_postgresql";

export class InMemoryUnidadSaludRepository implements IUnidadSaludRepository {
  async create(unidadSalud: UnidadSalud): Promise<UnidadSalud> {
    const query = `
      INSERT INTO unidad_salud (clues, nombre, distrito, municipio_id, numero_nucleos)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *, id_unidad_salud AS id;
    `;
    const values = [
      unidadSalud.clues,
      unidadSalud.nombre,
      unidadSalud.distrito ?? null,
      unidadSalud.municipio_id ?? null,
      unidadSalud.numero_nucleos ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return result.rows[0];
  }

  async update(unidadSalud: UnidadSalud): Promise<UnidadSalud> {
    const query = `
      UPDATE unidad_salud
      SET clues = $1,
          nombre = $2,
          distrito = $3,
          municipio_id = $4,
          numero_nucleos = $5
      WHERE id_unidad_salud = $6
      RETURNING *, id_unidad_salud AS id;
    `;
    const values = [
      unidadSalud.clues,
      unidadSalud.nombre,
      unidadSalud.distrito ?? null,
      unidadSalud.municipio_id ?? null,
      unidadSalud.numero_nucleos ?? null,
      unidadSalud.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('UnidadSalud not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<UnidadSalud> {
    const query = `
      SELECT *, id_unidad_salud AS id
      FROM unidad_salud
      WHERE id_unidad_salud = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('UnidadSalud not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM unidad_salud WHERE id_unidad_salud = $1', [id]);
  }

  async readAll(): Promise<UnidadSalud[]> {
    const query = `
      SELECT *, id_unidad_salud AS id
      FROM unidad_salud
      ORDER BY id_unidad_salud;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
