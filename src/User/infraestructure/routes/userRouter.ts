/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar un nuevo usuario básico
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos de entrada inválidos
 *
 * /register-entrevistador:
 *   post:
 *     summary: Registrar entrevistador completo (Módulos I y II de la cédula)
 *     description: |
 *       Crea en una sola petición la unidad de salud (Módulo I), los datos laborales
 *       y el entrevistador (Módulo II) y el usuario de acceso al sistema.
 *       Si la CLUES ya existe, actualiza los datos de la unidad de salud.
 *       El rol `entrevistador` se crea automáticamente si no existe.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - unidad_salud
 *               - entrevistador
 *             properties:
 *               usuario:
 *                 type: object
 *                 required:
 *                   - nombre_usuario
 *                   - contrasena
 *                 properties:
 *                   nombre_usuario:
 *                     type: string
 *                     example: "laura.mendez"
 *                   contrasena:
 *                     type: string
 *                     format: password
 *                     example: "secreto123"
 *               unidad_salud:
 *                 type: object
 *                 required:
 *                   - clues
 *                   - nombre
 *                 properties:
 *                   clues:
 *                     type: string
 *                     example: "CSMSS000001"
 *                     description: "Código de 11 caracteres (5 letras + 6 números)"
 *                   nombre:
 *                     type: string
 *                     example: "Centro de Salud Urbano Tonalá"
 *                   distrito:
 *                     type: string
 *                     example: "Distrito Sanitario IV"
 *                   municipio_id:
 *                     type: integer
 *                     example: 42
 *                   numero_nucleos:
 *                     type: integer
 *                     example: 87
 *               datos_laborales:
 *                 type: object
 *                 properties:
 *                   turno:
 *                     type: string
 *                     example: "Matutino"
 *                     description: "Nombre del turno (Matutino / Vespertino)"
 *                   horario_inicio:
 *                     type: string
 *                     example: "08:00"
 *                   horario_fin:
 *                     type: string
 *                     example: "14:00"
 *                   cargo:
 *                     type: string
 *                     example: "Médico General"
 *                   especialidad:
 *                     type: string
 *                     example: "Medicina Familiar"
 *               entrevistador:
 *                 type: object
 *                 required:
 *                   - nombre
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     example: "Dra. Laura Méndez Torres"
 *     responses:
 *       201:
 *         description: Entrevistador registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: "Usuario creado (sin contraseña)"
 *                 unidad_salud:
 *                   type: object
 *                   description: "Unidad de salud creada o actualizada"
 *                 datos_laborales:
 *                   type: object
 *                   nullable: true
 *                   description: "Datos laborales creados (null si no se enviaron)"
 *                 entrevistador:
 *                   type: object
 *                   description: "Registro del entrevistador"
 *       400:
 *         description: "Datos inválidos o nombre_usuario / CLUES duplicados"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * /login:
 *   post:
 *     summary: Autenticar usuario y obtener token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasena
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *               contrasena:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del usuario
 *                     nombre_usuario:
 *                       type: string
 *                       description: Nombre de usuario
 *                     rol_id:
 *                       type: integer
 *                       description: ID del rol del usuario
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha de registro del usuario
 *                     activo:
 *                       type: boolean
 *                       description: Estado del usuario
 *                     unidad_salud_id:
 *                       type: integer
 *                       description: ID de la unidad de salud
 *                     datos_laborales_id:
 *                       type: integer
 *                       description: ID de los datos laborales
 *       401:
 *         description: Autenticación fallida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 * 
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Unauthorized access
 * 
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 * 
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 * 
 * /users/admin/register:
 *   post:
 *     summary: Crea un nuevo usuario y le asigna un rol (Solo Admin/Superadmin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasena
 *               - rol_id
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *               contrasena:
 *                 type: string
 *                 format: password
 *               rol_id:
 *                 type: integer
 *                 description: "1 = superadmin, 2 = admin, 3 = analista, 4 = entrevistador"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Errores de validación
 *       403:
 *         description: Acceso denegado
 * 
 * /users/{id}/role:
 *   put:
 *     summary: Actualiza el rol de un usuario (Solo Admin/Superadmin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rol_id
 *             properties:
 *               rol_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Errores de validación
 *       403:
 *         description: Acceso denegado
 */

import express from 'express';
import { createUserController, readAllUserController, deleteUserController,
         readUserByIdController, updateUserController, loginUserController,
         createEntrevistadorUserController, updateUserRoleController } from '../user_dependencies';

import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../../../shared/middleware/roleMiddleware';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { createUserAdminSchema, updateUserRoleSchema } from '../../domain/schemas/userSchema';

export const router = express.Router();

router.post('/register', createUserController.run.bind(createUserController));
router.post('/login', loginUserController.run.bind(loginUserController));
router.post('/register-entrevistador', createEntrevistadorUserController.run.bind(createEntrevistadorUserController));

// Protected routes (authentication required)
router.get('/users', authMiddleware(), readAllUserController.run.bind(readAllUserController));
router.delete('/users/:id', authMiddleware(), deleteUserController.run.bind(deleteUserController));
router.get('/users/:id', authMiddleware(), readUserByIdController.run.bind(readUserByIdController));
router.put('/users/:id', authMiddleware(), updateUserController.run.bind(updateUserController));

// Admin routes (require roles: 1 = superadmin, 2 = admin)
router.post(
  '/users/admin/register',
  roleMiddleware([1, 2]),
  validate(createUserAdminSchema),
  createUserController.run.bind(createUserController)
);

router.put(
  '/users/:id/role',
  roleMiddleware([1, 2]),
  validate(updateUserRoleSchema),
  updateUserRoleController.run.bind(updateUserRoleController)
);

export default router;
