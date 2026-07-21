import { Request, Response, NextFunction } from "express";
import { DeleteVacunasUseCase } from "../../application/deleteVacunas_UseCase";

export class DeleteVacunas_Controller {
    constructor(private deleteVacunas: DeleteVacunasUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.deleteVacunas.execute(id);
            res.status(204).send();
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}