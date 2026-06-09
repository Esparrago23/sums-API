export type PersonaSaludTipo =
  | 'alimentacion'
  | 'higiene'
  | 'toxicomanias'
  | 'enfermedades-cronicas'
  | 'salud-preventiva'
  | 'servicios-salud';

export interface IPersonaSaludRepository {
  create(tipo: PersonaSaludTipo, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  readAll(tipo: PersonaSaludTipo): Promise<Record<string, unknown>[]>;
  readById(tipo: PersonaSaludTipo, id: number): Promise<Record<string, unknown>>;
  update(tipo: PersonaSaludTipo, id: number, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  delete(tipo: PersonaSaludTipo, id: number): Promise<void>;
}
