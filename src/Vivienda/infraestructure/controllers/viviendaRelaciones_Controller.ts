import { Request, Response, NextFunction } from 'express';
import { ViviendaRelacionesUseCase } from '../../application/viviendaRelaciones_UseCase';
import { ViviendaRelacionTipo } from '../../domain/repositories/IViviendaRelacionesRepository';
import { parsePositiveId } from '../../../shared/validation';

export class ViviendaRelacionesController {
  constructor(private useCase: ViviendaRelacionesUseCase) {}

  create(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        this.validate(tipo, req.body);
        const result = await this.useCase.create(tipo, req.body);
        res.status(201).json(result);
      } catch (error: any) {
        (error as any).status = 400;
        next(error);
      }
    };
  }

  readAll(tipo: ViviendaRelacionTipo) {
    return async (_req: Request, res: Response, next: NextFunction) => {
      try {
        res.status(200).json(await this.useCase.readAll(tipo));
      } catch (error: any) {
        (error as any).status = 500;
        next(error);
      }
    };
  }

  readById(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.status(200).json(await this.useCase.readById(tipo, parsePositiveId(req.params.id)));
      } catch (error: any) {
        (error as any).status = 404;
        next(error);
      }
    };
  }

  update(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        this.validate(tipo, req.body);
        const result = await this.useCase.update(tipo, parsePositiveId(req.params.id), req.body);
        res.status(200).json(result);
      } catch (error: any) {
        (error as any).status = 400;
        next(error);
      }
    };
  }

  delete(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.useCase.delete(tipo, parsePositiveId(req.params.id));
        res.status(200).json({ message: 'Registro eliminado' });
      } catch (error: any) {
        (error as any).status = 400;
        next(error);
      }
    };
  }

  private validate(tipo: ViviendaRelacionTipo, data: Record<string, unknown>): void {
    void tipo;
    void data;
  }
}
