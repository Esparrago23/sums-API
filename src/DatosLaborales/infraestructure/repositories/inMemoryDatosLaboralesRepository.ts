import { DatosLaborales } from '../../domain/entities/datosLaborales';
import { IDatosLaboralesRepository } from '../../domain/repositories/IDatosLaboralesRepository';
import { db } from '../../../core/db_postgresql';

export class InMemoryDatosLaboralesRepository implements IDatosLaboralesRepository {
  async create(datosLaborales: DatosLaborales): Promise<DatosLaborales> {
    const query = `
      INSERT INTO datos_laborales (turno_id, horario_inicio, horario_fin, cargo, especialidad)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *, id_datos_laborales AS id;
    `;
    const values = [
      datosLaborales.turno_id ?? null,
      datosLaborales.horario_inicio ?? null,
      datosLaborales.horario_fin ?? null,
      datosLaborales.cargo ?? null,
      datosLaborales.especialidad ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return result.rows[0];
  }

  async update(datosLaborales: DatosLaborales): Promise<DatosLaborales> {
    const query = `
      UPDATE datos_laborales
      SET turno_id = $1,
          horario_inicio = $2,
          horario_fin = $3,
          cargo = $4,
          especialidad = $5
      WHERE id_datos_laborales = $6
      RETURNING *, id_datos_laborales AS id;
    `;
    const values = [
      datosLaborales.turno_id ?? null,
      datosLaborales.horario_inicio ?? null,
      datosLaborales.horario_fin ?? null,
      datosLaborales.cargo ?? null,
      datosLaborales.especialidad ?? null,
      datosLaborales.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('DatosLaborales not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<DatosLaborales> {
    const query = `
      SELECT *, id_datos_laborales AS id
      FROM datos_laborales
      WHERE id_datos_laborales = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('DatosLaborales not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM datos_laborales WHERE id_datos_laborales = $1', [id]);
  }

  async readAll(): Promise<DatosLaborales[]> {
    const query = `
      SELECT *, id_datos_laborales AS id
      FROM datos_laborales
      ORDER BY id_datos_laborales;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
