import { CatalogoItem } from '../entities/catalogo';

export interface CatalogoConfig {
  key: string;
  tableName?: string;
  idColumn?: string;
  labelColumn?: string;
  descriptionColumn?: string;
  staticData?: any[];
}

export interface ICatalogosRepository {
  listCatalogos(): CatalogoConfig[];
  readAll(key: string): Promise<CatalogoItem[]>;
}
