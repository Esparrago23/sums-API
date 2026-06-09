import { PersonaSaludUseCase } from '../application/personaSalud_UseCase';
import { PersonaSaludController } from './controllers/personaSalud_Controller';
import { InMemoryPersonaSaludRepository } from './repositories/inMemoryPersonaSaludRepository';

const repository = new InMemoryPersonaSaludRepository();
const useCase = new PersonaSaludUseCase(repository);

export const personaSaludController = new PersonaSaludController(useCase);
