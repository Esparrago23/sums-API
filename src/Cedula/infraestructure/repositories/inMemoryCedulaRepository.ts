import { Cedula } from '../../domain/entities/cedula';
import { ICedulaRepository, PaginatedResult } from '../../domain/repositories/ICedulaRepository';
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
    await db.executePreparedQuery('DELETE FROM inmunizacion WHERE cedula_id = $1', [id]);
    await db.executePreparedQuery('DELETE FROM levantamiento_nucleo WHERE cedula_id = $1', [id]);
    await db.executePreparedQuery('DELETE FROM cedula WHERE id_cedula = $1', [id]);
  }

  async readAll(page: number, limit: number, search: string): Promise<PaginatedResult<Cedula>> {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    const values: any[] = [];
    
    if (search) {
      whereClause = `
        WHERE TRIM(CONCAT_WS(' ', p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno)) ILIKE $1
      `;
      values.push(`%${search}%`);
    }

    const query = `
      SELECT 
        c.*, 
        c.id_cedula AS id,
        TRIM(CONCAT_WS(' ', p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno)) AS informante_nombre
      FROM cedula c
      LEFT JOIN nucleo_familiar nf ON c.nucleo_familiar_id = nf.id_nucleo_familiar
      LEFT JOIN persona p ON nf.jefe_persona_id = p.id_persona
      ${whereClause}
      ORDER BY c.id_cedula DESC
      LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2};
    `;
    
    const queryParams = [...values, limit, offset];
    const result = await db.executePreparedQuery(query, queryParams);
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM cedula c
      LEFT JOIN nucleo_familiar nf ON c.nucleo_familiar_id = nf.id_nucleo_familiar
      LEFT JOIN persona p ON nf.jefe_persona_id = p.id_persona
      ${whereClause};
    `;
    const countResult = await db.executePreparedQuery(countQuery, values);
    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: result.rows.map((row: any) => this.mapCedula(row)),
      total,
      page,
      limit,
      totalPages
    };
  }

  private mapCedula(row: any): Cedula {
    row.fecha_registro = parseDBDate(row.fecha_registro);
    return row;
  }
}
