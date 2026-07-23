import { Request, Response, NextFunction } from "express";
import { UpdateViviendaUseCase } from "../../application/updateVivienda_UseCase";

export class UpdateVivienda_Controller {
    constructor(private updateVivienda: UpdateViviendaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const viviendaData = req.body;
            const updatedVivienda = await this.updateVivienda.execute(id, viviendaData);
            if (updatedVivienda) {
                res.status(200).json(updatedVivienda);
            } else {
                res.status(404).json({ error: "Vivienda not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}