import { Request, Response, NextFunction } from "express";
import { ReadAllFamiliaUseCase } from "../../application/readAllFamilia_UseCase";

export class ReadAllFamilia_Controller {
    constructor(private readAllFamilia: ReadAllFamiliaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const familias = await this.readAllFamilia.execute();
            res.status(200).json(familias);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}
