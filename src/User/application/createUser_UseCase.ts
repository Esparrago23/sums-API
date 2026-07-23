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
    let entrevistador_id = user.entrevistador_id;

    // Si el rol_id es 4 (Entrevistador) o no tiene entrevistador_id y debería, lo creamos.
    // 4 es típicamente el ID del rol Entrevistador en cat_rol.
    if (rol_id === 4 && !entrevistador_id) {
      const db = require('../../../core/db_postgresql').db;
      const unidadSaludId = user.unidad_salud_id ?? 1; // Default fallback
      const newEnt = await db.executePreparedQuery(
        `INSERT INTO entrevistador (nombre, unidad_salud_id, fecha_registro) VALUES ($1, $2, CURRENT_DATE) RETURNING id_entrevistador`,
        [user.nombre_usuario, unidadSaludId]
      );
      entrevistador_id = newEnt.rows[0].id_entrevistador;
    }

    const userWithHashedPassword = { ...user, contrasena: hashedPassword, rol_id, entrevistador_id };

    return this.userRepository.create(userWithHashedPassword);
  }
}