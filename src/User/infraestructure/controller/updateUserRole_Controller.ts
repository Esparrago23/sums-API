import { Request, Response } from "express";
import { UpdateUserUseCase } from "../../application/updateUser_UseCase";

export class UpdateUserRoleController {
    constructor(private updateUserUseCase: UpdateUserUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { rol_id } = req.body;
            
            // Reutilizamos el caso de uso existente para actualizar el usuario
            // Aunque UpdateUserUseCase podría necesitar todo el objeto, asumiendo que actualizar campos parciales o que
            // necesitamos obtener el usuario primero y luego actualizarlo. 
            // Esto dependerá de la implementación de UpdateUserUseCase.
            const user = await this.updateUserUseCase.execute(Number(id), { rol_id });
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
