import { Request, Response } from 'express';
import { CatalogosUseCase } from '../../application/catalogos_UseCase';

export class CatalogosController {
  constructor(private useCase: CatalogosUseCase) {}

  listCatalogos(_req: Request, res: Response) {
    res.status(200).json(this.useCase.listCatalogos().map((catalogo) => catalogo.key));
  }

  async readAll(req: Request, res: Response) {
    try {
      res.status(200).json(await this.useCase.readAll(req.params.catalogo));
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createCatalogItem(req: Request, res: Response) {
    try {
      const item = await this.useCase.createCatalogItem(req.params.catalogo, req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
