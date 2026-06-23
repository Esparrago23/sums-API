/**
 * @swagger
 * /convivencia-animales:
 *   post:
 *     summary: Create a new animal coexistence record
 *     tags: [ConvivenciaAnimales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConvivenciaAnimales'
 *     responses:
 *       201:
 *         description: Animal coexistence record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConvivenciaAnimales'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all animal coexistence records
 *     tags: [ConvivenciaAnimales]
 *     responses:
 *       200:
 *         description: List of all animal coexistence records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConvivenciaAnimales'
 * 
 * /convivencia-animales/{id}:
 *   get:
 *     summary: Get an animal coexistence record by ID
 *     tags: [ConvivenciaAnimales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the animal coexistence record
 *     responses:
 *       200:
 *         description: Animal coexistence record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConvivenciaAnimales'
 *       404:
 *         description: Record not found
 * 
 *   put:
 *     summary: Update an animal coexistence record
 *     tags: [ConvivenciaAnimales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the animal coexistence record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConvivenciaAnimales'
 *     responses:
 *       200:
 *         description: Animal coexistence record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConvivenciaAnimales'
 *       400:
 *         description: Invalid input data / Validation error
 *       404:
 *         description: Record not found
 * 
 *   delete:
 *     summary: Delete an animal coexistence record
 *     tags: [ConvivenciaAnimales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the animal coexistence record to delete
 *     responses:
 *       200:
 *         description: Animal coexistence record deleted successfully
 *       404:
 *         description: Record not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { convivenciaAnimalesSchema } from '../../domain/schemas/convivenciaAnimalesSchema';
import { createConvivenciaAnimalesController } from '../convivenciaAnimales_dependencies';
import { readAllConvivenciaAnimalesController } from '../convivenciaAnimales_dependencies';
import { deleteConvivenciaAnimalesController } from '../convivenciaAnimales_dependencies';
import { readConvivenciaAnimalesByIdController } from '../convivenciaAnimales_dependencies';
import { updateConvivenciaAnimalesController } from '../convivenciaAnimales_dependencies';

export const router = express.Router();

router.post('/convivencia-animales', validate(convivenciaAnimalesSchema), createConvivenciaAnimalesController.run.bind(createConvivenciaAnimalesController));
router.get('/convivencia-animales', readAllConvivenciaAnimalesController.run.bind(readAllConvivenciaAnimalesController));
router.delete('/convivencia-animales/:id', deleteConvivenciaAnimalesController.run.bind(deleteConvivenciaAnimalesController));
router.get('/convivencia-animales/:id', readConvivenciaAnimalesByIdController.run.bind(readConvivenciaAnimalesByIdController));
router.put('/convivencia-animales/:id', validate(convivenciaAnimalesSchema), updateConvivenciaAnimalesController.run.bind(updateConvivenciaAnimalesController));

export default router;
