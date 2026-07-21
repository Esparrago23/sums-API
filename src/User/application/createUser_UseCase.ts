import { User } from "../domain/entities/User";
import { IUserRepository } from "../domain/repositories/IUserRepositoy";
import { hashPassword } from "../infraestructure/services/bcrypt";

// Rol mínimo asignado por defecto a cualquier registro que llegue por la ruta pública
// /register (rol_id = 3 = "analista" en cat_rol). Nunca se debe confiar en el rol_id
// que envía el cliente en un endpoint público: permitir eso habilita auto-asignarse
// superadmin/admin. Crear cuentas administrativas debe hacerse exclusivamente por
// /users/admin/register, protegida con roleMiddleware([1, 2]).
const DEFAULT_PUBLIC_ROL_ID = 3;

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User, options: { allowRoleAssignment?: boolean } = {}): Promise<User> {
    const hashedPassword = await hashPassword(user.contrasena);
    const rol_id = options.allowRoleAssignment ? user.rol_id : DEFAULT_PUBLIC_ROL_ID;
    const userWithHashedPassword = { ...user, contrasena: hashedPassword, rol_id };

    return this.userRepository.create(userWithHashedPassword);
  }
}