import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de errores centralizado. Debe registrarse al final de index.ts,
 * después de todas las rutas (Express lo reconoce como error handler por tener
 * 4 argumentos). Objetivo: nunca exponer al cliente detalles internos (stack
 * traces, el objeto de error crudo del driver de PostgreSQL, rutas de archivos,
 * etc.) — siempre un mensaje genérico. El detalle completo se loguea únicamente
 * en el servidor para diagnóstico.
 */
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[error]', err);

  if (res.headersSent) {
    return;
  }

  const status = typeof err?.status === 'number' ? err.status : 500;

  // Todos los *_Controller.ts hacen `(error as any).status = 400; next(error)`
  // de forma ciega en su catch, sin distinguir un error de negocio (p.ej.
  // "contraseña inválida") de una excepción cruda del driver de PostgreSQL
  // (p.ej. una violación de FK, que trae nombres reales de tabla/constraint
  // en err.message). Como el status ya viene forzado a 400 en ambos casos,
  // no sirve por sí solo para decidir si el mensaje es seguro de exponer.
  // El driver `pg` sí marca sus propios errores con un `code` (SQLSTATE de 5
  // caracteres, p.ej. "23503"); un Error de negocio lanzado a mano con
  // `new Error(...)` nunca tiene esa propiedad. Se usa eso para filtrar.
  const looksLikeRawDriverError = typeof err?.code === 'string';
  const message = status >= 400 && status < 500 && !looksLikeRawDriverError
    && typeof err?.message === 'string' && err.message.length > 0
    ? err.message
    : 'Error interno del servidor';

  res.status(status).json({ error: message });
};
