import { Request, Response } from 'express';
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

  async create(req: Request, res: Response) {
    try {
      normalizeDateField(req.body, 'fecha_registro');
      normalizeDateField(req.body, 'fecha_cierre');
      const result = await this.createUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async readAll(_req: Request, res: Response) {
    try {
      res.status(200).json(await this.readAllUseCase.execute());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async readById(req: Request, res: Response) {
    try {
      res.status(200).json(await this.readByIdUseCase.execute(parsePositiveId(req.params.id)));
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      normalizeDateField(req.body, 'fecha_registro');
      normalizeDateField(req.body, 'fecha_cierre');
      const result = await this.updateUseCase.execute(parsePositiveId(req.params.id), req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deleteUseCase.execute(parsePositiveId(req.params.id));
      res.status(200).json({ message: 'Nucleo familiar eliminado' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addPersona(req: Request, res: Response) {
    try {
      normalizeDateField(req.body, 'fecha_registro');
      normalizeDateField(req.body, 'fecha_salida');
      const nucleo_familiar_id = parsePositiveId(req.params.id, 'nucleo_familiar_id');
      const result = await this.addPersonaUseCase.execute({ ...req.body, nucleo_familiar_id });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listIntegrantes(req: Request, res: Response) {
    try {
      const nucleoFamiliarId = parsePositiveId(req.params.id, 'nucleo_familiar_id');
      res.status(200).json(await this.listIntegrantesUseCase.execute(nucleoFamiliarId));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateIntegrante(req: Request, res: Response) {
    try {
      normalizeDateField(req.body, 'fecha_salida');
      const nucleoFamiliarId = parsePositiveId(req.params.id, 'nucleo_familiar_id');
      const personaId = parsePositiveId(req.params.personaId, 'persona_id');
      const result = await this.updateIntegranteUseCase.execute(nucleoFamiliarId, personaId, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
