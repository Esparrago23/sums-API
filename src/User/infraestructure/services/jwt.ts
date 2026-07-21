// src/User/infrastructure/services/jwt.ts
import jwt, { JwtPayload } from 'jsonwebtoken';

// JWT_SECRET es obligatorio: nunca se debe firmar/verificar con un secreto por
// defecto hardcodeado en el código. Si falta, la app debe fallar rápido y de forma
// explícita al arrancar en lugar de operar con un fallback inseguro y silencioso.
// Se exporta para que cualquier otro módulo (p.ej. roleMiddleware) use exactamente
// el mismo secreto en vez de mantener su propio fallback distinto.
export const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      '[security] JWT_SECRET no está definido en las variables de entorno. ' +
      'Defínelo en .env antes de iniciar la aplicación (ver .env.example).'
    );
  }
  return secret;
})();

interface TokenPayload extends JwtPayload {
  idUsuario: string;
  rol: string;
}

export const generateToken = (idUsuario: string, rol: string): string => {
  return jwt.sign({ idUsuario, rol }, JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    return decoded as TokenPayload;
  } catch (e) {
    throw new Error('Token inválido');
  }
};
