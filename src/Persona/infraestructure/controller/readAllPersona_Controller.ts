import { Request, Response, NextFunction } from "express";
import { ReadAllPersonaUseCase } from "../../application/readAllPersona_UseCase";

export class ReadAllPersona_Controller {
  constructor(private readAllPersona: ReadAllPersonaUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const personas = await this.readAllPersona.execute();
      res.status(200).json(personas);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}