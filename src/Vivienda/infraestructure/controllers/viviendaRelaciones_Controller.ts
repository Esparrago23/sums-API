import { Request, Response } from 'express';
import { ViviendaRelacionesUseCase } from '../../application/viviendaRelaciones_UseCase';
import { ViviendaRelacionTipo } from '../../domain/repositories/IViviendaRelacionesRepository';
import { assertNonNegativeNumber, parsePositiveId } from '../../../shared/validation';

export class ViviendaRelacionesController {
  constructor(private useCase: ViviendaRelacionesUseCase) {}

  create(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response) => {
      try {
        this.validate(tipo, req.body);
        const result = await this.useCase.create(tipo, req.body);
        res.status(201).json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  readAll(tipo: ViviendaRelacionTipo) {
    return async (_req: Request, res: Response) => {
      try {
        res.status(200).json(await this.useCase.readAll(tipo));
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    };
  }

  readById(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response) => {
      try {
        res.status(200).json(await this.useCase.readById(tipo, parsePositiveId(req.params.id)));
      } catch (error: any) {
        res.status(404).json({ error: error.message });
      }
    };
  }

  update(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response) => {
      try {
        this.validate(tipo, req.body);
        const result = await this.useCase.update(tipo, parsePositiveId(req.params.id), req.body);
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  delete(tipo: ViviendaRelacionTipo) {
    return async (req: Request, res: Response) => {
      try {
        await this.useCase.delete(tipo, parsePositiveId(req.params.id));
        res.status(200).json({ message: 'Registro eliminado' });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  private validate(tipo: ViviendaRelacionTipo, data: Record<string, unknown>): void {
    if (tipo === 'animales') {
      assertNonNegativeNumber(data.cantidad, 'cantidad');
    }
    if (tipo === 'servicios' && data.disponible !== undefined && typeof data.disponible !== 'boolean') {
      throw new Error('disponible debe ser boolean');
    }
  }
}
