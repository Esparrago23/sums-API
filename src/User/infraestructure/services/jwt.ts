// src/User/infrastructure/services/jwt.ts
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'sums_jwt_secret_2026';

interface TokenPayload extends JwtPayload {
  idUsuario: string;
  rol: string;
}

export const generateToken = (idUsuario: string, rol: string): string => {
  return jwt.sign({ idUsuario, rol }, SECRET_KEY, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    return decoded as TokenPayload;
  } catch (e) {
    throw new Error('Token inválido');
  }
};
