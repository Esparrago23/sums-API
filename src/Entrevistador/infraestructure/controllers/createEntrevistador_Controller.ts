import { Request, Response, NextFunction } from "express";
import { CreateEntrevistadorUseCase } from "../../application/createEntrevistador_UseCase";

export class CreateEntrevistador_Controller {
    constructor(private createEntrevistador: CreateEntrevistadorUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const entrevistadorData = req.body;

            // Convertir la fecha si viene como string
            if (typeof entrevistadorData.fecha_registro === 'string') {
                entrevistadorData.fecha_registro = new Date(entrevistadorData.fecha_registro);
            }

            const newEntrevistador = await this.createEntrevistador.execute(entrevistadorData);
            res.status(201).json(newEntrevistador);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}