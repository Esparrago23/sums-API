import { Request, Response, NextFunction } from "express";
import { DeleteDosisUseCase } from "../../application/deleteDosis_UseCase";

export class DeleteDosis_Controller {
    constructor(private deleteDosis: DeleteDosisUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.deleteDosis.execute(id);
            res.status(204).send();
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}