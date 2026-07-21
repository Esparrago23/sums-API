import { Request, Response, NextFunction } from "express";
import { GetVacunaDosisAplicacionPorPersonaUseCase } from "../../application/getAplicacionesPorPersona_UseCase";
// 2. Total de aplicaciones por vacuna y tipo de dosis para una persona específica

export class GetVacunaDosisAplicacionPorPersona_Controller {
  constructor(private getVacunaDosisAplicacionPorPersona: GetVacunaDosisAplicacionPorPersonaUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const personaId = parseInt(req.params.personaId);
      const aplicaciones = await this.getVacunaDosisAplicacionPorPersona.execute(personaId);
      res.status(200).json(aplicaciones);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}