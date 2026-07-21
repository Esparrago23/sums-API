import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Protección HTTP Basic mínima para /sums/api-docs (Swagger UI). Antes la ruta
// estaba completamente abierta y exponía toda la superficie de la API (rutas,
// schemas, ejemplos) a cualquiera sin autenticar.
const swaggerUser = process.env.SWAGGER_USER;
const swaggerPassword = process.env.SWAGGER_PASSWORD;
if (!swaggerUser || !swaggerPassword) {
  // Nunca usar estas credenciales por defecto en producción: define
  // SWAGGER_USER / SWAGGER_PASSWORD en .env.
  console.warn(
    '[security] SWAGGER_USER/SWAGGER_PASSWORD no definidos; usando credenciales de ' +
    'desarrollo para /sums/api-docs (NO usar en producción).'
  );
}
const USER = swaggerUser || 'admin';
const PASSWORD = swaggerPassword || 'sums-docs-dev';

// Comparación de tiempo constante: crypto.timingSafeEqual lanza si los Buffers
// no tienen la misma longitud, y comparar longitudes con "!==" antes filtraría
// esa longitud por temporización. Por eso ambos valores se rellenan (pad) a la
// mayor longitud entre el esperado y el recibido antes de comparar, y el
// resultado de longitud se combina (AND) con el resultado de la comparación en
// vez de retornar antes.
const timingSafeStringEqual = (expected: string, received: string): boolean => {
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(received, 'utf8');
  const length = Math.max(expectedBuf.length, receivedBuf.length, 1);
  const expectedPadded = Buffer.alloc(length);
  const receivedPadded = Buffer.alloc(length);
  expectedBuf.copy(expectedPadded);
  receivedBuf.copy(receivedPadded);
  const equal = crypto.timingSafeEqual(expectedPadded, receivedPadded);
  return equal && expectedBuf.length === receivedBuf.length;
};

export const swaggerBasicAuth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="SUMS API Docs"');
    res.status(401).send('Autenticación requerida');
    return;
  }

  const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  const user = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : decoded;
  const pass = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

  if (timingSafeStringEqual(USER, user) && timingSafeStringEqual(PASSWORD, pass)) {
    next();
    return;
  }

  res.set('WWW-Authenticate', 'Basic realm="SUMS API Docs"');
  res.status(401).send('Credenciales inválidas');
};
