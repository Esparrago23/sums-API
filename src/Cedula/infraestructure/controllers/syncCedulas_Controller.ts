import { Request, Response } from 'express';
import { SyncCedulasUseCase } from '../../application/syncCedulas_UseCase';

export class SyncCedulasController {
  constructor(private syncCedulas: SyncCedulasUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      let payloads = req.body;
      if (req.body.payloads && Array.isArray(req.body.payloads)) {
        payloads = req.body.payloads;
      }
      
      if (!Array.isArray(payloads)) {
        res.status(400).json({ error: 'Expected an array of cedulas' });
        return;
      }

      console.log(`Received sync payload with ${payloads.length} cedulas.`);
      const results = await this.syncCedulas.execute(payloads);
      console.log('Sync execution finished');
      
      res.status(201).json(results);
    } catch (error: any) {
      console.log('Error caught in sync controller:', error);
      res.status(400).json({ error: error?.message || 'Unknown error' });
    }
  }
}
