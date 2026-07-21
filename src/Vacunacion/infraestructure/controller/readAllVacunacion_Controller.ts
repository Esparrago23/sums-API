import { Request, Response, NextFunction } from "express";
import { ReadAllVacunacion } from "../../application/readAllVacunacion_UseCase";

export class ReadAllVacunacion_Controller {
  constructor(private readAllVacunacion: ReadAllVacunacion) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const vacunaciones = await this.readAllVacunacion.execute();
      res.status(200).json(vacunaciones);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}