import { Vivienda } from "../domain/entities/vivienda";
import { IViviendaRepository } from "../domain/repositories/IViviendaRepository";
import { assertAllowedValue, assertNonNegativeNumber, assertRequired, rejectFields } from "../../shared/validation";

export class CreateViviendaUseCase {
    constructor(private viviendaRepository: IViviendaRepository) {}

    async execute(vivienda: Vivienda): Promise<Vivienda> {
        const data = vivienda as unknown as Record<string, unknown>;
        if (data.familia_id && !data.nucleo_familiar_id) {
            data.nucleo_familiar_id = data.familia_id;
            delete data.familia_id;
        }
        rejectFields(data, ['familia_id', 'servicios_basicos_id', 'cocina_con_leña', 'cocina_con_leÃ±a']);
        assertRequired(vivienda.nucleo_familiar_id, 'nucleo_familiar_id');
        assertNonNegativeNumber(vivienda.numero_cuartos, 'numero_cuartos');
        assertNonNegativeNumber(vivienda.numero_habitantes, 'numero_habitantes');
        assertAllowedValue(vivienda.cocina_ubicacion, 'cocina_ubicacion', ['fuera_del_dormitorio', 'dentro_del_dormitorio'] as const);
        return this.viviendaRepository.create(vivienda);
    }
}
