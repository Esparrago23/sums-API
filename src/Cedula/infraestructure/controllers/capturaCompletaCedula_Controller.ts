import { Request, Response } from 'express';
import { CapturaCompletaCedulaUseCase } from '../../application/capturaCompletaCedula_UseCase';

export class CapturaCompletaCedulaController {
  constructor(private capturaCompletaCedula: CapturaCompletaCedulaUseCase) {}

  async run(req: Request, res: Response) {
    try {
      const result = await this.capturaCompletaCedula.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
