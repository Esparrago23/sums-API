import { Persona } from "../domain/entities/Persona";
import { IPersonaRepository } from "../domain/repositories/IPersonaRepository";
import { assertAllowedValue, assertRequired, rejectFields } from "../../shared/validation";

export class CreatePersonaUseCase {
  constructor(private personaRepository: IPersonaRepository) {}

  async execute(persona: Persona): Promise<Persona> {
    rejectFields(persona as unknown as Record<string, unknown>, [
      'familia_id',
      'edad',
      'parentesco',
      'estado_civil',
      'escolaridad',
      'lengua',
      'ocupacion',
      'ingreso'
    ]);
    assertRequired(persona.fecha_nacimiento, 'fecha_nacimiento');
    assertRequired(persona.primer_nombre, 'primer_nombre');
    assertRequired(persona.apellido_paterno, 'apellido_paterno');
    assertRequired(persona.sexo, 'sexo');
    assertAllowedValue(persona.sexo, 'sexo', ['masculino', 'femenino'] as const);
    return this.personaRepository.create(persona);
  }
}
