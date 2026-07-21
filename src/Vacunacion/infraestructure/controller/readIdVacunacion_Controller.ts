import { Request, Response, NextFunction } from "express";
import { ReadByIdVacunacionUseCase } from "../../application/readByIdVacunacion_UseCase";

export class ReadById_Controller {
  constructor(private readByIdVacunacionUseCase: ReadByIdVacunacionUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const vacunacion = await this.readByIdVacunacionUseCase.execute(id);
      if (vacunacion) {
        res.status(200).json(vacunacion);
      } else {
        res.status(404).json({ error: "Vacunacion not found" });
      }
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}
