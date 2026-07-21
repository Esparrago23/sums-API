import { Request, Response, NextFunction } from "express";
import { CreateViviendaUseCase } from "../../application/createVivienda_UseCase";

export class CreateVivienda_Controller {
    constructor(private createVivienda: CreateViviendaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const viviendaData = req.body;
            const newVivienda = await this.createVivienda.execute(viviendaData);
            res.status(201).json(newVivienda);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}