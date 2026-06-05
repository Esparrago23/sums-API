import { IViviendaRelacionesRepository, ViviendaRelacionTipo } from '../domain/repositories/IViviendaRelacionesRepository';

export class ViviendaRelacionesUseCase {
  constructor(private repository: IViviendaRelacionesRepository) {}

  create(tipo: ViviendaRelacionTipo, data: Record<string, unknown>) {
    return this.repository.create(tipo, data);
  }

  readAll(tipo: ViviendaRelacionTipo) {
    return this.repository.readAll(tipo);
  }

  readById(tipo: ViviendaRelacionTipo, id: number) {
    return this.repository.readById(tipo, id);
  }

  update(tipo: ViviendaRelacionTipo, id: number, data: Record<string, unknown>) {
    return this.repository.update(tipo, id, data);
  }

  delete(tipo: ViviendaRelacionTipo, id: number) {
    return this.repository.delete(tipo, id);
  }
}
