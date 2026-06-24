import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config(); // ← MUST be first, before any module that reads process.env

process.on('uncaughtException', (err) => {
  fs.appendFileSync('crash.log', 'UNCAUGHT EXCEPTION: ' + err.stack + '\n');
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  fs.appendFileSync('crash.log', 'UNHANDLED REJECTION: ' + reason + '\n');
  console.error('UNHANDLED REJECTION:', reason);
});
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger';
import { db } from './src/core/db_postgresql';

import UserRouter from './src/User/infraestructure/routes/userRouter';
import EntrevistadorRouter from './src/Entrevistador/infraestructure/routes/entrevistadorRouter';
import DatosLaboralesRouter from './src/DatosLaborales/infraestructure/routes/datosLaboralesRouter';
import CedulaRouter from './src/Cedula/infraestructure/routes/cedulaRouter';
import FamiliaRouter from './src/Familia/infraestructure/routes/familiaRouter';
import ViviendaRouter from './src/Vivienda/infraestructure/routes/viviendaRouter';
import PersonaRouter from './src/Persona/infraestructure/routes/personaRouter';
import VacunacionRouter from './src/Vacunacion/infraestructure/routes/VacunacionRouter';
import DireccionRouter from './src/Direccion/infraestructure/routes/direccionRouter';
import UnidadSaludRouter from './src/UnidadSalud/infraestructure/routes/unidadSaludRouter';
import VacunasRouter from './src/Vacunas/infraestructure/routes/vacunasRouter';
import DosisRouter from './src/Dosis/infraestructure/routes/dosisRouter';
import CatalogosRouter from './src/Catalogos/infraestructure/routes/catalogosRouter';
import NucleoFamiliarRouter from './src/NucleoFamiliar/infraestructure/routes/nucleoFamiliarRouter';
import PersonaSaludRouter from './src/PersonaSalud/infraestructure/routes/personaSaludRouter';

const app = express();


app.use(cors({
  origin: process.env.ORIGIN_URL_1 && process.env.ORIGIN_URL_2 ? 
    [process.env.ORIGIN_URL_1, process.env.ORIGIN_URL_2].filter(Boolean) : 
    '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


app.use('/sums/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/sums',
    UserRouter,
    CedulaRouter,
    CatalogosRouter,
    DatosLaboralesRouter,
    DireccionRouter,
    DosisRouter,
    EntrevistadorRouter,
    FamiliaRouter,
    NucleoFamiliarRouter,
    PersonaRouter, 
    PersonaSaludRouter,
    UnidadSaludRouter,
    VacunacionRouter,
    VacunasRouter,
    ViviendaRouter,
);

// Ruta de prueba para verificar la conexión
app.get('/sums/ping', async (req, res) => {
  try {
    const result = await db.executePreparedQuery('SELECT 1', []);
    res.json({ message: 'pong', result: result.rows });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});



// Verificación diaria de la base de datos
setInterval(() => {
  console.log("Ejecutando verificación diaria de base de datos...");
  db.ensureDatabaseForCurrentYear().catch(err => {
    console.error("Error durante la verificación diaria:", err);
  });
}, 24 * 60 * 60 * 1000); // cada 24 horas

const PORT = process.env.API_PORT || process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/sums`);
});
// Trigger restart
