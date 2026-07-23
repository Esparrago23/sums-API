import { User } from "../domain/entities/User";
import { IUserRepository } from "../domain/repositories/IUserRepositoy";
import { hashPassword } from "../infraestructure/services/bcrypt";
import { getEntrevistadorRolId, ensureEntrevistadorLink } from "../../shared/services/rolCatalog";

// Rol mínimo asignado por defecto a cualquier registro que llegue por la ruta pública
// /register (rol_id = 3 = "analista" en cat_rol). Nunca se debe confiar en el rol_id
// que envía el cliente en un endpoint público: permitir eso habilita auto-asignarse
// superadmin/admin. Crear cuentas administrativas debe hacerse exclusivamente por
// /users/admin/register, protegida con roleMiddleware([1, 2]).
const DEFAULT_PUBLIC_ROL_ID = 3;

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User, options: { allowRoleAssignment?: boolean } = {}): Promise<User> {
    const rol_id = options.allowRoleAssignment ? user.rol_id : DEFAULT_PUBLIC_ROL_ID;
    let unidad_salud_id = user.unidad_salud_id;
    let entrevistador_id = user.entrevistador_id;

    // Mismo resguardo que UpdateUserUseCase: /users/admin/register permite fijar
    // rol_id libremente, pero un alta directa como "entrevistador" sin
    // unidad_salud_id/entrevistador_id dejaba una cuenta que no puede capturar
    // cédulas. Si faltan, se autoprovisiona (ver ensureEntrevistadorLink).
    const entrevistadorRolId = await getEntrevistadorRolId();
    if (
      entrevistadorRolId !== null &&
      Number(rol_id) === entrevistadorRolId &&
      (!unidad_salud_id || !entrevistador_id)
    ) {
      const link = await ensureEntrevistadorLink({
        entrevistadorId: entrevistador_id,
        unidadSaludId: unidad_salud_id,
        nombreUsuario: user.nombre_usuario
      });
      entrevistador_id = link.entrevistadorId;
      unidad_salud_id = link.unidadSaludId;
    }

    const hashedPassword = await hashPassword(user.contrasena);
    const userWithHashedPassword = {
      ...user,
      contrasena: hashedPassword,
      rol_id,
      unidad_salud_id,
      entrevistador_id
    };

    return this.userRepository.create(userWithHashedPassword);
  }
}