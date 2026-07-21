import { Request, Response, NextFunction } from "express";
import { UpdateEntrevistadorUseCase } from "../../application/updateEntrevistador_UseCase";

export class UpdateEntrevistador_Controller {
    constructor(private updateEntrevistador: UpdateEntrevistadorUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const entrevistadorData = req.body;

            // Convertir la fecha si viene como string
            if (typeof entrevistadorData.fecha_registro === 'string') {
                entrevistadorData.fecha_registro = new Date(entrevistadorData.fecha_registro);
            }

            const updatedEntrevistador = await this.updateEntrevistador.execute(id, entrevistadorData);
            if (updatedEntrevistador) {
                res.status(200).json(updatedEntrevistador);
            } else {
                res.status(404).json({ error: "Entrevistador not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}