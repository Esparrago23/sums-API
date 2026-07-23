import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../User/infraestructure/services/jwt';

export const roleMiddleware = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1];
      // Reutiliza verifyToken (mismo JWT_SECRET y algorithms: ['HS256'] que
      // authMiddleware) en vez de mantener un segundo secreto de fallback distinto.
      const decoded = verifyToken(token) as any;

      // Ensure the decoded token has rol
      if (!decoded || !decoded.rol) {
        res.status(403).json({ error: 'Access denied: No role information in token' });
        return;
      }

      const rolId = parseInt(decoded.rol, 10);
      if (!allowedRoles.includes(rolId)) {
        res.status(403).json({ error: 'Access denied: Insufficient privileges' });
        return;
      }

      // Optionally attach user to request object
      (req as any).user = decoded;

      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  };
};
