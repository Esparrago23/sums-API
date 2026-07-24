/**
 * @swagger
 * /cedulas:
 *   post:
 *     summary: Create a new cedula
 *     tags: [Cedulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cedula'
 *     responses:
 *       201:
 *         description: Cedula created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cedula'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all cedulas paginated
 *     tags: [Cedulas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page (max 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text on the full name
 *     responses:
 *       200:
 *         description: Paginated list of cedulas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cedula'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 * 
 * /cedulas/{id}:
 *   get:
 *     summary: Get a cedula by ID
 *     tags: [Cedulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the cedula
 *     responses:
 *       200:
 *         description: Cedula found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cedula'
 *       404:
 *         description: Cedula not found
 * 
 *   put:
 *     summary: Update a cedula
 *     tags: [Cedulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the cedula to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cedula'
 *     responses:
 *       200:
 *         description: Cedula updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cedula'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Cedula not found
 * 
 *   delete:
 *     summary: Delete a cedula
 *     tags: [Cedulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the cedula to delete
 *     responses:
 *       200:
 *         description: Cedula deleted successfully
 *       404:
 *         description: Cedula not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { cedulaSchema, capturaCompletaSchema, syncCedulasSchema } from '../../domain/schemas/cedulaSchema';
import { createCedulaController } from '../cedula_dependencies';
import { readAllCedulaController } from '../cedula_dependencies';
import { deleteCedulaController } from '../cedula_dependencies';
import { readCedulaByIdController } from '../cedula_dependencies';
import { updateCedulaController } from '../cedula_dependencies';
import { capturaCompletaCedulaController } from '../cedula_dependencies';
import { syncCedulasController } from '../cedula_dependencies';
import { authMiddleware } from '../../../User/infraestructure/middleware/authMiddleware';
import { roleMiddleware } from '../../../shared/middleware/roleMiddleware';

// Roles con permiso para levantar/sincronizar cédulas en campo:
// 1 = superadmin, 2 = admin, 4 = entrevistador.
const CAPTURA_ROLES = [1, 2, 4];

export const router = express.Router();
router.post('/cedulas', authMiddleware(), validate(cedulaSchema), createCedulaController.run.bind(createCedulaController));
router.post(
  '/cedulas/captura-completa',
  authMiddleware(),
  roleMiddleware(CAPTURA_ROLES),
  validate(capturaCompletaSchema),
  capturaCompletaCedulaController.run.bind(capturaCompletaCedulaController)
);
router.post(
  '/sums/sync',
  authMiddleware(),
  roleMiddleware(CAPTURA_ROLES),
  validate(syncCedulasSchema),
  syncCedulasController.run.bind(syncCedulasController)
);
router.get('/cedulas', authMiddleware(), readAllCedulaController.run.bind(readAllCedulaController));
router.delete('/cedulas/:id', authMiddleware(), roleMiddleware([1, 2]), deleteCedulaController.run.bind(deleteCedulaController));
router.get('/cedulas/:id', authMiddleware(), readCedulaByIdController.run.bind(readCedulaByIdController));
router.put('/cedulas/:id', authMiddleware(), roleMiddleware([1, 2]), validate(cedulaSchema), updateCedulaController.run.bind(updateCedulaController));

export default router;
