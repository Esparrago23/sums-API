import { InMemoryViviendaRepository } from './repositories/inMemoryViviendaRepository';

import { CreateViviendaUseCase } from '../application/createVivienda_UseCase';
import { ReadAllViviendaUseCase } from '../application/readAllVivienda_UseCase';
import { DeleteViviendaUseCase } from '../application/deleteVivienda_UseCase';
import { ReadViviendaByIdUseCase } from '../application/readViviendaById_UseCase';
import { UpdateViviendaUseCase } from '../application/updateVivienda_UseCase';

import { CreateVivienda_Controller } from './controllers/createVivienda_Controller';
import { ReadAllVivienda_Controller } from './controllers/readAllVivienda_Controller';
import { DeleteVivienda_Controller } from './controllers/deleteVivienda_Controller';
import { ReadViviendaById_Controller } from './controllers/readViviendaById_Controller';
import { UpdateVivienda_Controller } from './controllers/updateVivienda_Controller';
import { ViviendaRelacionesUseCase } from '../application/viviendaRelaciones_UseCase';
import { InMemoryViviendaRelacionesRepository } from './repositories/inMemoryViviendaRelacionesRepository';
import { ViviendaRelacionesController } from './controllers/viviendaRelaciones_Controller';

export const viviendaRepository = new InMemoryViviendaRepository();

export const createViviendaUseCase = new CreateViviendaUseCase(viviendaRepository);
export const readAllViviendaUseCase = new ReadAllViviendaUseCase(viviendaRepository);
export const deleteViviendaUseCase = new DeleteViviendaUseCase(viviendaRepository);
export const readViviendaByIdUseCase = new ReadViviendaByIdUseCase(viviendaRepository);
export const updateViviendaUseCase = new UpdateViviendaUseCase(viviendaRepository);

export const createViviendaController = new CreateVivienda_Controller(createViviendaUseCase);
export const readAllViviendaController = new ReadAllVivienda_Controller(readAllViviendaUseCase);
export const deleteViviendaController = new DeleteVivienda_Controller(deleteViviendaUseCase);
export const readViviendaByIdController = new ReadViviendaById_Controller(readViviendaByIdUseCase);
export const updateViviendaController = new UpdateVivienda_Controller(updateViviendaUseCase);

export const viviendaRelacionesRepository = new InMemoryViviendaRelacionesRepository();
export const viviendaRelacionesUseCase = new ViviendaRelacionesUseCase(viviendaRelacionesRepository);
export const viviendaRelacionesController = new ViviendaRelacionesController(viviendaRelacionesUseCase);
