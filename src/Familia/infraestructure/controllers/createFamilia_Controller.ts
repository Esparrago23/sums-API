import { Request, Response, NextFunction } from "express";
import { CreateFamiliaUseCase } from "../../application/createFamilia_UseCase";

export class CreateFamilia_Controller {
    constructor(private createFamilia: CreateFamiliaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const familiaData = req.body;

            // Convertir la fecha si viene como string
            if (typeof familiaData.fecha_encuesta === 'string') {
                familiaData.fecha_encuesta = new Date(familiaData.fecha_encuesta);
            }

            const newFamilia = await this.createFamilia.execute(familiaData);
            res.status(201).json(newFamilia);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}