/**
 * Re-cifra los datos sensibles ya existentes en la base (nombres de persona + dirección).
 * Es IDEMPOTENTE: salta los valores que ya están cifrados (prefijo enc::), así que se puede
 * correr varias veces sin doble cifrado.
 *
 * Requisitos: ENCRYPTION_MASTER_KEY definido en .env y la base accesible.
 * Ejecutar (después de aplicar la migración 001):
 *   npx ts-node scripts/encrypt_existing_data.ts
 */
import 'dotenv/config';
import { db } from '../src/core/db_postgresql';
import { encryptValue } from '../src/shared/security/sensitiveFields';

async function reencryptTable(
  scope: string,
  idColumn: string,
  table: string,
  fields: string[]
): Promise<void> {
  const cols = [idColumn, ...fields].join(', ');
  const { rows } = await db.executePreparedQuery(`SELECT ${cols} FROM ${table}`, []);
  let updated = 0;
  for (const row of rows) {
    const sets: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    for (const field of fields) {
      const enc = encryptValue(scope, field, row[field]);
      if (enc !== row[field]) {
        sets.push(`${field} = $${i++}`);
        values.push(enc);
      }
    }
    if (sets.length === 0) continue; // ya cifrado o nulo
    values.push(row[idColumn]);
    await db.executePreparedQuery(
      `UPDATE ${table} SET ${sets.join(', ')} WHERE ${idColumn} = $${i}`,
      values
    );
    updated++;
  }
  console.log(`${table}: ${updated}/${rows.length} filas re-cifradas.`);
}

(async () => {
  await reencryptTable('persona', 'id_persona', 'persona', [
    'primer_nombre',
    'segundo_nombre',
    'apellido_paterno',
    'apellido_materno',
  ]);
  await reencryptTable('direccion', 'id_direccion', 'direccion', [
    'calle',
    'numero_exterior',
    'numero_interior',
    'colonia',
    'vivienda_referencia',
  ]);
  console.log('Re-cifrado completo.');
  process.exit(0);
})().catch((err) => {
  console.error('Error en el re-cifrado:', err);
  process.exit(1);
});
