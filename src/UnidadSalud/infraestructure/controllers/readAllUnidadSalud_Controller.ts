import { Request, Response, NextFunction } from "express";
import { ReadAllUnidadSaludUseCase } from "../../application/readAllUnidadSaludUseCase";

export class ReadAllUnidadSalud_Controller {
  constructor(private readAllUnidadSalud: ReadAllUnidadSaludUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const unidadesSalud = await this.readAllUnidadSalud.execute();
      res.status(200).json(unidadesSalud);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}