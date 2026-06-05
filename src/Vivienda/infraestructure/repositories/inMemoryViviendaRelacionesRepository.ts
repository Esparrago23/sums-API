import { SqlCrudRepository } from '../../../shared/SqlCrudRepository';
import { IViviendaRelacionesRepository, ViviendaRelacionTipo } from '../../domain/repositories/IViviendaRelacionesRepository';

const repositories = {
  materiales: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'vivienda_material',
    idColumn: 'id_vivienda_material',
    writableColumns: ['vivienda_id', 'tipo_material_vivienda_id', 'material_id', 'otro_especificar']
  }),
  servicios: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'vivienda_servicio',
    idColumn: 'id_vivienda_servicio',
    writableColumns: ['vivienda_id', 'servicio_vivienda_id', 'disponible']
  }),
  animales: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'familia_animal',
    idColumn: 'id_familia_animal',
    writableColumns: [
      'nucleo_familiar_id',
      'animal_id',
      'cantidad',
      'vive_dentro_vivienda',
      'esquema_vacunas_corriente',
      'esterilizado',
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
