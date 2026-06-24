import { CatalogoItem } from '../domain/entities/catalogo';
import { CatalogoConfig, ICatalogosRepository } from '../domain/repositories/ICatalogosRepository';

export class CatalogosUseCase {
  constructor(private repository: ICatalogosRepository) {}

  listCatalogos(): CatalogoConfig[] {
    return this.repository.listCatalogos();
  }

  readAll(key: string): Promise<CatalogoItem[]> {
    return this.repository.readAll(key);
  }

  createCatalogItem(key: string, data: Partial<CatalogoItem>): Promise<CatalogoItem> {
    return this.repository.createCatalogItem(key, data);
  }
}
