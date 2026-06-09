import { Vivienda } from "../domain/entities/vivienda";
import { IViviendaRepository } from "../domain/repositories/IViviendaRepository";
import { assertAllowedValue, assertNonNegativeNumber, rejectFields } from "../../shared/validation";

export class UpdateViviendaUseCase {
    constructor(private viviendaRepository: IViviendaRepository) {}

    async execute(id: number, viviendaData: Partial<Vivienda>): Promise<Vivienda | null> {
        const vivienda = await this.viviendaRepository.readById(id);
        if (!vivienda) {
            return null;
        }

        const data = viviendaData as Record<string, unknown>;
        if (data.familia_id && !data.nucleo_familiar_id) {
            data.nucleo_familiar_id = data.familia_id;
            delete data.familia_id;
        }
        rejectFields(data, ['familia_id', 'servicios_basicos_id', 'cocina_con_leña', 'cocina_con_leÃ±a']);
        assertNonNegativeNumber(viviendaData.numero_cuartos, 'numero_cuartos');
        assertNonNegativeNumber(viviendaData.numero_habitantes, 'numero_habitantes');
        assertAllowedValue(viviendaData.cocina_ubicacion, 'cocina_ubicacion', ['fuera_del_dormitorio', 'dentro_del_dormitorio'] as const);

        const updatedVivienda = { ...vivienda, ...viviendaData };
        return this.viviendaRepository.update(updatedVivienda);
    }
}
