import { Request, Response, NextFunction } from "express";
import { GetVacunacionPorRangoEdadUseCase } from "../../application/getVacunacionPorRangoEdad_UseCase";
// 6. Vacunación por rangos de edad

export class GetVacunacionPorRangoEdad_Controller {
  constructor(private getVacunacionPorRangoEdad: GetVacunacionPorRangoEdadUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const vacunacion = await this.getVacunacionPorRangoEdad.execute();
      res.status(200).json(vacunacion);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}