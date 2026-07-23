import { Request, Response, NextFunction } from "express";
import { ReadAllCedulaUseCase } from "../../application/readAllCedula_UseCase";

export class ReadAllCedula_Controller {
    constructor(private readAllCedula: ReadAllCedulaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const pageStr = req.query.page as string;
            const limitStr = req.query.limit as string;
            const search = (req.query.search as string) || '';

            let page = parseInt(pageStr, 10);
            if (isNaN(page) || page <= 0) page = 1;

            let limit = parseInt(limitStr, 10);
            if (isNaN(limit) || limit <= 0) limit = 50;
            if (limit > 100) limit = 100;

            const result = await this.readAllCedula.execute(page, limit, search);
            res.status(200).json(result);
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}