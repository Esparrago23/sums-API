import express from 'express';
import { createEntrevistadorController } from '../entrevistador_dependencies';
import { readAllEntrevistadorController } from '../entrevistador_dependencies';
import { deleteEntrevistadorController } from '../entrevistador_dependencies';
import { readEntrevistadorByIdController } from '../entrevistador_dependencies';
import { updateEntrevistadorController } from '../entrevistador_dependencies';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { entrevistadorSchema } from '../../domain/schemas/entrevistadorSchema';
import { authMiddleware } from '../../../User/infraestructure/middleware/authMiddleware';

export const router = express.Router();

/**
 * @swagger
 * /entrevistadores:
 *   post:
 *     summary: Crear entrevistador
 *     tags: [Entrevistadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entrevistador'
 *     responses:
 *       201:
 *         description: Entrevistador creado
 *       400:
 *         description: Datos de entrada inválidos
 *   get:
 *     summary: Listar entrevistadores
 *     tags: [Entrevistadores]
 *     responses:
 *       200:
 *         description: Lista de entrevistadores
 * /roles:
 *   post:
 *     summary: Alias deprecated para crear entrevistador
 *     deprecated: true
 *     tags: [Entrevistadores]
 *     responses:
 *       201:
 *         description: Entrevistador creado
 */
router.post('/entrevistadores', authMiddleware(), validate(entrevistadorSchema), createEntrevistadorController.run.bind(createEntrevistadorController));
router.get('/entrevistadores', authMiddleware(), readAllEntrevistadorController.run.bind(readAllEntrevistadorController));
router.delete('/entrevistadores/:id', authMiddleware(), deleteEntrevistadorController.run.bind(deleteEntrevistadorController));
router.get('/entrevistadores/:id', authMiddleware(), readEntrevistadorByIdController.run.bind(readEntrevistadorByIdController));
router.put('/entrevistadores/:id', authMiddleware(), validate(entrevistadorSchema), updateEntrevistadorController.run.bind(updateEntrevistadorController));

router.post('/roles', authMiddleware(), validate(entrevistadorSchema), createEntrevistadorController.run.bind(createEntrevistadorController));
router.get('/roles', authMiddleware(), readAllEntrevistadorController.run.bind(readAllEntrevistadorController));
router.delete('/roles/:id', authMiddleware(), deleteEntrevistadorController.run.bind(deleteEntrevistadorController));
router.get('/roles/:id', authMiddleware(), readEntrevistadorByIdController.run.bind(readEntrevistadorByIdController));
router.put('/roles/:id', authMiddleware(), validate(entrevistadorSchema), updateEntrevistadorController.run.bind(updateEntrevistadorController));

export default router;
