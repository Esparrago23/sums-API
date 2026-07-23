import { Request, Response, NextFunction } from "express";
import { UpdateFamiliaUseCase } from "../../application/updateFamilia_UseCase";

export class UpdateFamilia_Controller {
    constructor(private updateFamilia: UpdateFamiliaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const familiaData = req.body;

            // Convertir la fecha si viene como string
            if (typeof familiaData.fecha_encuesta === 'string') {
                familiaData.fecha_encuesta = new Date(familiaData.fecha_encuesta);
            }

            const updatedFamilia = await this.updateFamilia.execute(id, familiaData);
            if (updatedFamilia) {
                res.status(200).json(updatedFamilia);
            } else {
                res.status(404).json({ error: "Familia not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}