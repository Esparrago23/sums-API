// src/User/domain/entities/User.ts
export class User {
    constructor(
        public id: number,
        public nombre_usuario: string,
        public contrasena: string,
        public rol_id: number,
        public fecha_registro?: Date,
        public activo: boolean = true,
        public unidad_salud_id?: number,
        public datos_laborales_id?: number,
        public entrevistador_id?: number
    ) {}
}
/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - id
 *         - nombre_usuario
 *         - contrasena
 *         - rol_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del usuario
 *         nombre_usuario:
 *           type: string
 *           description: Nombre de usuario para acceso al sistema
 *         contrasena:
 *           type: string
 *           format: password
 *           description: Contraseña de acceso (almacenada de forma segura)
 *         rol_id:
 *           type: integer
 *           description: Referencia al rol asignado al usuario
 *         fecha_registro:
 *           type: string
 *           format: date
 *           description: Fecha de registro del usuario
 *         activo:
 *           type: boolean
 *           default: true
 *           description: Indica si el usuario está activo en el sistema
 *         unidad_salud_id:
 *           type: integer
 *           description: Referencia a la unidad de salud a la que pertenece
 *         datos_laborales_id:
 *           type: integer
 *           description: Referencia a los datos laborales del usuario
 *         entrevistador_id:
 *           type: integer
 *           description: Referencia al perfil de entrevistador del usuario
 */
