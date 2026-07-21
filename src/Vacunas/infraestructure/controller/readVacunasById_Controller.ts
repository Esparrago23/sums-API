import { Request, Response, NextFunction } from "express";
import { ReadVacunasByIdUseCase } from "../../application/readVacunasById_UseCase";

export class ReadVacunasById_Controller {
    constructor(private readVacunasById: ReadVacunasByIdUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id, 10);
            const vacunas = await this.readVacunasById.execute(id);
            if (vacunas) {
                res.status(200).json(vacunas);
            } else {
                res.status(404).json({ error: "Vacuna not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}