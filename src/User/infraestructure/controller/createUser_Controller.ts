import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../application/createUser_UseCase";

export class CreateUser_Controller {
    // allowRoleAssignment solo debe ser true para la instancia usada detrás de una ruta
    // protegida con roleMiddleware admin/superadmin (ver /users/admin/register). La
    // instancia pública (/register) debe mantenerlo en false para ignorar el rol_id
    // que envíe el cliente.
    constructor(private createUser: CreateUserUseCase, private allowRoleAssignment: boolean = false) {}

    async run(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.body;
            const newUser = await this.createUser.execute(user, { allowRoleAssignment: this.allowRoleAssignment });
            res.status(201).json(newUser);
        } catch (error:any) {
            (error as any).status = 400;
            next(error);
        }
    }
}