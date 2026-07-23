import { Cedula } from "../entities/cedula";

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ICedulaRepository {
    create(cedula: Cedula): Promise<Cedula>;
    readAll(page: number, limit: number, search: string): Promise<PaginatedResult<Cedula>>;
    readById(id: number): Promise<Cedula>;
    update(cedula: Cedula): Promise<Cedula>;
    delete(id: number): Promise<void>;
}