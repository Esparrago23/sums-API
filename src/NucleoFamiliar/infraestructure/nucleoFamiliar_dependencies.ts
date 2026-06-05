import { CreateNucleoFamiliarUseCase, ReadAllNucleosFamiliaresUseCase, ReadNucleoFamiliarByIdUseCase, UpdateNucleoFamiliarUseCase, DeleteNucleoFamiliarUseCase, AddPersonaNucleoUseCase, ListIntegrantesNucleoUseCase, UpdateIntegranteNucleoUseCase } from '../application/nucleoFamiliar_UseCases';
import { InMemoryNucleoFamiliarRepository } from './repositories/inMemoryNucleoFamiliarRepository';
import { NucleoFamiliarController } from './controllers/nucleoFamiliar_Controller';

const repository = new InMemoryNucleoFamiliarRepository();

export const nucleoFamiliarController = new NucleoFamiliarController(
  new CreateNucleoFamiliarUseCase(repository),
  new ReadAllNucleosFamiliaresUseCase(repository),
  new ReadNucleoFamiliarByIdUseCase(repository),
  new UpdateNucleoFamiliarUseCase(repository),
  new DeleteNucleoFamiliarUseCase(repository),
  new AddPersonaNucleoUseCase(repository),
  new ListIntegrantesNucleoUseCase(repository),
  new UpdateIntegranteNucleoUseCase(repository)
);
