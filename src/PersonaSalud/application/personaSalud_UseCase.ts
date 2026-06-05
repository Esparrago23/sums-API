import { IPersonaSaludRepository, PersonaSaludTipo } from '../domain/repositories/IPersonaSaludRepository';

export class PersonaSaludUseCase {
  constructor(private repository: IPersonaSaludRepository) {}

  create(tipo: PersonaSaludTipo, data: Record<string, unknown>) {
    return this.repository.create(tipo, data);
  }

  readAll(tipo: PersonaSaludTipo) {
    return this.repository.readAll(tipo);
  }

  readById(tipo: PersonaSaludTipo, id: number) {
    return this.repository.readById(tipo, id);
  }

  update(tipo: PersonaSaludTipo, id: number, data: Record<string, unknown>) {
    return this.repository.update(tipo, id, data);
  }

  delete(tipo: PersonaSaludTipo, id: number) {
    return this.repository.delete(tipo, id);
  }
}
