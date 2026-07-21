import { Request, Response, NextFunction } from "express";
import { DeleteEntrevistadorUseCase } from "../../application/deleteEntrevistador_UseCase";

export class DeleteEntrevistador_Controller {
    constructor(private deleteEntrevistador: DeleteEntrevistadorUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.deleteEntrevistador.execute(id);
            res.status(200).json({ message: "Entrevistador deleted successfully" });
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}