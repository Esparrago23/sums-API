import { Request, Response, NextFunction } from "express";
import { DeleteFamiliaUseCase } from "../../application/deleteFamilia_UseCase";

export class DeleteFamilia_Controller {
    constructor(private deleteFamilia: DeleteFamiliaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            await this.deleteFamilia.execute(id);
            res.status(200).json({ message: "Familia deleted successfully" });
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}