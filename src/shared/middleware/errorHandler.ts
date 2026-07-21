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

  // Los controladores (ver next(error) en src/**/*_Controller.ts) marcan sus
  // errores esperados/de negocio (validación, "no encontrado", duplicados,
  // credenciales inválidas, etc.) con err.status en el rango 4xx: ese mensaje
  // ya fue redactado pensando en el cliente y es seguro exponerlo. Cualquier
  // otro caso (5xx, o un error sin status explícito -p.ej. una excepción cruda
  // del driver de PostgreSQL-) sigue devolviendo un mensaje genérico para no
  // filtrar detalles internos (stack traces, esquema de BD, rutas de archivo).
  const message = status >= 400 && status < 500 && typeof err?.message === 'string' && err.message.length > 0
    ? err.message
    : 'Error interno del servidor';

  res.status(status).json({ error: message });
};
