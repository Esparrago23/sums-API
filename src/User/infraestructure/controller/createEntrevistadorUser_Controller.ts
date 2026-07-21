import { Request, Response, NextFunction } from 'express';
import { CreateEntrevistadorUserUseCase } from '../../application/createEntrevistadorUser_UseCase';

export class CreateEntrevistadorUserController {
  constructor(private createEntrevistadorUser: CreateEntrevistadorUserUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.createEntrevistadorUser.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      // Se conserva el mensaje amigable para violación de UNIQUE (usuario/CLUES
      // duplicados), pero delegando la respuesta al errorHandler centralizado
      // en vez de responder directamente desde el controlador.
      if (error?.code === '23505') {
        error.message = 'El nombre de usuario o CLUES ya existe.';
      }
      error.status = 400;
      next(error);
    }
  }
}
