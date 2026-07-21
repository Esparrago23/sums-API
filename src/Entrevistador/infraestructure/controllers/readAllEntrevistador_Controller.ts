import { Request, Response, NextFunction } from "express";
import { ReadAllEntrevistadorUseCase } from "../../application/readAllEntrevistador_UseCase";

export class ReadAllEntrevistador_Controller {
    constructor(private readAllEntrevistador: ReadAllEntrevistadorUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const entrevistadores = await this.readAllEntrevistador.execute();
            res.status(200).json(entrevistadores);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}