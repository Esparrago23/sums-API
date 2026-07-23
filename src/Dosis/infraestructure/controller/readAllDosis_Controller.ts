import { Request, Response, NextFunction } from "express";
import { ReadAllDosisUseCase } from "../../application/readAllDosis_UseCase";

export class ReadAllDosis_Controller {
    constructor(private readAllDosis: ReadAllDosisUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const dosis = await this.readAllDosis.execute();
            res.status(200).json(dosis);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}