import { db } from '../core/db_postgresql';

export interface CrudConfig {
  tableName: string;
  idColumn: string;
  writableColumns: string[];
}

export class SqlCrudRepository<T extends Record<string, unknown>> {
  constructor(private config: CrudConfig) {}

  async create(data: Partial<T>): Promise<T> {
    const payload = this.pickWritable(data);
    const columns = Object.keys(payload);

    if (columns.length === 0) {
      throw new Error('No hay campos validos para crear el registro');
    }

    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    const query = `
      INSERT INTO ${this.config.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await db.executePreparedQuery(query, Object.values(payload));
    return this.normalizeId(result.rows[0]);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const payload = this.pickWritable(data);
    const columns = Object.keys(payload);

    if (columns.length === 0) {
      throw new Error('No hay campos validos para actualizar el registro');
    }

    const assignments = columns.map((column, index) => `${column} = $${index + 1}`).join(', ');
    const query = `
      UPDATE ${this.config.tableName}
      SET ${assignments}
      WHERE ${this.config.idColumn} = $${columns.length + 1}
      RETURNING *;
    `;

    const result = await db.executePreparedQuery(query, [...Object.values(payload), id]);
    if (result.rowCount === 0) {
      throw new Error('Registro no encontrado');
    }

    return this.normalizeId(result.rows[0]);
  }

  async readById(id: number): Promise<T> {
    const query = `
      SELECT *, ${this.config.idColumn} AS id
      FROM ${this.config.tableName}
      WHERE ${this.config.idColumn} = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Registro no encontrado');
    }
    return this.normalizeId(result.rows[0]);
  }

  async readAll(): Promise<T[]> {
    const query = `
      SELECT *, ${this.config.idColumn} AS id
      FROM ${this.config.tableName}
      ORDER BY ${this.config.idColumn};
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: T) => this.normalizeId(row));
  }

  async delete(id: number): Promise<void> {
    const query = `
      DELETE FROM ${this.config.tableName}
      WHERE ${this.config.idColumn} = $1;
    `;
    await db.executePreparedQuery(query, [id]);
  }

  private pickWritable(data: Partial<T>): Record<string, unknown> {
    return this.config.writableColumns.reduce<Record<string, unknown>>((payload, column) => {
      const value = data[column];
      if (value !== undefined) {
        payload[column] = value;
      }
      return payload;
    }, {});
  }

  private normalizeId(row: T): T {
    return {
      ...row,
      id: row[this.config.idColumn] ?? row.id,
    } as T;
  }
}
