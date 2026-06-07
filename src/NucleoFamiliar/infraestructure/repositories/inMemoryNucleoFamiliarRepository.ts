import { NucleoFamiliar, NucleoPersona } from '../../domain/entities/nucleoFamiliar';
import { INucleoFamiliarRepository } from '../../domain/repositories/INucleoFamiliarRepository';
import { db } from '../../../core/db_postgresql';
import { parseDBDate } from '../../../core/date_utils';

export class InMemoryNucleoFamiliarRepository implements INucleoFamiliarRepository {
  async create(nucleo: NucleoFamiliar): Promise<NucleoFamiliar> {
    const query = `
      INSERT INTO nucleo_familiar (jefe_persona_id, fecha_registro, fecha_cierre, comentarios)
      VALUES ($1, COALESCE($2, NOW()), $3, $4)
      RETURNING *, id_nucleo_familiar AS id;
    `;
    const values = [
      nucleo.jefe_persona_id ?? null,
      nucleo.fecha_registro ?? null,
      nucleo.fecha_cierre ?? null,
      nucleo.comentarios ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return this.mapNucleo(result.rows[0]);
  }

  async readAll(): Promise<NucleoFamiliar[]> {
    const query = `
      SELECT *, id_nucleo_familiar AS id
      FROM nucleo_familiar
      ORDER BY id_nucleo_familiar;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: any) => this.mapNucleo(row));
  }

  async readById(id: number): Promise<NucleoFamiliar> {
    const query = `
      SELECT *, id_nucleo_familiar AS id
      FROM nucleo_familiar
      WHERE id_nucleo_familiar = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Nucleo familiar not found');
    }
    return this.mapNucleo(result.rows[0]);
  }

  async update(nucleo: NucleoFamiliar): Promise<NucleoFamiliar> {
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
      nucleo.jefe_persona_id ?? null,
      nucleo.fecha_registro ?? null,
      nucleo.fecha_cierre ?? null,
      nucleo.comentarios ?? null,
      nucleo.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Nucleo familiar not found');
    }
    return this.mapNucleo(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery(
      'DELETE FROM nucleo_familiar WHERE id_nucleo_familiar = $1',
      [id]
    );
  }

  async addPersona(nucleoPersona: NucleoPersona): Promise<NucleoPersona> {
    const query = `
      INSERT INTO nucleo_persona (
        nucleo_familiar_id, persona_id, parentesco_id, fecha_registro, fecha_salida, comentarios
      )
      VALUES ($1, $2, $3, COALESCE($4, NOW()), $5, $6)
      RETURNING *, id_nucleo_persona AS id;
    `;
    const values = [
      nucleoPersona.nucleo_familiar_id,
      nucleoPersona.persona_id,
      nucleoPersona.parentesco_id ?? null,
      nucleoPersona.fecha_registro ?? null,
      nucleoPersona.fecha_salida ?? null,
      nucleoPersona.comentarios ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return this.mapNucleoPersona(result.rows[0]);
  }

  async listIntegrantes(nucleoFamiliarId: number): Promise<NucleoPersona[]> {
    const query = `
      SELECT np.*, np.id_nucleo_persona AS id
      FROM nucleo_persona np
      WHERE np.nucleo_familiar_id = $1
      ORDER BY np.id_nucleo_persona;
    `;
    const result = await db.executePreparedQuery(query, [nucleoFamiliarId]);
    return result.rows.map((row: any) => this.mapNucleoPersona(row));
  }

  async updateIntegrante(
    nucleoFamiliarId: number,
    personaId: number,
    data: Partial<NucleoPersona>
  ): Promise<NucleoPersona> {
    const query = `
      UPDATE nucleo_persona
      SET parentesco_id = COALESCE($1, parentesco_id),
          fecha_salida = COALESCE($2, fecha_salida),
          comentarios = COALESCE($3, comentarios)
      WHERE nucleo_familiar_id = $4 AND persona_id = $5
      RETURNING *, id_nucleo_persona AS id;
    `;
    const values = [
      data.parentesco_id ?? null,
      data.fecha_salida ?? null,
      data.comentarios ?? null,
      nucleoFamiliarId,
      personaId
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Integrante del nucleo no encontrado');
    }
    return this.mapNucleoPersona(result.rows[0]);
  }

  private mapNucleo(row: any): NucleoFamiliar {
    row.fecha_registro = parseDBDate(row.fecha_registro);
    row.fecha_cierre = parseDBDate(row.fecha_cierre);
    return row;
  }

  private mapNucleoPersona(row: any): NucleoPersona {
    row.fecha_registro = parseDBDate(row.fecha_registro);
    row.fecha_salida = parseDBDate(row.fecha_salida);
    return row;
  }
}
