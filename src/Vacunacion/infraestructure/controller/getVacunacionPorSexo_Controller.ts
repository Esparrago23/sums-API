import { Request, Response, NextFunction } from "express";
import { GetVacunacionPorSexoUseCase } from "../../application/getVacunacionPorSexo_UseCase";
// 5. Vacunación segmentada por sexo

export class GetVacunacionPorSexo_Controller {
  constructor(private getVacunacionPorSexo: GetVacunacionPorSexoUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const vacunacion = await this.getVacunacionPorSexo.execute();
      res.status(200).json(vacunacion);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}