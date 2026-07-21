import { Request, Response, NextFunction } from "express";
import { GetVacunaDosisAplicacionUseCase } from "../../application/getAplicacionesPorVacunaYDosis_UseCase";
// 1. Total de aplicaciones por vacuna y tipo de dosis

export class GetVacunaDosisAplicacion_Controller {
  constructor(private getVacunaDosisAplicacion: GetVacunaDosisAplicacionUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const aplicaciones = await this.getVacunaDosisAplicacion.execute();
      res.status(200).json(aplicaciones);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}