import { SqlCrudRepository } from '../../../shared/SqlCrudRepository';
import { IPersonaSaludRepository, PersonaSaludTipo } from '../../domain/repositories/IPersonaSaludRepository';

const repositories = {
  alimentacion: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_alimentacion',
    idColumn: 'id_persona_alimentacion',
    writableColumns: ['persona_id', 'dias_proteina', 'dias_frutas_verduras', 'dias_cereales', 'fecha_registro']
  }),
  higiene: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_higiene',
    idColumn: 'id_persona_higiene',
    writableColumns: ['persona_id', 'higiene_bano_bucodental_diaria', 'fecha_registro']
  }),
  'seguridad-social': new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_seguridad_social',
    idColumn: 'id_persona_seguridad_social',
    writableColumns: ['persona_id', 'cuenta_seguridad_social', 'fecha_registro']
  }),
  discapacidades: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_discapacidad',
    idColumn: 'id_persona_discapacidad',
    writableColumns: ['persona_id', 'presenta_discapacidad', 'tipo_discapacidad']
  }),
  toxicomanias: new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_toxicomania',
    idColumn: 'id_persona_toxicomania',
    writableColumns: ['persona_id', 'toxicomania_id', 'otra_sustancia']
  }),
  'enfermedades-cronicas': new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_enfermedad_cronica',
    idColumn: 'id_persona_enfermedad_cronica',
    writableColumns: ['persona_id', 'enfermedad_cronica_id']
  }),
  'salud-preventiva': new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_salud_preventiva',
    idColumn: 'id_persona_salud_preventiva',
    writableColumns: [
      'persona_id',
      'atencion_embarazo_id',
      'tamizaje_cervico_uterino',
      'fecha_tamizaje_cervico_uterino',
      'tamizaje_cancer_mama',
      'fecha_tamizaje_cancer_mama',
      'fecha_registro'
    ]
  }),
  'servicios-salud': new SqlCrudRepository<Record<string, unknown>>({
    tableName: 'persona_servicio_salud',
    idColumn: 'id_persona_servicio_salud',
    writableColumns: ['persona_id', 'frecuencia_servicio_salud_id', 'motivo_uso', 'fecha_registro']
  })
};

export class InMemoryPersonaSaludRepository implements IPersonaSaludRepository {
  create(tipo: PersonaSaludTipo, data: Record<string, unknown>) {
    return repositories[tipo].create(data);
  }

  readAll(tipo: PersonaSaludTipo) {
    return repositories[tipo].readAll();
  }

  readById(tipo: PersonaSaludTipo, id: number) {
    return repositories[tipo].readById(id);
  }

  update(tipo: PersonaSaludTipo, id: number, data: Record<string, unknown>) {
    return repositories[tipo].update(id, data);
  }

  delete(tipo: PersonaSaludTipo, id: number) {
    return repositories[tipo].delete(id);
  }
}
