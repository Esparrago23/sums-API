import { Request, Response, NextFunction } from "express";
import { ReadViviendaByIdUseCase } from "../../application/readViviendaById_UseCase";

export class ReadViviendaById_Controller {
    constructor(private readViviendaById: ReadViviendaByIdUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const vivienda = await this.readViviendaById.execute(id);
            if (vivienda) {
                res.status(200).json(vivienda);
            } else {
                res.status(404).json({ error: "Vivienda not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}