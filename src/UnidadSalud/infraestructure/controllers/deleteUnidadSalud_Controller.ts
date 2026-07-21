import { Request, Response, NextFunction } from "express";
import { DeleteUnidadSaludUseCase } from "../../application/deleteUnidadSaludUseCase";

export class DeleteUnidadSalud_Controller {
  constructor(private deleteUnidadSalud: DeleteUnidadSaludUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.deleteUnidadSalud.execute(id);
      res.status(200).json({ message: "Unidad de salud eliminada con éxito" });
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}