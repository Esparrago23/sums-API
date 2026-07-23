import { Request, Response, NextFunction } from "express";
import { ReadAllViviendaUseCase } from "../../application/readAllVivienda_UseCase";

export class ReadAllVivienda_Controller {
    constructor(private readAllVivienda: ReadAllViviendaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const viviendas = await this.readAllVivienda.execute();
            res.status(200).json(viviendas);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}