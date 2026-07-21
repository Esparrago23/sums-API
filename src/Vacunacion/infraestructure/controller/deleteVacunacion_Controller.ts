import { Request, Response, NextFunction } from "express";
import { DeleteVacunacionUseCase } from "../../application/deleteVacunacion_UseCase";

export class DeleteVacunacionController {
  constructor(private deleteVacunacionUseCase: DeleteVacunacionUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.deleteVacunacionUseCase.execute(id);
      res.status(200).json({ message: "Vacunacion deleted successfully" });
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}
