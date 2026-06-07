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
}
