import { SqlCrudRepository } from '../../../shared/SqlCrudRepository';
import { IViviendaRelacionesRepository, ViviendaRelacionTipo } from '../../domain/repositories/IViviendaRelacionesRepository';

const repositories = {
  animales: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'familia_animal',
    idColumn: 'id_familia_animal',
    writableColumns: [
      'nucleo_familiar_id',
      'animal_id',
      'otro_especificar',
      'comentarios'
    ]
  })
};

export class InMemoryViviendaRelacionesRepository implements IViviendaRelacionesRepository {
  create(tipo: ViviendaRelacionTipo, data: Record<string, unknown>) {
    return repositories[tipo].create(data);
  }

  readAll(tipo: ViviendaRelacionTipo) {
    return repositories[tipo].readAll();
  }

  readById(tipo: ViviendaRelacionTipo, id: number) {
    return repositories[tipo].readById(id);
  }

  update(tipo: ViviendaRelacionTipo, id: number, data: Record<string, unknown>) {
    return repositories[tipo].update(id, data);
  }

  delete(tipo: ViviendaRelacionTipo, id: number) {
    return repositories[tipo].delete(id);
  }
}
