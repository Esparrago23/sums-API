import { Request, Response, NextFunction } from "express";
import { UpdateCedulaUseCase } from "../../application/updateCedula_UseCase";
import { normalizeDateField, parsePositiveId } from "../../../shared/validation";

export class UpdateCedula_Controller {
    constructor(private updateCedula: UpdateCedulaUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parsePositiveId(req.params.id);
            const cedulaData = req.body;
            normalizeDateField(cedulaData, 'fecha_registro');
            const updatedCedula = await this.updateCedula.execute(id, cedulaData);
            if (updatedCedula) {
                res.status(200).json(updatedCedula);
            } else {
                res.status(404).json({ error: "Cedula not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}
