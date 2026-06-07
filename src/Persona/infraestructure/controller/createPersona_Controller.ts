import { Request, Response } from "express";
import { CreatePersonaUseCase } from "../../application/createPersona_UseCase";
import { normalizeDateField } from "../../../shared/validation";

export class CreatePersona_Controller {
  constructor(private createPersona: CreatePersonaUseCase) {}

  async run(req: Request, res: Response) {
    try {
      const personaData = req.body;
      normalizeDateField(personaData, 'fecha_nacimiento');

      const newPersona = await this.createPersona.execute(personaData);
      res.status(201).json(newPersona);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
