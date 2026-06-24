import { db } from '../src/core/db_postgresql';

async function run() {
  try {
    await db.ensureDatabaseForCurrentYear();
    console.log("ensureDatabaseForCurrentYear ejecutado con exito");
  } catch (e: any) {
    console.error("Error:", e.message);
  } finally {
    db.close();
  }
}
run();
