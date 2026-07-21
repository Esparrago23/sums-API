import { Request, Response, NextFunction } from "express";
import { ReadAllDatosLaboralesUseCase } from "../../application/readAllDatosLaborales_UseCase";

export class ReadAllDatosLaborales_Controller {
    constructor(private readAllDatosLaborales: ReadAllDatosLaboralesUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const datosLaborales = await this.readAllDatosLaborales.execute();
            res.status(200).json(datosLaborales);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}