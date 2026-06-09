import { Cedula } from "../domain/entities/cedula";
import { ICedulaRepository } from "../domain/repositories/ICedulaRepository";
import { assertAllowedValue, assertRequired, rejectFields } from "../../shared/validation";

export class CreateCedulaUseCase {
    constructor(private cedulaRepository: ICedulaRepository) {}

    async execute(cedula: Cedula): Promise<Cedula> {
        rejectFields(cedula as unknown as Record<string, unknown>, [
            'familia_id',
            'esquema_vacunacion_id',
            'composicion_familiar_id'
        ]);
        assertRequired(cedula.unidad_salud_id, 'unidad_salud_id');
        assertRequired(cedula.entrevistador_id, 'entrevistador_id');
        assertRequired(cedula.nucleo_familiar_id, 'nucleo_familiar_id');
        assertRequired(cedula.fecha_registro, 'fecha_registro');
        assertRequired(cedula.estado, 'estado');
        assertAllowedValue(cedula.estado, 'estado', ['borrador', 'sincronizada', 'validada', 'cerrada'] as const);
        return this.cedulaRepository.create(cedula);
    }
}
