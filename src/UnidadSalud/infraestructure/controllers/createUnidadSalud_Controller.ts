import { Request, Response, NextFunction } from "express";
import { CreateUnidadSaludUseCase } from "../../application/createUnidadSaludUseCase";

export class CreateUnidadSalud_Controller {
  constructor(private createUnidadSalud: CreateUnidadSaludUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const unidadSaludData = req.body;
      const newUnidadSalud = await this.createUnidadSalud.execute(unidadSaludData);
      res.status(201).json(newUnidadSalud);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}