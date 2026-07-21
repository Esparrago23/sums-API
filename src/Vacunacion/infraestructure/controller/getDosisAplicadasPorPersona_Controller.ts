import { Request, Response, NextFunction } from "express";
import { GetDosisAplicadasPorPersonaUseCase } from "../../application/getDosisAplicadasPorPersona_UseCase";
// 7. Total de dosis aplicadas por persona (resumen individual)

export class GetDosisAplicadasPorPersona_Controller {
  constructor(private getDosisAplicadasPorPersona: GetDosisAplicadasPorPersonaUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const dosis = await this.getDosisAplicadasPorPersona.execute();
      res.status(200).json(dosis);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}