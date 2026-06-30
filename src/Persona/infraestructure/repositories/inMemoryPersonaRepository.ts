import { Persona } from '../../domain/entities/Persona';
import { IPersonaRepository } from '../../domain/repositories/IPersonaRepository';
import { db } from '../../../core/db_postgresql';
import { formatDateForDB, parseDBDate } from '../../../core/date_utils';
import { encryptValue, decryptRow } from '../../../shared/security/sensitiveFields';

export class InMemoryPersonaRepository implements IPersonaRepository {
  async create(persona: Persona): Promise<Persona> {
    const query = `
      INSERT INTO persona (
        primer_nombre, segundo_nombre, apellido_paterno, apellido_materno,
        fecha_nacimiento, sexo, estado_civil_id, alfabetizacion, fecha_registro
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, NOW()))
      RETURNING *;
    `;
    const values = [
      encryptValue('persona', 'primer_nombre', persona.primer_nombre),
      encryptValue('persona', 'segundo_nombre', persona.segundo_nombre),
      encryptValue('persona', 'apellido_paterno', persona.apellido_paterno),
      encryptValue('persona', 'apellido_materno', persona.apellido_materno),
      formatDateForDB(persona.fecha_nacimiento),
      persona.sexo,
      persona.estado_civil_id,
      persona.alfabetizacion,
      persona.fecha_registro ?? null
    ];

    const result = await db.executePreparedQuery(query, values);
    const personaId = result.rows[0].id_persona;
    await this.replaceCatalogLinks(personaId, persona);
    return this.readById(personaId);
  }

  async update(persona: Persona): Promise<Persona> {
    const query = `
      UPDATE persona
      SET primer_nombre = $1,
          segundo_nombre = $2,
          apellido_paterno = $3,
          apellido_materno = $4,
          fecha_nacimiento = $5,
          sexo = $6,
          estado_civil_id = $7,
          alfabetizacion = $8
      WHERE id_persona = $9
      RETURNING *;
    `;
    const values = [
      encryptValue('persona', 'primer_nombre', persona.primer_nombre),
      encryptValue('persona', 'segundo_nombre', persona.segundo_nombre),
      encryptValue('persona', 'apellido_paterno', persona.apellido_paterno),
      encryptValue('persona', 'apellido_materno', persona.apellido_materno),
      formatDateForDB(persona.fecha_nacimiento),
      persona.sexo,
      persona.estado_civil_id,
      persona.alfabetizacion,
      persona.id
    ];

    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Persona not found');
    }

    await this.replaceCatalogLinks(persona.id, persona);
    return this.readById(persona.id);
  }

  async readById(id: number): Promise<Persona> {
    const query = `
      ${this.baseSelect()}
      WHERE p.id_persona = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Persona not found');
    }

    return this.mapPersona(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    const query = `
      DELETE FROM persona
      WHERE id_persona = $1;
    `;
    await db.executePreparedQuery(query, [id]);
  }

  async readAll(): Promise<Persona[]> {
    const query = `
      ${this.baseSelect()}
      ORDER BY p.id_persona;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows.map((row: any) => this.mapPersona(row));
  }

  private baseSelect(): string {
    return `
      SELECT
        p.id_persona AS id,
        p.primer_nombre,
        p.segundo_nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.fecha_nacimiento,
        DATE_PART('year', AGE(p.fecha_nacimiento))::int AS edad,
        p.sexo,
        p.alfabetizacion,
        p.estado_civil_id,
        (
          SELECT pl.lengua_id
          FROM persona_lengua pl
          WHERE pl.persona_id = p.id_persona
          ORDER BY COALESCE(pl.es_principal, false) DESC, pl.id_persona_lengua DESC
          LIMIT 1
        ) AS lengua_id,
        (
          SELECT pl.lengua_indigena_especificar
          FROM persona_lengua pl
          WHERE pl.persona_id = p.id_persona
          ORDER BY COALESCE(pl.es_principal, false) DESC, pl.id_persona_lengua DESC
          LIMIT 1
        ) AS lengua_indigena_especificar,
        (
          SELECT pe.escolaridad_id
          FROM persona_escolaridad pe
          WHERE pe.persona_id = p.id_persona
          ORDER BY pe.fecha_registro DESC NULLS LAST, pe.id_persona_escolaridad DESC
          LIMIT 1
        ) AS escolaridad_id,
        (
          SELECT po.ocupacion_id
          FROM persona_ocupacion po
          WHERE po.persona_id = p.id_persona
          ORDER BY po.fecha_registro DESC NULLS LAST, po.id_persona_ocupacion DESC
          LIMIT 1
        ) AS ocupacion_id,
        (
          SELECT po.ocupacion_texto
          FROM persona_ocupacion po
          WHERE po.persona_id = p.id_persona
          ORDER BY po.fecha_registro DESC NULLS LAST, po.id_persona_ocupacion DESC
          LIMIT 1
        ) AS ocupacion_texto,
        (
          SELECT pi.ingreso_salarial_id
          FROM persona_ingreso pi
          WHERE pi.persona_id = p.id_persona
          ORDER BY pi.fecha_registro DESC NULLS LAST, pi.id_persona_ingreso DESC
          LIMIT 1
        ) AS ingreso_salarial_id,
        (
          SELECT pss.cuenta_seguridad_social
          FROM persona_seguridad_social pss
          WHERE pss.persona_id = p.id_persona
          ORDER BY pss.fecha_registro DESC NULLS LAST, pss.id_persona_seguridad_social DESC
          LIMIT 1
        ) AS cuenta_seguridad_social,
        (
          SELECT pd.presenta_discapacidad
          FROM persona_discapacidad pd
          WHERE pd.persona_id = p.id_persona
          ORDER BY pd.id_persona_discapacidad DESC
          LIMIT 1
        ) AS presenta_discapacidad,
        (
          SELECT pd.tipo_discapacidad
          FROM persona_discapacidad pd
          WHERE pd.persona_id = p.id_persona
          ORDER BY pd.id_persona_discapacidad DESC
          LIMIT 1
        ) AS tipo_discapacidad,
        p.fecha_registro
      FROM persona p
    `;
  }

  private mapPersona(row: any): Persona {
    decryptRow('persona', row); // descifra nombres antes de devolver al dominio
    row.fecha_nacimiento = parseDBDate(row.fecha_nacimiento);
    row.fecha_registro = parseDBDate(row.fecha_registro);
    return row;
  }

  private async replaceCatalogLinks(personaId: number, persona: Persona): Promise<void> {
    await this.replaceSingleLink('persona_lengua', 'lengua_id', personaId, persona.lengua_id, {
      lengua_indigena_especificar: persona.lengua_indigena_especificar ?? null,
      es_principal: true
    });
    await this.replaceSingleLink('persona_escolaridad', 'escolaridad_id', personaId, persona.escolaridad_id);
    await this.replaceOcupacion(personaId, persona);
    await this.replaceSingleLink('persona_ingreso', 'ingreso_salarial_id', personaId, persona.ingreso_salarial_id);
    await this.replaceSeguridadSocial(personaId, persona);
    await this.replaceDiscapacidad(personaId, persona);
  }

  private async replaceSingleLink(
    tableName: string,
    catalogColumn: string,
    personaId: number,
    catalogId: number | null | undefined,
    extraColumns: Record<string, unknown> = {}
  ): Promise<void> {
    await db.executePreparedQuery(`DELETE FROM ${tableName} WHERE persona_id = $1`, [personaId]);
    if (catalogId === undefined || catalogId === null) return;

    const columns = ['persona_id', catalogColumn, ...Object.keys(extraColumns)];
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    await db.executePreparedQuery(
      `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
      [personaId, catalogId, ...Object.values(extraColumns)]
    );
  }

  private async replaceOcupacion(personaId: number, persona: Persona): Promise<void> {
    await db.executePreparedQuery('DELETE FROM persona_ocupacion WHERE persona_id = $1', [personaId]);
    if (persona.ocupacion_id === undefined && persona.ocupacion_texto === undefined) return;
    if (persona.ocupacion_id === null && !persona.ocupacion_texto) return;

    await db.executePreparedQuery(
      `INSERT INTO persona_ocupacion (persona_id, ocupacion_id, ocupacion_texto)
       VALUES ($1, $2, $3)`,
      [personaId, persona.ocupacion_id ?? null, persona.ocupacion_texto ?? null]
    );
  }

  private async replaceSeguridadSocial(personaId: number, persona: Persona): Promise<void> {
    await db.executePreparedQuery('DELETE FROM persona_seguridad_social WHERE persona_id = $1', [personaId]);
    if (persona.cuenta_seguridad_social === undefined || persona.cuenta_seguridad_social === null) return;

    await db.executePreparedQuery(
      `INSERT INTO persona_seguridad_social (persona_id, cuenta_seguridad_social)
       VALUES ($1, $2)`,
      [personaId, persona.cuenta_seguridad_social]
    );
  }

  private async replaceDiscapacidad(personaId: number, persona: Persona): Promise<void> {
    await db.executePreparedQuery('DELETE FROM persona_discapacidad WHERE persona_id = $1', [personaId]);
    if (persona.presenta_discapacidad === undefined && persona.tipo_discapacidad === undefined) return;
    if (persona.presenta_discapacidad === null && !persona.tipo_discapacidad) return;

    await db.executePreparedQuery(
      `INSERT INTO persona_discapacidad (persona_id, presenta_discapacidad, tipo_discapacidad)
       VALUES ($1, $2, $3)`,
      [
        personaId,
        persona.presenta_discapacidad ?? Boolean(persona.tipo_discapacidad),
        persona.tipo_discapacidad ?? null
      ]
    );
  }
}
