import { Request, Response, NextFunction } from 'express';
import {
  AddPersonaNucleoUseCase,
  CreateNucleoFamiliarUseCase,
  DeleteNucleoFamiliarUseCase,
  ListIntegrantesNucleoUseCase,
  ReadAllNucleosFamiliaresUseCase,
  ReadNucleoFamiliarByIdUseCase,
  UpdateIntegranteNucleoUseCase,
  UpdateNucleoFamiliarUseCase
} from '../../application/nucleoFamiliar_UseCases';
import { normalizeDateField, parsePositiveId } from '../../../shared/validation';

export class NucleoFamiliarController {
  constructor(
    private createUseCase: CreateNucleoFamiliarUseCase,
    private readAllUseCase: ReadAllNucleosFamiliaresUseCase,
    private readByIdUseCase: ReadNucleoFamiliarByIdUseCase,
    private updateUseCase: UpdateNucleoFamiliarUseCase,
    private deleteUseCase: DeleteNucleoFamiliarUseCase,
    private addPersonaUseCase: AddPersonaNucleoUseCase,
    private listIntegrantesUseCase: ListIntegrantesNucleoUseCase,
    private updateIntegranteUseCase: UpdateIntegranteNucleoUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      normalizeDateField(req.body, 'fecha_registro');
      normalizeDateField(req.body, 'fecha_cierre');
      const result = await this.createUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }

  async readAll(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await this.readAllUseCase.execute());
    } catch (error: any) {
      (error as any).status = 500;
      next(error);
    }
  }

  async readById(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await this.readByIdUseCase.execute(parsePositiveId(req.params.id)));
    } catch (error: any) {
      (error as any).status = 404;
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      normalizeDateField(req.body, 'fecha_registro');
      normalizeDateField(req.body, 'fecha_cierre');
      const result = await this.updateUseCase.execute(parsePositiveId(req.params.id), req.body);
      res.status(200).json(result);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteUseCase.execute(parsePositiveId(req.params.id));
      res.status(200).json({ message: 'Nucleo familiar eliminado' });
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }

  async addPersona(req: Request, res: Response, next: NextFunction) {
    try {
      normalizeDateField(req.body, 'fecha_registro');
      normalizeDateField(req.body, 'fecha_salida');
      const nucleo_familiar_id = parsePositiveId(req.params.id, 'nucleo_familiar_id');
      const result = await this.addPersonaUseCase.execute({ ...req.body, nucleo_familiar_id });
      res.status(201).json(result);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }

  async listIntegrantes(req: Request, res: Response, next: NextFunction) {
    try {
      const nucleoFamiliarId = parsePositiveId(req.params.id, 'nucleo_familiar_id');
      res.status(200).json(await this.listIntegrantesUseCase.execute(nucleoFamiliarId));
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }

  async updateIntegrante(req: Request, res: Response, next: NextFunction) {
    try {
      normalizeDateField(req.body, 'fecha_salida');
      const nucleoFamiliarId = parsePositiveId(req.params.id, 'nucleo_familiar_id');
      const personaId = parsePositiveId(req.params.personaId, 'persona_id');
      const result = await this.updateIntegranteUseCase.execute(nucleoFamiliarId, personaId, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}
