import { db } from '../../../core/db_postgresql';
import { CatalogoItem } from '../../domain/entities/catalogo';
import { CatalogoConfig, ICatalogosRepository } from '../../domain/repositories/ICatalogosRepository';

const catalogos: CatalogoConfig[] = [
  { key: 'estado-civil', tableName: 'cat_estado_civil', idColumn: 'id_estado_civil', labelColumn: 'nombre' },
  { key: 'parentesco', tableName: 'cat_parentesco', idColumn: 'id_parentesco', labelColumn: 'nombre' },
  { key: 'lengua', tableName: 'cat_lengua', idColumn: 'id_lengua', labelColumn: 'nombre' },
  { key: 'escolaridad', tableName: 'cat_escolaridad', idColumn: 'id_escolaridad', labelColumn: 'nombre' },
  { key: 'ocupacion', tableName: 'cat_ocupacion', idColumn: 'id_ocupacion', labelColumn: 'nombre' },
  { key: 'ingreso-salarial', tableName: 'cat_ingreso_salarial', idColumn: 'id_ingreso_salarial', labelColumn: 'rango', descriptionColumn: 'descripcion' },
  { key: 'discapacidad', tableName: 'cat_discapacidad', idColumn: 'id_discapacidad', labelColumn: 'nombre' },
  { key: 'material', tableName: 'cat_material', idColumn: 'id_material', labelColumn: 'nombre' },
  { key: 'tipo-material-vivienda', tableName: 'cat_tipo_material_vivienda', idColumn: 'id_tipo_material_vivienda', labelColumn: 'nombre' },
  { key: 'servicio-vivienda', tableName: 'cat_servicio_vivienda', idColumn: 'id_servicio_vivienda', labelColumn: 'nombre' },
  { key: 'manejo-excretas', tableName: 'cat_manejo_excretas', idColumn: 'id_manejo_excretas', labelColumn: 'nombre' },
  { key: 'animal', tableName: 'cat_animal', idColumn: 'id_animal', labelColumn: 'nombre' },
  { key: 'toxicomania', tableName: 'cat_toxicomania', idColumn: 'id_toxicomania', labelColumn: 'nombre' },
  { key: 'enfermedad-cronica', tableName: 'cat_enfermedad_cronica', idColumn: 'id_enfermedad_cronica', labelColumn: 'nombre' },
  { key: 'alimentacion', tableName: 'cat_alimentacion', idColumn: 'id_alimentacion', labelColumn: 'tipo' },
  { key: 'frecuencia-servicio-salud', tableName: 'cat_frecuencia_servicio_salud', idColumn: 'id_frecuencia_servicio_salud', labelColumn: 'nombre' },
  { key: 'atencion-embarazo', tableName: 'cat_atencion_embarazo', idColumn: 'id_atencion_embarazo', labelColumn: 'nombre' },
  { key: 'vacuna', tableName: 'vacuna', idColumn: 'id_vacuna', labelColumn: 'nombre', descriptionColumn: 'descripcion' },
  { key: 'dosis', tableName: 'cat_dosis', idColumn: 'id_dosis', labelColumn: 'nombre' }
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
}
