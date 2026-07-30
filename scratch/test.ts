import { db } from '../src/core/db_postgresql';
import { InMemoryEstadisticasDemografiaRepo } from '../src/EstadisticasDemografia/infraestructure/repositories/inMemoryEstadisticasDemografiaRepo';

async function test() {
  try {
    const repo = new InMemoryEstadisticasDemografiaRepo();
    const result = await repo.getPiramidePoblacional();
    console.log("Success piramide");
  } catch (err) {
    console.error("🔥 ERROR piramide:", err);
  }

  try {
    const repo = new InMemoryEstadisticasDemografiaRepo();
    const result = await repo.getDistribucionGenero();
    console.log("Success genero");
  } catch (err) {
    console.error("🔥 ERROR genero:", err);
  }

  try {
    const repo = new InMemoryEstadisticasDemografiaRepo();
    const result = await repo.getDistribucionEscolaridad();
    console.log("Success escolaridad");
  } catch (err) {
    console.error("🔥 ERROR escolaridad:", err);
  }
  process.exit(0);
}

test();
