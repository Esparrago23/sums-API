import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Datos de entrada inválidos",
          detalles: (error as any).errors.map((e: any) => ({
            campo: e.path.join('.'),
            mensaje: e.message
          }))
        });
      } else {
        res.status(500).json({ error: "Error de validación interno" });
      }
    }
  };
};
