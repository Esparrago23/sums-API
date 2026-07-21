import { Request, Response, NextFunction } from "express";
import { ReadAllVacunasUseCase } from "../../application/readAllVacunas_UseCase";

export class ReadAllVacunas_Controller {
    constructor(private readAllVacunas: ReadAllVacunasUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const vacunas = await this.readAllVacunas.execute();
            res.status(200).json(vacunas);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}