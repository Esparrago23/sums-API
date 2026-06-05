import { InMemoryEntrevistadorRepository } from './repositories/inMemoryEntrevistadorRepository';

import { CreateEntrevistadorUseCase } from '../application/createEntrevistador_UseCase';
import { ReadAllEntrevistadorUseCase } from '../application/readAllEntrevistador_UseCase';
import { DeleteEntrevistadorUseCase } from '../application/deleteEntrevistador_UseCase';
import { ReadEntrevistadorByIdUseCase } from '../application/readEntrevistadorById_UseCase';
import { UpdateEntrevistadorUseCase } from '../application/updateEntrevistador_UseCase';

import { CreateEntrevistador_Controller } from './controllers/createEntrevistador_Controller';
import { ReadAllEntrevistador_Controller } from './controllers/readAllEntrevistador_Controller';
import { DeleteEntrevistador_Controller } from './controllers/deleteEntrevistador_Controller';
import { ReadEntrevistadorById_Controller } from './controllers/readEntrevistadorById_Controller';
import { UpdateEntrevistador_Controller } from './controllers/updateEntrevistador_Controller';

export const entrevistadorRepository = new InMemoryEntrevistadorRepository();

export const createEntrevistadorUseCase = new CreateEntrevistadorUseCase(entrevistadorRepository);
export const readAllEntrevistadorUseCase = new ReadAllEntrevistadorUseCase(entrevistadorRepository);
export const deleteEntrevistadorUseCase = new DeleteEntrevistadorUseCase(entrevistadorRepository);
export const readEntrevistadorByIdUseCase = new ReadEntrevistadorByIdUseCase(entrevistadorRepository);
export const updateEntrevistadorUseCase = new UpdateEntrevistadorUseCase(entrevistadorRepository);

export const createEntrevistadorController = new CreateEntrevistador_Controller(createEntrevistadorUseCase);
export const readAllEntrevistadorController = new ReadAllEntrevistador_Controller(readAllEntrevistadorUseCase);
export const deleteEntrevistadorController = new DeleteEntrevistador_Controller(deleteEntrevistadorUseCase);
export const readEntrevistadorByIdController = new ReadEntrevistadorById_Controller(readEntrevistadorByIdUseCase);
export const updateEntrevistadorController = new UpdateEntrevistador_Controller(updateEntrevistadorUseCase);
