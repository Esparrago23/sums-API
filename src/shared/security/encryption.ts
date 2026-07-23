import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  scryptSync,
} from 'crypto';

/**
 * Motor de cifrado de campos sensibles para SUMS (cifrado en reposo).
 *
 * Endurece el patrón demostrativo del profesor (blake2b stream-XOR) usando
 * AES-256-GCM (cifrado autenticado) del módulo nativo `crypto` de Node.
 *
 * Formato del token persistido:  PREFIJO + base64(iv | authTag | ciphertext)
 *   - enc::v2::  -> aleatorio (IV nuevo por operación; el mismo texto da tokens distintos)
 *   - enc::d2::  -> determinista (IV = HMAC(clave, texto); el mismo texto da el MISMO token).
 *     Se usa solo donde se necesita agrupar/igualar por el valor cifrado (ej. colonia
 *     en estadísticas), aceptando la fuga de igualdad como compromiso explícito.
 *
 * La clave por `scope` (típicamente el nombre de la tabla) se deriva de la clave
 * maestra `ENCRYPTION_MASTER_KEY` con scrypt; así cada tabla usa una clave distinta.
 */

const PREFIX_RANDOM = 'enc::v2::';
const PREFIX_DET = 'enc::d2::';
const IV_LEN = 12;
const TAG_LEN = 16;

const masterKey = process.env.ENCRYPTION_MASTER_KEY;
if (!masterKey) {
  // Nunca usar la clave por defecto en producción: defínela en .env.
  console.warn(
    '[security] ENCRYPTION_MASTER_KEY no definido; usando clave de desarrollo (NO usar en producción).'
  );
}
const MASTER = masterKey ?? 'sums-dev-master-key-change-me';

const keyCache = new Map<string, Buffer>();
function keyFor(scope: string): Buffer {
  const cached = keyCache.get(scope);
  if (cached) return cached;
  const key = scryptSync(MASTER, `sums:${scope}`, 32);
  keyCache.set(scope, key);
  return key;
}

/** ¿El valor ya está cifrado? (cualquier formato enc::...) */
export function isEncrypted(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('enc::');
}

function seal(plaintext: string, key: Buffer, iv: Buffer, prefix: string): string {
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return prefix + Buffer.concat([iv, tag, ct]).toString('base64');
}

/** Cifrado aleatorio (recomendado por defecto). */
export function encrypt(plaintext: string, scope: string): string {
  return seal(plaintext, keyFor(scope), randomBytes(IV_LEN), PREFIX_RANDOM);
}

/**
 * Cifrado determinista: el mismo texto produce el mismo token, lo que permite
 * GROUP BY / igualdad sobre la columna cifrada. Úsalo solo cuando sea necesario.
 */
export function encryptDeterministic(plaintext: string, scope: string): string {
  const key = keyFor(scope);
  const iv = createHmac('sha256', key).update(plaintext, 'utf8').digest().subarray(0, IV_LEN);
  return seal(plaintext, key, iv, PREFIX_DET);
}

/** Descifra cualquier token enc::; si el valor no está cifrado lo devuelve igual (idempotente). */
export function decrypt(token: string, scope: string): string {
  if (typeof token !== 'string') return token;
  let prefixLen: number;
  if (token.startsWith(PREFIX_RANDOM)) prefixLen = PREFIX_RANDOM.length;
  else if (token.startsWith(PREFIX_DET)) prefixLen = PREFIX_DET.length;
  else return token; // texto plano o dato previo no cifrado
  const raw = Buffer.from(token.slice(prefixLen), 'base64');
  const iv = raw.subarray(0, IV_LEN);
  const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ct = raw.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv('aes-256-gcm', keyFor(scope), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}
