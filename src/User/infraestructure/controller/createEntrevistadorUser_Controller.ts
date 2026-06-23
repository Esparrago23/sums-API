import { Request, Response } from 'express';
import { CreateEntrevistadorUserUseCase } from '../../application/createEntrevistadorUser_UseCase';

export class CreateEntrevistadorUserController {
  constructor(private createEntrevistadorUser: CreateEntrevistadorUserUseCase) {}

  async run(req: Request, res: Response) {
    try {
      const result = await this.createEntrevistadorUser.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      const message = error?.code === '23505'
        ? 'El nombre de usuario o CLUES ya existe.'
        : error.message;
      res.status(400).json({ error: message });
    }
  }
}
