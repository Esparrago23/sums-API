import { Cedula } from "../domain/entities/cedula";
import { ICedulaRepository } from "../domain/repositories/ICedulaRepository";
import { assertAllowedValue, rejectFields } from "../../shared/validation";

export class UpdateCedulaUseCase {
    constructor(private cedulaRepository: ICedulaRepository) {}

    async execute(id: number, cedulaData: Partial<Cedula>): Promise<Cedula | null> {
        const cedula = await this.cedulaRepository.readById(id);
        if (!cedula) {
            return null;
        }

        rejectFields(cedulaData as Record<string, unknown>, [
            'familia_id',
            'esquema_vacunacion_id',
            'composicion_familiar_id'
        ]);
        if (cedulaData.estado !== undefined) {
            assertAllowedValue(cedulaData.estado, 'estado', ['borrador', 'sincronizada', 'validada', 'cerrada'] as const);
        }

        const updatedCedula = { ...cedula, ...cedulaData };
        return this.cedulaRepository.update(updatedCedula);
    }
}
