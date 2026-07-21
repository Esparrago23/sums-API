import { Request, Response, NextFunction } from "express";
import { DeleteCedulaUseCase } from "../../application/deleteCedula_UseCase";

export class DeleteCedula_Controller {
    constructor(private deleteCedula: DeleteCedulaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.deleteCedula.execute(id);
            res.status(200).json({ message: "Cedula deleted successfully" });
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}