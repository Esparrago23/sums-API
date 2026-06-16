export type ViviendaRelacionTipo = 'animales';

export interface IViviendaRelacionesRepository {
  create(tipo: ViviendaRelacionTipo, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  readAll(tipo: ViviendaRelacionTipo): Promise<Record<string, unknown>[]>;
  readById(tipo: ViviendaRelacionTipo, id: number): Promise<Record<string, unknown>>;
  update(tipo: ViviendaRelacionTipo, id: number, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  delete(tipo: ViviendaRelacionTipo, id: number): Promise<void>;
}
