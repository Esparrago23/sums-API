import { db } from './src/core/db_postgresql';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'database/migrations/004_new_catalogos.sql'), 'utf8');
    await db.executePreparedQuery(sql);
    console.log('Migration executed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await db.close();
  }
}

runMigration();
