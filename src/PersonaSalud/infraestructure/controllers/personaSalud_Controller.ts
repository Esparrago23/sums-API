import { Request, Response } from 'express';
import { PersonaSaludUseCase } from '../../application/personaSalud_UseCase';
import { PersonaSaludTipo } from '../../domain/repositories/IPersonaSaludRepository';
import {
  assertIntegerInRange,
  assertTamizajeDate,
  normalizeDateField,
  parsePositiveId
} from '../../../shared/validation';

const dateFieldsByTipo: Record<PersonaSaludTipo, string[]> = {
  alimentacion: ['fecha_registro'],
  higiene: ['fecha_registro'],
  'seguridad-social': ['fecha_registro'],
  discapacidades: [],
  toxicomanias: [],
  'enfermedades-cronicas': [],
  'salud-preventiva': [
    'fecha_tamizaje_cervico_uterino',
    'fecha_tamizaje_cancer_mama',
    'fecha_registro'
  ],
  'servicios-salud': ['fecha_registro']
};

export class PersonaSaludController {
  constructor(private useCase: PersonaSaludUseCase) {}

  create(tipo: PersonaSaludTipo) {
    return async (req: Request, res: Response) => {
      try {
        this.prepareAndValidate(tipo, req.body);
        const result = await this.useCase.create(tipo, req.body);
        res.status(201).json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  readAll(tipo: PersonaSaludTipo) {
    return async (_req: Request, res: Response) => {
      try {
        res.status(200).json(await this.useCase.readAll(tipo));
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    };
  }

  readById(tipo: PersonaSaludTipo) {
    return async (req: Request, res: Response) => {
      try {
        res.status(200).json(await this.useCase.readById(tipo, parsePositiveId(req.params.id)));
      } catch (error: any) {
        res.status(404).json({ error: error.message });
      }
    };
  }

  update(tipo: PersonaSaludTipo) {
    return async (req: Request, res: Response) => {
      try {
        this.prepareAndValidate(tipo, req.body);
        const result = await this.useCase.update(tipo, parsePositiveId(req.params.id), req.body);
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  delete(tipo: PersonaSaludTipo) {
    return async (req: Request, res: Response) => {
      try {
        await this.useCase.delete(tipo, parsePositiveId(req.params.id));
        res.status(200).json({ message: 'Registro eliminado' });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  private prepareAndValidate(tipo: PersonaSaludTipo, data: Record<string, unknown>): void {
    dateFieldsByTipo[tipo].forEach((field) => normalizeDateField(data, field));

    if (tipo === 'alimentacion') {
      assertIntegerInRange(data.dias_proteina, 'dias_proteina', 0, 7);
      assertIntegerInRange(data.dias_frutas_verduras, 'dias_frutas_verduras', 0, 7);
      assertIntegerInRange(data.dias_cereales, 'dias_cereales', 0, 7);
    }

    if (tipo === 'salud-preventiva') {
      assertTamizajeDate(data, 'tamizaje_cervico_uterino', 'fecha_tamizaje_cervico_uterino');
      assertTamizajeDate(data, 'tamizaje_cancer_mama', 'fecha_tamizaje_cancer_mama');
    }
  }
}
