import { Request, Response, NextFunction } from "express";
import { ReadDatosLaboralesByIdUseCase } from "../../application/readDatosLaboralesById_UseCase";

export class ReadDatosLaboralesById_Controller {
    constructor(private readDatosLaboralesById: ReadDatosLaboralesByIdUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const datosLaborales = await this.readDatosLaboralesById.execute(id);
            if (datosLaborales) {
                res.status(200).json(datosLaborales);
            } else {
                res.status(404).json({ error: "Datos laborales not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}