import { db } from '../../../core/db_postgresql';
import { CatalogoItem } from '../../domain/entities/catalogo';
import { CatalogoConfig, ICatalogosRepository } from '../../domain/repositories/ICatalogosRepository';

const catalogos: CatalogoConfig[] = [
  { key: 'entidad', tableName: 'cat_entidad', idColumn: 'id_entidad', labelColumn: 'nombre' },
  { key: 'municipio', tableName: 'cat_municipio', idColumn: 'id_municipio', labelColumn: 'nombre' },
  { key: 'zona', tableName: 'cat_zona', idColumn: 'id_zona', labelColumn: 'zona' },
  { key: 'tipo-asentamiento', tableName: 'cat_tipo_asentamiento', idColumn: 'id_tipo_asentamiento', labelColumn: 'tipo_asentamiento' },
  { key: 'asentamiento', tableName: 'cat_asentamiento', idColumn: 'id_asentamiento', labelColumn: 'nombre' },
  { key: 'turno', tableName: 'cat_turno', idColumn: 'id_turno', labelColumn: 'nombre' },
  { key: 'estado-civil', tableName: 'cat_estado_civil', idColumn: 'id_estado_civil', labelColumn: 'nombre' },
  { key: 'estado_civil', tableName: 'cat_estado_civil', idColumn: 'id_estado_civil', labelColumn: 'nombre' },
  { key: 'parentesco', tableName: 'cat_parentesco', idColumn: 'id_parentesco', labelColumn: 'nombre' },
  { key: 'lengua', tableName: 'cat_lengua', idColumn: 'id_lengua', labelColumn: 'nombre' },
  { key: 'escolaridad', tableName: 'cat_escolaridad', idColumn: 'id_escolaridad', labelColumn: 'nombre' },
  { key: 'ocupacion', tableName: 'cat_ocupacion', idColumn: 'id_ocupacion', labelColumn: 'nombre' },
  { key: 'ingreso-salarial', tableName: 'cat_ingreso_salarial', idColumn: 'id_ingreso_salarial', labelColumn: 'rango', descriptionColumn: 'descripcion' },
  { key: 'ingreso', tableName: 'cat_ingreso_salarial', idColumn: 'id_ingreso_salarial', labelColumn: 'rango', descriptionColumn: 'descripcion' },
  { key: 'material', tableName: 'cat_material', idColumn: 'id_material', labelColumn: 'nombre' },
  { key: 'materiales_piso', tableName: 'cat_material', idColumn: 'id_material', labelColumn: 'nombre' },
  { key: 'manejo-excretas', tableName: 'cat_manejo_excretas', idColumn: 'id_manejo_excretas', labelColumn: 'nombre' },
  { key: 'manejo_excretas', tableName: 'cat_manejo_excretas', idColumn: 'id_manejo_excretas', labelColumn: 'nombre' },
  { key: 'animal', tableName: 'cat_animal', idColumn: 'id_animal', labelColumn: 'nombre' },
  { key: 'otros_animales', tableName: 'cat_animal', idColumn: 'id_animal', labelColumn: 'nombre' },
  { key: 'toxicomania', tableName: 'cat_toxicomania', idColumn: 'id_toxicomania', labelColumn: 'nombre' },
  { key: 'toxicomanias', tableName: 'cat_toxicomania', idColumn: 'id_toxicomania', labelColumn: 'nombre' },
  { key: 'enfermedad-cronica', tableName: 'cat_enfermedad_cronica', idColumn: 'id_enfermedad_cronica', labelColumn: 'nombre' },
  { key: 'cronicas', tableName: 'cat_enfermedad_cronica', idColumn: 'id_enfermedad_cronica', labelColumn: 'nombre' },
  { key: 'frecuencia-servicio-salud', tableName: 'cat_frecuencia_servicio_salud', idColumn: 'id_frecuencia_servicio_salud', labelColumn: 'nombre' },
  { key: 'frecuencia_salud', tableName: 'cat_frecuencia_servicio_salud', idColumn: 'id_frecuencia_servicio_salud', labelColumn: 'nombre' },
  { key: 'atencion-embarazo', tableName: 'cat_atencion_embarazo', idColumn: 'id_atencion_embarazo', labelColumn: 'nombre' },
  { key: 'embarazo', tableName: 'cat_atencion_embarazo', idColumn: 'id_atencion_embarazo', labelColumn: 'nombre' },
  { key: 'vacuna', tableName: 'vacuna', idColumn: 'id_vacuna', labelColumn: 'nombre', descriptionColumn: 'descripcion' },
  { key: 'vacunas', tableName: 'vacuna', idColumn: 'id_vacuna', labelColumn: 'nombre', descriptionColumn: 'descripcion' },
  { key: 'dosis', tableName: 'cat_dosis', idColumn: 'id_dosis', labelColumn: 'nombre' },
  { key: 'roles', tableName: 'cat_rol', idColumn: 'id_rol', labelColumn: 'nombre', descriptionColumn: 'descripcion' },
  { key: 'ubicacion_cocina', staticData: [{ id: 'fuera_del_dormitorio', nombre: 'Fuera del dormitorio' }, { id: 'dentro_del_dormitorio', nombre: 'Dentro del dormitorio' }] },
  { key: 'sexo', staticData: [{ id: 'masculino', nombre: 'Masculino' }, { id: 'femenino', nombre: 'Femenino' }] },
  { key: 'tamizaje', staticData: [{ id: true, nombre: 'Sí' }, { id: false, nombre: 'No' }] }
];

export class InMemoryCatalogosRepository implements ICatalogosRepository {
  listCatalogos(): CatalogoConfig[] {
    return catalogos;
  }

  async readAll(key: string): Promise<CatalogoItem[]> {
    const config = catalogos.find((catalogo) => catalogo.key === key);
    if (!config) {
      throw new Error(`Catalogo no soportado: ${key}`);
    }

    if (config.staticData) {
      return config.staticData as any;
    }

    const descriptionSelect = config.descriptionColumn
      ? `${config.descriptionColumn} AS descripcion`
      : 'NULL AS descripcion';
    const query = `
      SELECT ${config.idColumn} AS id,
             ${config.labelColumn} AS nombre,
             ${descriptionSelect}
      FROM ${config.tableName}
      ORDER BY ${config.labelColumn};
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }

  async createCatalogItem(key: string, data: Partial<CatalogoItem>): Promise<CatalogoItem> {
    const config = catalogos.find((catalogo) => catalogo.key === key);
    if (!config) {
      throw new Error(`Catalogo no soportado: ${key}`);
    }

    if (config.staticData) {
      throw new Error(`No se pueden insertar elementos en catalogos estáticos: ${key}`);
    }

    const cols = [config.labelColumn!];
    const vals: any[] = [data.nombre];

    if (config.descriptionColumn && data.descripcion) {
      cols.push(config.descriptionColumn);
      vals.push(data.descripcion);
    }

    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      INSERT INTO ${config.tableName} (${cols.join(', ')})
      VALUES (${placeholders})
      RETURNING ${config.idColumn} AS id, ${config.labelColumn} AS nombre
      ${config.descriptionColumn ? `, ${config.descriptionColumn} AS descripcion` : ''};
    `;

    const result = await db.executePreparedQuery(query, vals);
    return result.rows[0];
  }
}
