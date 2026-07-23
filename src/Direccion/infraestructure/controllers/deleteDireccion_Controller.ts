import { Request, Response, NextFunction } from "express";
import { DeleteDireccionUseCase } from "../../application/deleteDireccion_UseCase";

export class DeleteDireccion_Controller {
  constructor(private deleteDireccion: DeleteDireccionUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.deleteDireccion.execute(id);
      res.status(200).json({ message: "Direccion deleted successfully" });
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}