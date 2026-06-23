import { db } from '../../core/db_postgresql';
import { hashPassword } from '../infraestructure/services/bcrypt';

type Dict = Record<string, any>;

export interface EntrevistadorUserResult {
  user: Dict;
  unidad_salud: Dict;
  datos_laborales: Dict | null;
  entrevistador: Dict;
}

export class CreateEntrevistadorUserUseCase {
  async execute(payload: Dict): Promise<EntrevistadorUserResult> {
    const unidad = this.objectValue(payload.unidad_salud) ?? payload;
    const datosLaborales = this.objectValue(payload.datos_laborales) ?? payload;
    const entrevistador = this.objectValue(payload.entrevistador) ?? payload;
    const usuario = this.objectValue(payload.usuario) ?? payload;

    this.assertRequired(usuario.nombre_usuario, 'nombre_usuario');
    this.assertRequired(usuario.contrasena, 'contrasena');
    this.assertRequired(unidad.clues, 'unidad_salud.clues');
    this.assertRequired(unidad.nombre, 'unidad_salud.nombre');
    this.assertRequired(entrevistador.nombre, 'entrevistador.nombre');

    const unidadSaludRow = await this.upsertUnidadSalud(unidad);
    const datosLaboralesRow = await this.createDatosLaborales(datosLaborales);
    const entrevistadorRow = await this.createEntrevistador(
      entrevistador,
      unidadSaludRow.id,
      datosLaboralesRow?.id ?? null
    );
    const userRow = await this.createUser(
      usuario,
      unidadSaludRow.id,
      datosLaboralesRow?.id ?? null,
      entrevistadorRow.id
    );

    return {
      user: this.sanitizeUser(userRow),
      unidad_salud: unidadSaludRow,
      datos_laborales: datosLaboralesRow,
      entrevistador: entrevistadorRow
    };
  }

  private async upsertUnidadSalud(unidad: Dict): Promise<Dict> {
    const result = await db.executePreparedQuery(
      `INSERT INTO unidad_salud (clues, nombre, distrito, municipio_id, numero_nucleos)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (clues) DO UPDATE
       SET nombre = EXCLUDED.nombre,
           distrito = EXCLUDED.distrito,
           municipio_id = EXCLUDED.municipio_id,
           numero_nucleos = EXCLUDED.numero_nucleos
       RETURNING *, id_unidad_salud AS id;`,
      [
        this.textValue(unidad.clues),
        this.textValue(unidad.nombre),
        this.textValue(unidad.distrito),
        this.intValue(unidad.municipio_id),
        this.intValue(unidad.numero_nucleos)
      ]
    );
    return result.rows[0];
  }

  private async createDatosLaborales(datos: Dict): Promise<Dict | null> {
    const hasAny = [
      datos.turno_id,
      datos.turno,
      datos.turno_nombre,
      datos.horario_inicio,
      datos.horario_fin,
      datos.cargo,
      datos.especialidad
    ].some((value) => value !== undefined && value !== null && String(value).trim() !== '');
    if (!hasAny) return null;

    const turnoId = this.intValue(datos.turno_id)
      ?? await this.findOrCreateTurno(datos.turno_nombre ?? datos.turno);

    const result = await db.executePreparedQuery(
      `INSERT INTO datos_laborales (turno_id, horario_inicio, horario_fin, cargo, especialidad)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *, id_datos_laborales AS id;`,
      [
        turnoId,
        this.timeValue(datos.horario_inicio),
        this.timeValue(datos.horario_fin),
        this.textValue(datos.cargo),
        this.textValue(datos.especialidad)
      ]
    );
    return result.rows[0];
  }

  private async createEntrevistador(
    entrevistador: Dict,
    unidadSaludId: number,
    datosLaboralesId: number | null
  ): Promise<Dict> {
    const result = await db.executePreparedQuery(
      `INSERT INTO entrevistador (nombre, unidad_salud_id, datos_laborales_id, fecha_registro)
       VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
       RETURNING *, id_entrevistador AS id;`,
      [
        this.textValue(entrevistador.nombre),
        unidadSaludId,
        datosLaboralesId,
        this.dateValue(entrevistador.fecha_registro)
      ]
    );
    return result.rows[0];
  }

  private async createUser(
    usuario: Dict,
    unidadSaludId: number,
    datosLaboralesId: number | null,
    entrevistadorId: number
  ): Promise<Dict> {
    const rolId = this.intValue(usuario.rol_id) ?? await this.findOrCreateRol('entrevistador');
    const hashedPassword = await hashPassword(String(usuario.contrasena));
    const result = await db.executePreparedQuery(
      `INSERT INTO usuario (
         nombre_usuario, contrasena, rol_id, fecha_registro, activo,
         unidad_salud_id, datos_laborales_id, entrevistador_id
       )
       VALUES ($1, $2, $3, NOW(), true, $4, $5, $6)
       RETURNING *, id_usuario AS id;`,
      [
        this.textValue(usuario.nombre_usuario),
        hashedPassword,
        rolId,
        unidadSaludId,
        datosLaboralesId,
        entrevistadorId
      ]
    );
    return result.rows[0];
  }

  private async findOrCreateRol(nombre: string): Promise<number> {
    const result = await db.executePreparedQuery(
      `INSERT INTO cat_rol (nombre, descripcion)
       VALUES ($1, $2)
       ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id_rol;`,
      [nombre, 'Personal autorizado para captura de cedulas']
    );
    return result.rows[0].id_rol;
  }

  private async findOrCreateTurno(rawValue: unknown): Promise<number | null> {
    const nombre = this.textValue(rawValue);
    if (!nombre) return null;
    const result = await db.executePreparedQuery(
      `INSERT INTO cat_turno (nombre)
       VALUES ($1)
       ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id_turno;`,
      [nombre]
    );
    return result.rows[0].id_turno;
  }

  private sanitizeUser(user: Dict): Dict {
    const { contrasena: _contrasena, ...safeUser } = user;
    return safeUser;
  }

  private objectValue(value: unknown): Dict | null {
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Dict : null;
  }

  private textValue(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text.length > 0 ? text : null;
  }

  private intValue(value: unknown): number | null {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  }

  private timeValue(value: unknown): string | null {
    const text = this.textValue(value);
    if (!text) return null;
    const match = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!match) return null;
    return `${match[1].padStart(2, '0')}:${match[2]}:00`;
  }

  private dateValue(value: unknown): string | null {
    const text = this.textValue(value);
    if (!text) return null;
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().slice(0, 10);
  }

  private assertRequired(value: unknown, field: string): void {
    if (!this.textValue(value)) {
      throw new Error(`${field} es requerido`);
    }
  }
}
