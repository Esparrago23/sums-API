import { Request, Response, NextFunction } from "express";
import { UpdateVacunacionUseCase } from "../../application/updateVacunacion_UseCase";

export class UpdateVacunacion_Controller {
  constructor(private updateVacunacion: UpdateVacunacionUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const vacunacionData = req.body;

      // Convertir la fecha si viene como string
      if (typeof vacunacionData.fecha_aplicacion === 'string') {
        vacunacionData.fecha_aplicacion = new Date(vacunacionData.fecha_aplicacion);
      }

      const updatedVacunacion = await this.updateVacunacion.execute(id, vacunacionData);
      if (updatedVacunacion) {
        res.status(200).json(updatedVacunacion);
      } else {
        res.status(404).json({ error: "Vacunacion not found" });
      }
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}