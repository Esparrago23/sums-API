import { Request, Response, NextFunction } from "express";
import { ReadPersonaByIdUseCase } from "../../application/readPersonaById_UseCase";

export class ReadPersonaById_Controller {
  constructor(private readPersonaById: ReadPersonaByIdUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const persona = await this.readPersonaById.execute(id);
      if (persona) {
        res.status(200).json(persona);
      } else {
        res.status(404).json({ error: "Persona not found" });
      }
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}