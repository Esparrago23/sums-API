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

    const data = personaData as Record<string, unknown>;
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
    if (personaData.sexo !== undefined) {
      assertAllowedValue(personaData.sexo, 'sexo', ['masculino', 'femenino'] as const);
    }

    const updatedPersona = { ...persona, ...personaData };
    return this.personaRepository.update(updatedPersona);
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
