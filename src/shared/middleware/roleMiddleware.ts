import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const roleMiddleware = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

      // Ensure the decoded token has rol_id
      if (!decoded || !decoded.rol_id) {
        res.status(403).json({ error: 'Access denied: No role information in token' });
        return;
      }

      if (!allowedRoles.includes(decoded.rol_id)) {
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
