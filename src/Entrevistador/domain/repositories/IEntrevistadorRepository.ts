import { Entrevistador } from "../entities/entrevistador";

export interface IEntrevistadorRepository {
  create(entrevistador: Entrevistador): Promise<Entrevistador>;
  readAll(): Promise<Entrevistador[]>;
  readById(id: number): Promise<Entrevistador | null>;
  update(entrevistador: Entrevistador): Promise<Entrevistador>;
  delete(id: number): Promise<void>;
}
