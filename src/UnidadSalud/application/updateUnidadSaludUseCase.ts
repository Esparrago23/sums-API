import { UnidadSalud } from "../domain/entities/UnidadSalud";
import { IUnidadSaludRepository } from "../domain/repositories/IUnidadSaludRepository";
import { assertStringLength, rejectFields } from "../../shared/validation";

export class UpdateUnidadSaludUseCase {
  constructor(private unidadSaludRepository: IUnidadSaludRepository) {}

  async execute(
    id: number,
    unidadSaludData: Partial<UnidadSalud>
  ): Promise<UnidadSalud | null> {
    const unidadSalud = await this.unidadSaludRepository.readById(id);
    if (!unidadSalud) {
      return null;
    }

    rejectFields(unidadSaludData as Record<string, unknown>, ['municipio', 'especialidad']);
    if (unidadSaludData.clues !== undefined) {
      assertStringLength(unidadSaludData.clues, 'clues', 11);
    }

    const updatedUnidadSalud = { ...unidadSalud, ...unidadSaludData };
    return this.unidadSaludRepository.update(updatedUnidadSalud);
  }
}
