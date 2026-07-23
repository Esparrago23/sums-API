import { Request, Response, NextFunction } from "express";
import { DeletePersonaUseCase } from "../../application/deletePersona_UseCase";

export class DeletePersona_Controller {
  constructor(private deletePersona: DeletePersonaUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.deletePersona.execute(id);
      res.status(200).json({ message: "Persona deleted successfully" });
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}