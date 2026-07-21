import { Request, Response, NextFunction } from "express";
import { LoginUserUseCase } from "../../application/loginUser_UseCase";

export class LoginUser_Controller {
    constructor(private loginUser: LoginUserUseCase) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const { nombre_usuario, contrasena } = req.body;
            const result = await this.loginUser.execute(nombre_usuario, contrasena);

            if (result) {
                res.status(200).json(result);
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } catch (error: any) {
            (error as any).status = 400;
            next(error);
        }
    }
}