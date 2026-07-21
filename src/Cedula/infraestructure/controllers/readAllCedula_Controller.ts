import { Request, Response, NextFunction } from "express";
import { ReadAllCedulaUseCase } from "../../application/readAllCedula_UseCase";

export class ReadAllCedula_Controller {
    constructor(private readAllCedula: ReadAllCedulaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const cedulas = await this.readAllCedula.execute();
            res.status(200).json(cedulas);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}