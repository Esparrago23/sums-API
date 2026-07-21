import { Request, Response, NextFunction } from 'express';

// Roles con privilegio administrativo (ver database/seeder.sql: cat_rol).
// 1 = superadmin, 2 = admin.
const ADMIN_ROLES = [1, 2];

/**
 * Middleware para rutas con parámetro :id que representan un recurso "propio"
 * del usuario autenticado (p.ej. /users/:id). Permite el acceso si:
 *   - el usuario autenticado tiene un rol administrativo (superadmin/admin), o
 *   - el :id de la ruta coincide con el id del usuario autenticado (self-service).
 * En cualquier otro caso responde 403 (IDOR: evita que cualquier usuario
 * autenticado pueda leer/modificar/borrar la cuenta de otro usuario).
 *
 * Debe usarse siempre después de authMiddleware() (necesita req.user ya poblado).
 */
export const selfOrAdminMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const rolId = parseInt(user.rol, 10);
    const requestedId = req.params.id;
    const ownId = user.idUsuario !== undefined ? String(user.idUsuario) : undefined;

    if ((Number.isInteger(rolId) && ADMIN_ROLES.includes(rolId)) || (ownId !== undefined && ownId === String(requestedId))) {
      next();
      return;
    }

    res.status(403).json({ error: 'Acceso denegado: solo puedes acceder a tu propia cuenta' });
  };
};
