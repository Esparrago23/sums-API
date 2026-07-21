import { Request, Response, NextFunction } from "express";
import { ReadDosisByIdUseCase } from "../../application/readDosisById_UseCase";

export class ReadDosisById_Controller {
    constructor(private readDosisById: ReadDosisByIdUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const dosis = await this.readDosisById.execute(id);
            if (dosis) {
                res.status(200).json(dosis);
            } else {
                res.status(404).json({ error: "Dosis not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}