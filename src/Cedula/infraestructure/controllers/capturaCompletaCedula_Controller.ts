import { Request, Response } from 'express';
import { CapturaCompletaCedulaUseCase } from '../../application/capturaCompletaCedula_UseCase';

export class CapturaCompletaCedulaController {
  constructor(private capturaCompletaCedula: CapturaCompletaCedulaUseCase) {}

  async run(req: Request, res: Response) {
    try {
      console.log('Received payload:', JSON.stringify(req.body).substring(0, 100));
      const result = await this.capturaCompletaCedula.execute(req.body);
      console.log('Execution finished');
      res.status(201).json(result);
    } catch (error: any) {
      console.log('Error caught in controller:', error);
      res.status(400).json({ error: error?.message || 'Unknown error' });
    }
  }
}
