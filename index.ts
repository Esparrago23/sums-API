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
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger';
import { db } from './src/core/db_postgresql';
import { swaggerBasicAuth } from './src/shared/middleware/swaggerBasicAuth';
import { errorHandler } from './src/shared/middleware/errorHandler';

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
import EstadisticasOperacionRouter from './src/EstadisticasOperacion/infraestructure/routes/estadisticasOperacionRouter';
import EstadisticasDemografiaRouter from './src/EstadisticasDemografia/infraestructure/routes/estadisticasDemografiaRouter';
import EstadisticasSaludRouter from './src/EstadisticasSalud/infraestructure/routes/estadisticasSaludRouter';
import EstadisticasViviendaRouter from './src/EstadisticasVivienda/infraestructure/routes/estadisticasViviendaRouter';

const app = express();

// contentSecurityPolicy se deshabilita porque su valor por defecto rompe los
// assets inline que sirve swagger-ui-express en /sums/api-docs; el resto de
// protecciones de helmet (X-Content-Type-Options, X-Frame-Options, etc.) se
// mantienen activas. La API en sí solo sirve JSON, así que el riesgo de XSS que
// CSP mitiga en páginas HTML no aplica al resto de las rutas.
app.use(helmet({ contentSecurityPolicy: false }));

// Orígenes permitidos: se arma la lista con cualquier variable que SÍ esté
// definida (filter(Boolean)). Antes se usaba "&&" (AND lógico), así que bastaba
// con que faltara UNA sola variable para que el CORS cayera a '*' (abierto a
// cualquier origen) incluso si la otra sí estaba configurada. Ahora solo se cae
// a '*' cuando NINGUNA de las variables está definida.
const configuredOrigins = [process.env.ORIGIN_URL_1, process.env.ORIGIN_URL_2].filter(
  (origin): origin is string => Boolean(origin)
);
app.use(cors({
  origin: configuredOrigins.length > 0 ? configuredOrigins : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

// Confía en 1 salto de proxy (nginx delante de la API, ver nginx/nginx.conf y
// compose.yaml). Sin esto, express-rate-limit y cualquier lógica basada en
// req.ip usan la IP del proxy (siempre la misma) en vez de la IP real del
// cliente (X-Forwarded-For), agrupando a todos los usuarios en un solo cupo.
app.set('trust proxy', 1);

// Rate limiting general: 1000 solicitudes / 15 min por IP.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }
});
app.use(generalLimiter);

// Rate limiting más estricto para login/registro (mitiga fuerza bruta / abuso
// de creación de cuentas): 10 intentos / 15 min por IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo más tarde.' }
});
app.use(['/sums/login', '/sums/register', '/sums/register-entrevistador'], authLimiter);

// Swagger UI protegido con HTTP Basic Auth (antes era público sin restricción).
app.use('/sums/api-docs', swaggerBasicAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
    EstadisticasOperacionRouter,
    EstadisticasDemografiaRouter,
    EstadisticasSaludRouter,
    EstadisticasViviendaRouter,
);

// Ruta de prueba para verificar la conexión
app.get('/sums/ping', async (req, res, next) => {
  try {
    const result = await db.executePreparedQuery('SELECT 1', []);
    res.json({ message: 'pong', result: result.rows });
  } catch (err) {
    // No se expone el objeto de error de pg (puede incluir detalles de la
    // consulta/esquema). Se delega al middleware de errores centralizado.
    next(err);
  }
});



// Verificación diaria de la base de datos
setInterval(() => {
  console.log("Ejecutando verificación diaria de base de datos...");
  db.ensureDatabaseForCurrentYear().catch(err => {
    console.error("Error durante la verificación diaria:", err);
  });
}, 24 * 60 * 60 * 1000); // cada 24 horas

// Middleware de errores centralizado: debe ir después de todas las rutas.
app.use(errorHandler);

const PORT = process.env.PORT || process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/sums`);
});
// Trigger restart
