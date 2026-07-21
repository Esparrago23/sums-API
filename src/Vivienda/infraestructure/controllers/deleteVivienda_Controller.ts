import { Request, Response, NextFunction } from "express";
import { DeleteViviendaUseCase } from "../../application/deleteVivienda_UseCase";

export class DeleteVivienda_Controller {
    constructor(private deleteVivienda: DeleteViviendaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.deleteVivienda.execute(id);
            res.status(200).json({ message: "Vivienda deleted successfully" });
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}