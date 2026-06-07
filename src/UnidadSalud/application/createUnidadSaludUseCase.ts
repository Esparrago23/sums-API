import { UnidadSalud } from "../domain/entities/UnidadSalud";
import { IUnidadSaludRepository } from "../domain/repositories/IUnidadSaludRepository";
import { assertRequired, assertStringLength, rejectFields } from "../../shared/validation";

export class CreateUnidadSaludUseCase {
  constructor(private unidadSaludRepository: IUnidadSaludRepository) {}

  async execute(unidadSalud: UnidadSalud): Promise<UnidadSalud> {
    rejectFields(unidadSalud as unknown as Record<string, unknown>, ['municipio', 'especialidad']);
    assertRequired(unidadSalud.clues, 'clues');
    assertRequired(unidadSalud.nombre, 'nombre');
    assertStringLength(unidadSalud.clues, 'clues', 11);
    return this.unidadSaludRepository.create(unidadSalud);
  }
}
