// src/User/application/updateUser_UseCase.ts
import { User } from "../domain/entities/User";
import { IUserRepository } from "../domain/repositories/IUserRepositoy";
import { hashPassword } from "../infraestructure/services/bcrypt";
import { getEntrevistadorRolId, ensureEntrevistadorLink } from "../../shared/services/rolCatalog";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.readById(userId);
    if (!user) {
      return null;
    }

    const updatedUser: any = { ...user, ...userData };

    // Un usuario con rol "entrevistador" sin unidad_salud_id/entrevistador_id
    // queda con el rol pero sin poder capturar cédulas (el móvil rechaza sus
    // registros por violar la FK cedula_entrevistador_id_fkey). PUT /users/:id
    // y PUT /users/:id/role antes solo tocaban rol_id, dejando pasar esta
    // cuenta a medio configurar. Ahora, si faltan, se autoprovisiona el
    // registro de entrevistador (ver ensureEntrevistadorLink).
    const entrevistadorRolId = await getEntrevistadorRolId();
    if (
      entrevistadorRolId !== null &&
      Number(updatedUser.rol_id) === entrevistadorRolId &&
      (!updatedUser.unidad_salud_id || !updatedUser.entrevistador_id)
    ) {
      const link = await ensureEntrevistadorLink({
        entrevistadorId: updatedUser.entrevistador_id,
        unidadSaludId: updatedUser.unidad_salud_id,
        nombreUsuario: updatedUser.nombre_usuario
      });
      updatedUser.entrevistador_id = link.entrevistadorId;
      updatedUser.unidad_salud_id = link.unidadSaludId;
    }

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