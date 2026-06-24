import { db } from '../src/core/db_postgresql';

async function run() {
  try {
    // Wait for DB to switch pool to current year
    await new Promise(r => setTimeout(r, 2000));
    
    // 0. Ensure tables exist
    await db.executePreparedQuery(`
      CREATE TABLE IF NOT EXISTS cat_animal (
        id_animal SERIAL PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL
      );
    `);
    await db.executePreparedQuery(`
      CREATE TABLE IF NOT EXISTS familia_animal (
        id_familia_animal SERIAL PRIMARY KEY,
        nucleo_familiar_id INT NOT NULL,
        animal_id INT NOT NULL,
        otro_especificar VARCHAR(150),
        comentarios VARCHAR(255)
      );
    `);
    await db.executePreparedQuery(`
      CREATE TABLE IF NOT EXISTS cat_atencion_embarazo (
        id_atencion_embarazo SERIAL PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL
      );
    `);
    await db.executePreparedQuery(`
      CREATE TABLE IF NOT EXISTS cat_frecuencia_servicio_salud (
        id_frecuencia_servicio_salud SERIAL PRIMARY KEY,
        nombre VARCHAR(50) UNIQUE NOT NULL
      );
    `);
    await db.executePreparedQuery(`
      CREATE TABLE IF NOT EXISTS persona_salud_preventiva (
        id_persona_salud_preventiva SERIAL PRIMARY KEY,
        persona_id INT NOT NULL,
        atencion_embarazo_id INT,
        tamizaje_cervico_uterino BOOLEAN,
        fecha_tamizaje_cervico_uterino DATE,
        tamizaje_cancer_mama BOOLEAN,
        fecha_tamizaje_cancer_mama DATE,
        fecha_registro DATE
      );
    `);
    await db.executePreparedQuery(`
      CREATE TABLE IF NOT EXISTS persona_servicio_salud (
        id_persona_servicio_salud SERIAL PRIMARY KEY,
        persona_id INT NOT NULL,
        frecuencia_servicio_salud_id INT,
        motivo_uso VARCHAR(250),
        fecha_registro DATE
      );
    `);
    
    // 1. Insert missing catalogs
    const animales = ['Aves de corral', 'Bovinos', 'Cerdos', 'Perros', 'Gatos', 'Caballos', 'Otros'];
    for (const a of animales) {
      await db.executePreparedQuery('INSERT INTO cat_animal (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING', [a]);
    }

    const atencion = ['Ninguno', 'IMSS', 'ISSSTE', 'Secretaría de Salud', 'Privado', 'Otro'];
    for (const a of atencion) {
      await db.executePreparedQuery('INSERT INTO cat_atencion_embarazo (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING', [a]);
    }

    const freq = ['Mensual', 'Cada 6 meses', 'Anual', 'Sólo cuando se enferma', 'Nunca'];
    for (const f of freq) {
      await db.executePreparedQuery('INSERT INTO cat_frecuencia_servicio_salud (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING', [f]);
    }

    // 2. Insert dummy Unidad Salud (ID 1)
    await db.executePreparedQuery(`
      INSERT INTO unidad_salud (id_unidad_salud, clues, nombre, distrito)
      VALUES (1, 'DUMMYCLUES1', 'Centro de Salud Prueba', 'Distrito 1')
      ON CONFLICT (id_unidad_salud) DO NOTHING
    `);

    // 3. Insert dummy Entrevistador (ID 1)
    await db.executePreparedQuery(`
      INSERT INTO entrevistador (id_entrevistador, nombre, unidad_salud_id, fecha_registro)
      VALUES (1, 'Entrevistador Prueba', 1, NOW())
      ON CONFLICT (id_entrevistador) DO NOTHING
    `);

    // Update auto-increment sequences
    await db.executePreparedQuery(`SELECT setval('unidad_salud_id_unidad_salud_seq', (SELECT MAX(id_unidad_salud) FROM unidad_salud))`);
    await db.executePreparedQuery(`SELECT setval('entrevistador_id_entrevistador_seq', (SELECT MAX(id_entrevistador) FROM entrevistador))`);

    // 4. Update the existing entrevistador1 user to have the correct foreign keys
    await db.executePreparedQuery(`
      UPDATE usuario
      SET unidad_salud_id = 1, entrevistador_id = 1
      WHERE nombre_usuario = 'entrevistador1'
    `);

    console.log("✅ Base de datos actualizada con catálogos faltantes y datos dummy.");
  } catch (e: any) {
    console.error("Error actualizando DB:", e.message);
  } finally {
    db.close();
  }
}

run();
