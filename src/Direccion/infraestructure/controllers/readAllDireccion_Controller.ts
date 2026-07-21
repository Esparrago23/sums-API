import { Request, Response, NextFunction } from "express";
import { ReadAllDireccionUseCase } from "../../application/readAllDireccion_UseCase";

export class ReadAllDireccion_Controller {
  constructor(private readAllDireccion: ReadAllDireccionUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const direcciones = await this.readAllDireccion.execute();
      res.status(200).json(direcciones);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}