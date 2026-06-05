import express from 'express';
import { createEntrevistadorController } from '../entrevistador_dependencies';
import { readAllEntrevistadorController } from '../entrevistador_dependencies';
import { deleteEntrevistadorController } from '../entrevistador_dependencies';
import { readEntrevistadorByIdController } from '../entrevistador_dependencies';
import { updateEntrevistadorController } from '../entrevistador_dependencies';

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
router.post('/entrevistadores', createEntrevistadorController.run.bind(createEntrevistadorController));
router.get('/entrevistadores', readAllEntrevistadorController.run.bind(readAllEntrevistadorController));
router.delete('/entrevistadores/:id', deleteEntrevistadorController.run.bind(deleteEntrevistadorController));
router.get('/entrevistadores/:id', readEntrevistadorByIdController.run.bind(readEntrevistadorByIdController));
router.put('/entrevistadores/:id', updateEntrevistadorController.run.bind(updateEntrevistadorController));

router.post('/roles', createEntrevistadorController.run.bind(createEntrevistadorController));
router.get('/roles', readAllEntrevistadorController.run.bind(readAllEntrevistadorController));
router.delete('/roles/:id', deleteEntrevistadorController.run.bind(deleteEntrevistadorController));
router.get('/roles/:id', readEntrevistadorByIdController.run.bind(readEntrevistadorByIdController));
router.put('/roles/:id', updateEntrevistadorController.run.bind(updateEntrevistadorController));

export default router;
