// src/User/application/updateUser_UseCase.ts
import { User } from "../domain/entities/User";
import { IUserRepository } from "../domain/repositories/IUserRepositoy";
import { hashPassword } from "../infraestructure/services/bcrypt";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.readById(userId);
    if (!user) {
      return null;
    }

    const updatedUser: any = { ...user, ...userData };

    if (userData.contrasena) {
      // La contraseña nunca se persiste en texto plano: se re-hashea con la misma
      // función usada en el registro antes de pasarla al repositorio.
      updatedUser.contrasena = await hashPassword(userData.contrasena);
    } else {
      // No se envió una contraseña nueva. readById() ya no incluye el hash existente
      // (por seguridad), así que se elimina el campo en vez de persistir "undefined";
      // el repositorio conserva el hash actual vía COALESCE en el UPDATE.
      delete updatedUser.contrasena;
    }

    return this.userRepository.update(updatedUser);
  }
}