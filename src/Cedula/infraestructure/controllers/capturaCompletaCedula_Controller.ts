import { Request, Response, NextFunction } from 'express';
import { CapturaCompletaCedulaUseCase } from '../../application/capturaCompletaCedula_UseCase';

export class CapturaCompletaCedulaController {
  constructor(private capturaCompletaCedula: CapturaCompletaCedulaUseCase) {}

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Received payload:', JSON.stringify(req.body).substring(0, 100));
      const result = await this.capturaCompletaCedula.execute(req.body);
      console.log('Execution finished');
      res.status(201).json(result);
    } catch (error: any) {
      console.log('Error caught in controller:', error);
      (error as any).status = 400;
      next(error);
    }
  }
}
