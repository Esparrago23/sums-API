import { db } from '../../core/db_postgresql';

/**
 * Resuelve dinámicamente el id_rol de "entrevistador" desde cat_rol en vez de
 * asumir un valor fijo (p.ej. 4): el id real depende del orden en que se
 * sembró/creó el catálogo en cada entorno.
 */
export async function getEntrevistadorRolId(): Promise<number | null> {
  const result = await db.executePreparedQuery(
    `SELECT id_rol FROM cat_rol WHERE nombre = $1;`,
    ['entrevistador']
  );
  return result.rows[0]?.id_rol ?? null;
}

/**
 * Si hay exactamente una unidad_salud registrada, la usa como default para
 * altas de entrevistador que no especifiquen unidad_salud_id. Con 0 o 2+
 * unidades no hay una elección segura, así que no adivina.
 */
async function resolveDefaultUnidadSaludId(): Promise<number | null> {
  const result = await db.executePreparedQuery(
    `SELECT id_unidad_salud FROM unidad_salud;`,
    []
  );
  return result.rows.length === 1 ? result.rows[0].id_unidad_salud : null;
}

/**
 * Garantiza que un usuario con rol "entrevistador" tenga unidad_salud_id y
 * entrevistador_id válidos. Si ya vienen ambos en la request, se respetan tal
 * cual (permite ligar a un entrevistador ya existente). Si falta alguno, se
 * autoprovisiona: crea un registro `entrevistador` mínimo (nombre =
 * nombre_usuario como placeholder — editable después desde el panel admin)
 * ligado a la unidad de salud default.
 *
 * Reemplaza el bug de PUT /users/:id/role y POST /users/admin/register, que
 * antes dejaban usuarios con rol entrevistador sin ninguna liga (ver
 * cedula_entrevistador_id_fkey en la API y la validación de entrevistadorId
 * en la app móvil).
 */
export async function ensureEntrevistadorLink(params: {
  entrevistadorId?: number | null;
  unidadSaludId?: number | null;
  nombreUsuario: string;
}): Promise<{ entrevistadorId: number; unidadSaludId: number }> {
  if (params.entrevistadorId && params.unidadSaludId) {
    return { entrevistadorId: params.entrevistadorId, unidadSaludId: params.unidadSaludId };
  }

  const unidadSaludId = params.unidadSaludId ?? (await resolveDefaultUnidadSaludId());
  if (!unidadSaludId) {
    throw new Error(
      'No se puede asignar el rol "entrevistador" sin especificar unidad_salud_id: ' +
      'hay más de una unidad de salud registrada (o ninguna), así que no se puede ' +
      'elegir una por default. Incluye unidad_salud_id en el request.'
    );
  }

  const result = await db.executePreparedQuery(
    `INSERT INTO entrevistador (nombre, unidad_salud_id, fecha_registro)
     VALUES ($1, $2, CURRENT_DATE)
     RETURNING id_entrevistador AS id;`,
    [params.nombreUsuario, unidadSaludId]
  );
  return { entrevistadorId: result.rows[0].id, unidadSaludId };
}
