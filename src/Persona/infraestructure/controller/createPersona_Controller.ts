import { Request, Response, NextFunction } from "express";
import { CreatePersonaUseCase } from "../../application/createPersona_UseCase";
import { normalizeDateField } from "../../../shared/validation";

export class CreatePersona_Controller {
  constructor(private createPersona: CreatePersonaUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const personaData = req.body;
      normalizeDateField(personaData, 'fecha_nacimiento');

      const newPersona = await this.createPersona.execute(personaData);
      res.status(201).json(newPersona);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}
