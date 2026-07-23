import { Request, Response, NextFunction } from "express";
import { ReadAllUserUseCase } from "../../application/readAllUser_UseCase";

export class ReadAllUser_Controller {
    constructor(private readAllUser: ReadAllUserUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.readAllUser.execute();
            res.status(200).json(users);
        } catch (error:any) {
            (error as any).status = 400;
            next(error);
        }
    }
}