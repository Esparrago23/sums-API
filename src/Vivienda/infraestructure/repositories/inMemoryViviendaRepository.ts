import { Vivienda } from '../../domain/entities/vivienda';
import { IViviendaRepository } from '../../domain/repositories/IViviendaRepository';
import { db } from '../../../core/db_postgresql';

export class InMemoryViviendaRepository implements IViviendaRepository {
  async create(vivienda: Vivienda): Promise<Vivienda> {
    const query = `
      INSERT INTO vivienda (
        nucleo_familiar_id, direccion_id, numero_cuartos, numero_habitantes,
        agua_entubada, energia_electrica, cocina_ubicacion, cocina_con_lena,
        manejo_excretas_id, red_alcantarillado, fosa_septica, material_techo_id,
        material_paredes_id, material_piso_id, material_otro_especificar,
        perros_gatos_dentro, mascotas_vacunas_corrientes, mascotas_esterilizadas,
        comentarios
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *, id_vivienda AS id;
    `;
    const values = [
      vivienda.nucleo_familiar_id,
      vivienda.direccion_id ?? null,
      vivienda.numero_cuartos ?? null,
      vivienda.numero_habitantes ?? null,
      vivienda.agua_entubada ?? null,
      vivienda.energia_electrica ?? null,
      vivienda.cocina_ubicacion ?? null,
      vivienda.cocina_con_lena ?? null,
      vivienda.manejo_excretas_id ?? null,
      vivienda.red_alcantarillado ?? null,
      vivienda.fosa_septica ?? null,
      vivienda.material_techo_id ?? null,
      vivienda.material_paredes_id ?? null,
      vivienda.material_piso_id ?? null,
      vivienda.material_otro_especificar ?? null,
      vivienda.perros_gatos_dentro ?? null,
      vivienda.mascotas_vacunas_corrientes ?? null,
      vivienda.mascotas_esterilizadas ?? null,
      vivienda.comentarios ?? null
    ];
    const result = await db.executePreparedQuery(query, values);
    return result.rows[0];
  }

  async update(vivienda: Vivienda): Promise<Vivienda> {
    const query = `
      UPDATE vivienda
      SET nucleo_familiar_id = $1,
          direccion_id = $2,
          numero_cuartos = $3,
          numero_habitantes = $4,
          agua_entubada = $5,
          energia_electrica = $6,
          cocina_ubicacion = $7,
          cocina_con_lena = $8,
          manejo_excretas_id = $9,
          red_alcantarillado = $10,
          fosa_septica = $11,
          material_techo_id = $12,
          material_paredes_id = $13,
          material_piso_id = $14,
          material_otro_especificar = $15,
          perros_gatos_dentro = $16,
          mascotas_vacunas_corrientes = $17,
          mascotas_esterilizadas = $18,
          comentarios = $19
      WHERE id_vivienda = $20
      RETURNING *, id_vivienda AS id;
    `;
    const values = [
      vivienda.nucleo_familiar_id,
      vivienda.direccion_id ?? null,
      vivienda.numero_cuartos ?? null,
      vivienda.numero_habitantes ?? null,
      vivienda.agua_entubada ?? null,
      vivienda.energia_electrica ?? null,
      vivienda.cocina_ubicacion ?? null,
      vivienda.cocina_con_lena ?? null,
      vivienda.manejo_excretas_id ?? null,
      vivienda.red_alcantarillado ?? null,
      vivienda.fosa_septica ?? null,
      vivienda.material_techo_id ?? null,
      vivienda.material_paredes_id ?? null,
      vivienda.material_piso_id ?? null,
      vivienda.material_otro_especificar ?? null,
      vivienda.perros_gatos_dentro ?? null,
      vivienda.mascotas_vacunas_corrientes ?? null,
      vivienda.mascotas_esterilizadas ?? null,
      vivienda.comentarios ?? null,
      vivienda.id
    ];
    const result = await db.executePreparedQuery(query, values);
    if (result.rowCount === 0) {
      throw new Error('Vivienda not found');
    }
    return result.rows[0];
  }

  async readById(id: number): Promise<Vivienda> {
    const query = `
      SELECT *, id_vivienda AS id
      FROM vivienda
      WHERE id_vivienda = $1;
    `;
    const result = await db.executePreparedQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new Error('Vivienda not found');
    }
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await db.executePreparedQuery('DELETE FROM vivienda WHERE id_vivienda = $1', [id]);
  }

  async readAll(): Promise<Vivienda[]> {
    const query = `
      SELECT *, id_vivienda AS id
      FROM vivienda
      ORDER BY id_vivienda;
    `;
    const result = await db.executePreparedQuery(query, []);
    return result.rows;
  }
}
