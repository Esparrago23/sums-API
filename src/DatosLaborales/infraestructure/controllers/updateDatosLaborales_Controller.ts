import { Request, Response, NextFunction } from "express";
import { UpdateDatosLaboralesUseCase } from "../../application/updateDatosLaborales_UseCase";

export class UpdateDatosLaborales_Controller {
    constructor(private updateDatosLaborales: UpdateDatosLaboralesUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const datosLaboralesData = req.body;
            const updatedDatosLaborales = await this.updateDatosLaborales.execute(id, datosLaboralesData);
            if (updatedDatosLaborales) {
                res.status(200).json(updatedDatosLaborales);
            } else {
                res.status(404).json({ error: "Datos laborales not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}
