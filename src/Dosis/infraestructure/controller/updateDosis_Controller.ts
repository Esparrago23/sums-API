import { Request, Response, NextFunction } from "express";
import { UpdateDosisUseCase } from "../../application/updateDosis_UseCase";

export class UpdateDosis_Controller {
    constructor(private updateDosis: UpdateDosisUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const dosisData = req.body;
            const updatedDosis = await this.updateDosis.execute(id, dosisData);
            if (updatedDosis) {
                res.status(200).json(updatedDosis);
            } else {
                res.status(404).json({ error: "Dosis not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}