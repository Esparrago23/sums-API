/**
 * @swagger
 * /dosis:
 *   post:
 *     summary: Create a new dose
 *     tags: [Dosis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dosis'
 *     responses:
 *       201:
 *         description: Dose created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dosis'
 *       400:
 *         description: Invalid input data
 * 
 *   get:
 *     summary: Get all doses
 *     tags: [Dosis]
 *     responses:
 *       200:
 *         description: List of all doses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dosis'
 * 
 * /dosis/{id}:
 *   get:
 *     summary: Get a dose by ID
 *     tags: [Dosis]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the dose
 *     responses:
 *       200:
 *         description: Dose found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dosis'
 *       404:
 *         description: Dose not found
 * 
 *   put:
 *     summary: Update a dose
 *     tags: [Dosis]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the dose to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dosis'
 *     responses:
 *       200:
 *         description: Dose updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dosis'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Dose not found
 * 
 *   delete:
 *     summary: Delete a dose
 *     tags: [Dosis]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the dose to delete
 *     responses:
 *       200:
 *         description: Dose deleted successfully
 *       404:
 *         description: Dose not found
 */

import express from 'express';
import { validate } from '../../../shared/middleware/validateMiddleware';
import { dosisSchema } from '../../domain/schemas/dosisSchema';
import { createDosisController } from '../dosis_dependencies';
import { readAllDosisController } from '../dosis_dependencies';
import { deleteDosisController } from '../dosis_dependencies';
import { readDosisByIdController } from '../dosis_dependencies';
import { updateDosisController } from '../dosis_dependencies';


export const router = express.Router();

router.post('/dosis', validate(dosisSchema), createDosisController.run.bind(createDosisController));
router.get('/dosis', readAllDosisController.run.bind(readAllDosisController));
router.delete('/dosis/:id', deleteDosisController.run.bind(deleteDosisController));
router.get('/dosis/:id', readDosisByIdController.run.bind(readDosisByIdController));
router.put('/dosis/:id', validate(dosisSchema), updateDosisController.run.bind(updateDosisController));

export default router;