import { Persona } from "../domain/entities/Persona";
import { IPersonaRepository } from "../domain/repositories/IPersonaRepository";
import { assertAllowedValue, rejectFields } from "../../shared/validation";

export class UpdatePersonaUseCase {
  constructor(private personaRepository: IPersonaRepository) {}

  async execute(id: number, personaData: Partial<Persona>): Promise<Persona | null> {
    const persona = await this.personaRepository.readById(id);
    if (!persona) {
      return null;
    }

    rejectFields(personaData as Record<string, unknown>, [
      'familia_id',
      'edad',
      'parentesco',
      'estado_civil',
      'escolaridad',
      'lengua',
      'ocupacion',
      'ingreso'
    ]);
    if (personaData.sexo !== undefined) {
      assertAllowedValue(personaData.sexo, 'sexo', ['masculino', 'femenino'] as const);
    }

    const updatedPersona = { ...persona, ...personaData };
    return this.personaRepository.update(updatedPersona);
  }
}
