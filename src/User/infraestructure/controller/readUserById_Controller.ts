// src/User/infraestructure/controller/readUserById_Controller.ts
import { Request, Response, NextFunction } from "express";
import { ReadUserByIDUseCase } from "../../application/readUserById_UseCase";

export class ReadUserById_Controller {
    constructor(private readUserById: ReadUserByIDUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.id, 10); // Convertir a número
            const user = await this.readUserById.execute(userId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}