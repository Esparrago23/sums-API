import { NucleoFamiliar, NucleoPersona } from '../entities/nucleoFamiliar';

export interface INucleoFamiliarRepository {
  create(nucleo: NucleoFamiliar): Promise<NucleoFamiliar>;
  readAll(): Promise<NucleoFamiliar[]>;
  readById(id: number): Promise<NucleoFamiliar>;
  update(nucleo: NucleoFamiliar): Promise<NucleoFamiliar>;
  delete(id: number): Promise<void>;
  addPersona(nucleoPersona: NucleoPersona): Promise<NucleoPersona>;
  listIntegrantes(nucleoFamiliarId: number): Promise<NucleoPersona[]>;
  updateIntegrante(
    nucleoFamiliarId: number,
    personaId: number,
    data: Partial<NucleoPersona>
  ): Promise<NucleoPersona>;
}
