import { decrypt, encrypt, encryptDeterministic } from './encryption';

/**
 * Registro central de campos sensibles por tabla (scope) y su modo de cifrado.
 * Único lugar a tocar para añadir/quitar columnas protegidas. Mantiene la lógica
 * de cifrado desacoplada de los repositorios (solo llaman a estos helpers).
 *
 *   random        -> cifrado aleatorio (máxima seguridad; no se puede agrupar/buscar)
 *   deterministic -> mismo texto = mismo token (permite GROUP BY; fuga de igualdad)
 */
type FieldMode = 'random' | 'deterministic';

export const SENSITIVE_FIELDS: Record<string, Record<string, FieldMode>> = {
  persona: {
    primer_nombre: 'random',
    segundo_nombre: 'random',
    apellido_paterno: 'random',
    apellido_materno: 'random',
  },
  direccion: {
    calle: 'random',
    numero_exterior: 'random',
    numero_interior: 'random',
    vivienda_referencia: 'random',
    // Determinista: las estadísticas agrupan por colonia (getCedulasPorColonia).
    colonia: 'deterministic',
  },
};

function modeOf(scope: string, field: string): FieldMode | undefined {
  return SENSITIVE_FIELDS[scope]?.[field];
}

/** Cifra un valor suelto según su tabla/campo. Null-safe e idempotente. */
export function encryptValue(scope: string, field: string, value: unknown): unknown {
  const mode = modeOf(scope, field);
  if (!mode) return value;
  if (value === null || value === undefined || value === '') return value;
  if (typeof value !== 'string') return value;
  if (value.startsWith('enc::')) return value; // ya cifrado
  return mode === 'deterministic'
    ? encryptDeterministic(value, scope)
    : encrypt(value, scope);
}

/** Descifra un valor suelto según su tabla/campo. Devuelve texto plano tal cual. */
export function decryptValue(scope: string, field: string, value: unknown): unknown {
  if (!modeOf(scope, field)) return value;
  if (typeof value !== 'string' || !value.startsWith('enc::')) return value;
  return decrypt(value, scope);
}

/** Cifra in-place los campos sensibles presentes en la fila/objeto. */
export function encryptRow<T extends Record<string, unknown>>(scope: string, row: T): T {
  const cfg = SENSITIVE_FIELDS[scope];
  if (!cfg || !row) return row;
  for (const field of Object.keys(cfg)) {
    if (field in row) (row as Record<string, unknown>)[field] = encryptValue(scope, field, row[field]);
  }
  return row;
}

/** Descifra in-place los campos sensibles presentes en la fila/objeto. */
export function decryptRow<T extends Record<string, unknown>>(scope: string, row: T): T {
  const cfg = SENSITIVE_FIELDS[scope];
  if (!cfg || !row) return row;
  for (const field of Object.keys(cfg)) {
    if (field in row) (row as Record<string, unknown>)[field] = decryptValue(scope, field, row[field]);
  }
  return row;
}
