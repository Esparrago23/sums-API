import { InMemoryCedulaRepository } from './repositories/inMemoryCedulaRepository';

import { CreateCedulaUseCase } from '../application/createCedula_UseCase';
import { ReadAllCedulaUseCase } from '../application/readAllCedula_UseCase';
import { DeleteCedulaUseCase } from '../application/deleteCedula_UseCase';
import { ReadCedulaByIdUseCase } from '../application/readCedulaById_UseCase';
import { UpdateCedulaUseCase } from '../application/updateCedula_UseCase';
import { CapturaCompletaCedulaUseCase } from '../application/capturaCompletaCedula_UseCase';
import { SyncCedulasUseCase } from '../application/syncCedulas_UseCase';

import { CreateCedula_Controller } from './controllers/createCedula_Controller';
import { ReadAllCedula_Controller } from './controllers/readAllCedula_Controller';
import { DeleteCedula_Controller } from './controllers/deleteCedula_Controller';
import { ReadCedulaById_Controller } from './controllers/readCedulaById_Controller';
import { UpdateCedula_Controller } from './controllers/updateCedula_Controller';
import { CapturaCompletaCedulaController } from './controllers/capturaCompletaCedula_Controller';
import { SyncCedulasController } from './controllers/syncCedulas_Controller';

export const cedulaRepository = new InMemoryCedulaRepository();

export const createCedulaUseCase = new CreateCedulaUseCase(cedulaRepository);
export const readAllCedulaUseCase = new ReadAllCedulaUseCase(cedulaRepository);
export const deleteCedulaUseCase = new DeleteCedulaUseCase(cedulaRepository);
export const readCedulaByIdUseCase = new ReadCedulaByIdUseCase(cedulaRepository);
export const updateCedulaUseCase = new UpdateCedulaUseCase(cedulaRepository);
export const capturaCompletaCedulaUseCase = new CapturaCompletaCedulaUseCase();
export const syncCedulasUseCase = new SyncCedulasUseCase(capturaCompletaCedulaUseCase);

export const createCedulaController = new CreateCedula_Controller(createCedulaUseCase);
export const readAllCedulaController = new ReadAllCedula_Controller(readAllCedulaUseCase);
export const deleteCedulaController = new DeleteCedula_Controller(deleteCedulaUseCase);
export const readCedulaByIdController = new ReadCedulaById_Controller(readCedulaByIdUseCase);
export const updateCedulaController = new UpdateCedula_Controller(updateCedulaUseCase);
export const capturaCompletaCedulaController = new CapturaCompletaCedulaController(capturaCompletaCedulaUseCase);
export const syncCedulasController = new SyncCedulasController(syncCedulasUseCase);
