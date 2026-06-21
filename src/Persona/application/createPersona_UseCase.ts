import { Persona } from "../domain/entities/Persona";
import { IPersonaRepository } from "../domain/repositories/IPersonaRepository";
import { assertAllowedValue, assertRequired, rejectFields } from "../../shared/validation";

export class CreatePersonaUseCase {
  constructor(private personaRepository: IPersonaRepository) {}

  async execute(persona: Persona): Promise<Persona> {
    const data = persona as unknown as Record<string, unknown>;
    this.normalizeFormAliases(data);
    rejectFields(data, [
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

  private normalizeFormAliases(data: Record<string, unknown>): void {
    if (data.ocupacion !== undefined && data.ocupacion_texto === undefined) {
      data.ocupacion_texto = data.ocupacion;
      delete data.ocupacion;
    }
    if (data.seguridad_social !== undefined && data.cuenta_seguridad_social === undefined) {
      data.cuenta_seguridad_social = data.seguridad_social;
      delete data.seguridad_social;
    }
    if (data.discapacidad !== undefined && data.presenta_discapacidad === undefined) {
      data.presenta_discapacidad = data.discapacidad;
      delete data.discapacidad;
    }
    if (data.lengua_especificar !== undefined && data.lengua_indigena_especificar === undefined) {
      data.lengua_indigena_especificar = data.lengua_especificar;
      delete data.lengua_especificar;
    }
  }
}
