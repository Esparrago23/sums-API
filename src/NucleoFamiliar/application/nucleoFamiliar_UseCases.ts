import { NucleoFamiliar, NucleoPersona } from '../domain/entities/nucleoFamiliar';
import { INucleoFamiliarRepository } from '../domain/repositories/INucleoFamiliarRepository';

export class CreateNucleoFamiliarUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  execute(data: NucleoFamiliar): Promise<NucleoFamiliar> {
    return this.repository.create(data);
  }
}

export class ReadAllNucleosFamiliaresUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  execute(): Promise<NucleoFamiliar[]> {
    return this.repository.readAll();
  }
}

export class ReadNucleoFamiliarByIdUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  execute(id: number): Promise<NucleoFamiliar> {
    return this.repository.readById(id);
  }
}

export class UpdateNucleoFamiliarUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  async execute(id: number, data: Partial<NucleoFamiliar>): Promise<NucleoFamiliar> {
    const current = await this.repository.readById(id);
    return this.repository.update({ ...current, ...data });
  }
}

export class DeleteNucleoFamiliarUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  execute(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}

export class AddPersonaNucleoUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  execute(data: NucleoPersona): Promise<NucleoPersona> {
    return this.repository.addPersona(data);
  }
}

export class ListIntegrantesNucleoUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  execute(nucleoFamiliarId: number): Promise<NucleoPersona[]> {
    return this.repository.listIntegrantes(nucleoFamiliarId);
  }
}

export class UpdateIntegranteNucleoUseCase {
  constructor(private repository: INucleoFamiliarRepository) {}
  execute(
    nucleoFamiliarId: number,
    personaId: number,
    data: Partial<NucleoPersona>
  ): Promise<NucleoPersona> {
    return this.repository.updateIntegrante(nucleoFamiliarId, personaId, data);
  }
}
