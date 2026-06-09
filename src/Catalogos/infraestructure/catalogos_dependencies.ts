import { CatalogosUseCase } from '../application/catalogos_UseCase';
import { CatalogosController } from './controllers/catalogos_Controller';
import { InMemoryCatalogosRepository } from './repositories/inMemoryCatalogosRepository';

const repository = new InMemoryCatalogosRepository();
const useCase = new CatalogosUseCase(repository);

export const catalogosController = new CatalogosController(useCase);
