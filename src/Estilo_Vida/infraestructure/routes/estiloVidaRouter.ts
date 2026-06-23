/**
 * @swagger
 * /estilos-vida:
 *   post:
 *     summary: Create a new lifestyle record
 *     deprecated: true
 *     tags: [EstiloVida]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstiloVida'
 *     responses:
 *       201:
 *         description: Lifestyle record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstiloVida'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all lifestyle records
 *     deprecated: true
 *     tags: [EstiloVida]
 *     responses:
 *       200:
 *         description: List of all lifestyle records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstiloVida'
 * 
 * /estilos-vida/{id}:
 *   get:
 *     summary: Get a lifestyle record by ID
 *     deprecated: true
 *     tags: [EstiloVida]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the lifestyle record
 *     responses:
 *       200:
 *         description: Lifestyle record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstiloVida'
 *       404:
 *         description: Lifestyle record not found
 * 
 *   put:
 *     summary: Update a lifestyle record
 *     deprecated: true
 *     tags: [EstiloVida]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the lifestyle record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstiloVida'
 *     responses:
 *       200:
 *         description: Lifestyle record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstiloVida'
 *       400:
 *         description: Invalid input data / Validation error
 *       404:
 *         description: Lifestyle record not found
 * 
 *   delete:
 *     summary: Delete a lifestyle record
 *     deprecated: true
 *     tags: [EstiloVida]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the lifestyle record to delete
 *     responses:
 *       200:
 *         description: Lifestyle record deleted successfully
 *       404:
 *         description: Lifestyle record not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { estiloVidaSchema } from '../../domain/schemas/estiloVidaSchema';
import { createEstiloVidaController } from '../estiloVida_dependencies';
import { readAllEstiloVidaController } from '../estiloVida_dependencies';
import { deleteEstiloVidaController } from '../estiloVida_dependencies';
import { readEstiloVidaByIdController } from '../estiloVida_dependencies';
import { updateEstiloVidaController } from '../estiloVida_dependencies';



export const router = express.Router();
router.post('/estilos-vida', validate(estiloVidaSchema), createEstiloVidaController.run.bind(createEstiloVidaController));
router.get('/estilos-vida', readAllEstiloVidaController.run.bind(readAllEstiloVidaController));
router.delete('/estilos-vida/:id', deleteEstiloVidaController.run.bind(deleteEstiloVidaController));
router.get('/estilos-vida/:id', readEstiloVidaByIdController.run.bind(readEstiloVidaByIdController));
router.put('/estilos-vida/:id', validate(estiloVidaSchema), updateEstiloVidaController.run.bind(updateEstiloVidaController));

export default router;
