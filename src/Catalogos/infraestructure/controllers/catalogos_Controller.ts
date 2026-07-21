import { Request, Response, NextFunction } from 'express';
import { CatalogosUseCase } from '../../application/catalogos_UseCase';

export class CatalogosController {
  constructor(private useCase: CatalogosUseCase) {}

  listCatalogos(_req: Request, res: Response, next: NextFunction) {
    res.status(200).json(this.useCase.listCatalogos().map((catalogo) => catalogo.key));
  }

  async readAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await this.useCase.readAll(req.params.catalogo));
    } catch (error: any) {
      (error as any).status = 404;
      next(error);
    }
  }

  async createCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await this.useCase.createCatalogItem(req.params.catalogo, req.body);
      res.status(201).json(item);
    } catch (error: any) {
      (error as any).status = 400;
      next(error);
    }
  }
}
