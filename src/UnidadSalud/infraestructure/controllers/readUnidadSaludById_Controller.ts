import { Request, Response, NextFunction } from "express";
import { ReadUnidadSaludByIdUseCase } from "../../application/readUnidadSaludByIdUseCase";

export class ReadUnidadSaludById_Controller {
  constructor(private readUnidadSaludById: ReadUnidadSaludByIdUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const unidadSalud = await this.readUnidadSaludById.execute(id);
      if (unidadSalud) {
        res.status(200).json(unidadSalud);
      } else {
        res.status(404).json({ error: "Unidad de salud no encontrada" });
      }
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}