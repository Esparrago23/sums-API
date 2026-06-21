import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepositoy';
import { db } from '../../../core/db_postgresql';
import { parseDBDate } from '../../../core/date_utils';
import { comparePassword } from '../services/bcrypt';

export class InMemoryUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO usuario (
        nombre_usuario, contrasena, rol_id, fecha_registro, activo,
        unidad_salud_id, datos_laborales_id, entrevistador_id
      )
      VALUES ($1, $2, $3, NOW(), COALESCE($4, true), $5, $6, $7)
      RETURNING *, id_usuario AS id;
    `;
    const values = [
      user.nombre_usuario,
      user.contrasena,
      user.rol_id,
      user.activo,
      user.unidad_salud_id ?? null,
      user.datos_laborales_id ?? null,
      user.entrevistador_id ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return this.mapUser(result.rows[0]);
  }

  async update(user: User): Promise<User> {
    const query = `
      UPDATE usuario
      SET nombre_usuario = $1,
          contrasena = $2,
          rol_id = $3,
          activo = $4,
          unidad_salud_id = $5,
          datos_laborales_id = $6,
          entrevistador_id = $7
      WHERE id_usuario = $8
      RETURNING *, id_usuario AS id;
    `;
    const values = [
      user.nombre_usuario,
      user.contrasena,
      user.rol_id,
      user.activo,
      user.unidad_salud_id ?? null,
      user.datos_laborales_id ?? null,
      user.entrevistador_id ?? null,
      user.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    return this.mapUser(result.rows[0]);
  }

  async readById(id: number): Promise<User> {
    const query = `
      SELECT *, id_usuario AS id
      FROM usuario
      WHERE id_usuario = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    return this.mapUser(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM usuario WHERE id_usuario = $1', [id]);
  }

  async readAll(): Promise<User[]> {
    const query = `
      SELECT *, id_usuario AS id
      FROM usuario
      ORDER BY id_usuario;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: any) => this.mapUser(row));
  }

  async findByCredentials(nombre_usuario: string, contrasena: string): Promise<User | null> {
    const query = `
      SELECT *, id_usuario AS id
      FROM usuario
      WHERE nombre_usuario = $1 AND COALESCE(activo, true) = true;
    `;
    const result = await db.executePreparedQuery(query, [nombre_usuario]);
    if (result.rowCount === 0) {
      return null;
    }

    const user = result.rows[0];
    const isPasswordValid = await comparePassword(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return null;
    }

    return this.mapUser(user);
  }

  private mapUser(row: any): User {
    row.fecha_registro = parseDBDate(row.fecha_registro);
    return row;
  }
}
