import { Cedula } from "../domain/entities/cedula";
import { ICedulaRepository, PaginatedResult } from "../domain/repositories/ICedulaRepository";

export class ReadAllCedulaUseCase {
    constructor(private cedulaRepository: ICedulaRepository) {}

    async execute(page: number, limit: number, search: string): Promise<PaginatedResult<Cedula>> {
        return this.cedulaRepository.readAll(page, limit, search);
    }
}